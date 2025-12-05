import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Verify the webhook secret (optional but recommended for security)
        const secret = request.nextUrl.searchParams.get("secret");
        const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

        if (expectedSecret && secret !== expectedSecret) {
            return NextResponse.json(
                { message: "Invalid secret" },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Handle different Sanity webhook payload formats
        // Format 1: Direct document data { _type, slug, ... }
        // Format 2: Sanity webhook format { projectId, dataset, ids: { created, updated, deleted } }
        let documentType: string | null = null;
        let slug: { current?: string } | undefined = undefined;

        if (body._type) {
            // Direct document format
            documentType = body._type;
            slug = body.slug;
        } else if (body.ids) {
            // Sanity webhook format - we need to fetch the document to get its type
            // For now, we'll revalidate everything if we get this format
            // In production, you might want to fetch the document from Sanity to get its type
            revalidatePath("/");
            revalidatePath("/blog");
            revalidatePath("/api/projects");
            revalidatePath("/api/faqs");
            revalidatePath("/api/admin-team-members");
            revalidatePath("/api/contact-info");

            return NextResponse.json({
                revalidated: true,
                now: Date.now(),
                message: "Revalidated all paths due to webhook format",
            });
        } else {
            return NextResponse.json(
                { message: "Invalid webhook payload format" },
                { status: 400 }
            );
        }

        // Revalidate based on document type
        switch (documentType) {
            case "project":
                revalidatePath("/api/projects");
                revalidatePath("/");
                break;

            case "faq":
                revalidatePath("/api/faqs");
                revalidatePath("/");
                break;

            case "adminTeamMember":
                revalidatePath("/api/admin-team-members");
                revalidatePath("/");
                break;

            case "contactInfo":
                revalidatePath("/api/contact-info");
                revalidatePath("/");
                break;

            case "post":
                // Revalidate blog listing page
                revalidatePath("/blog");
                // Revalidate individual post page if slug is provided
                if (slug?.current) {
                    revalidatePath(`/${slug.current}`);
                }
                // Also revalidate all post pages (for when posts are deleted)
                revalidatePath("/[slug]");
                break;

            default:
                // If type is unknown, revalidate everything
                revalidatePath("/");
                revalidatePath("/blog");
                revalidatePath("/api/projects");
                revalidatePath("/api/faqs");
                revalidatePath("/api/admin-team-members");
                revalidatePath("/api/contact-info");
        }

        return NextResponse.json({
            revalidated: true,
            now: Date.now(),
            type: documentType,
        });
    } catch (error) {
        console.error("Error revalidating:", error);
        return NextResponse.json(
            { message: "Error revalidating", error: String(error) },
            { status: 500 }
        );
    }
}

// GET endpoint for testing
export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get("secret");
    const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (expectedSecret && secret !== expectedSecret) {
        return NextResponse.json(
            { message: "Invalid secret" },
            { status: 401 }
        );
    }

    return NextResponse.json({
        message: "Revalidation endpoint is active",
        timestamp: Date.now(),
        note: "Use POST to trigger revalidation",
    });
}

