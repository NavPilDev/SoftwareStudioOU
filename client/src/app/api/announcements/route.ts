import { client } from "@/sanity/client";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ANNOUNCEMENTS_QUERY = `*[_type == "announcement"] | order(order asc, _createdAt desc) {
  _id,
  title,
  "pdfUrl": pdf.asset->url,
  "pdfFilename": pdf.asset->originalFilename,
  imagePreview,
  description,
  link,
  linkTitle,
  order
}`;

export async function GET(request: NextRequest) {
    try {
        const limitParam = request.nextUrl.searchParams.get("limit");
        const limit =
          limitParam !== null && limitParam !== ""
            ? Number.parseInt(limitParam, 10)
            : null;

        const query =
          limit !== null && Number.isFinite(limit) && limit > 0
            ? `*[_type == "announcement"] | order(order asc, _createdAt desc)[0...$limit] {
                _id,
                title,
                "pdfUrl": pdf.asset->url,
                "pdfFilename": pdf.asset->originalFilename,
                imagePreview,
                description,
                link,
                linkTitle,
                order
              }`
            : ANNOUNCEMENTS_QUERY;

        const announcements = await client.fetch(
          query,
          limit !== null && Number.isFinite(limit) && limit > 0 ? { limit } : {},
          {
            next: { revalidate: 30 }
          }
        );
        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json([], { status: 500 });
    }
}

