import { client } from "@/sanity/client";
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

export async function GET() {
    try {
        const announcements = await client.fetch(ANNOUNCEMENTS_QUERY, {}, {
            next: { revalidate: 30 }
        });
        return NextResponse.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        return NextResponse.json([], { status: 500 });
    }
}

