import { client } from "@/sanity/client";
import { NextResponse } from "next/server";

const CONTACT_INFO_QUERY = `*[_type == "contactInfo"] | order(_createdAt asc) {
  _id,
  prefix,
  fullName,
  email
}`;

export async function GET() {
    try {
        const contactInfo = await client.fetch(CONTACT_INFO_QUERY, {}, {
            next: { revalidate: 30 }
        });
        return NextResponse.json(contactInfo);
    } catch (error) {
        console.error("Error fetching contact info:", error);
        return NextResponse.json([], { status: 500 });
    }
}


