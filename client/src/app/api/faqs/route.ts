import { client } from "@/sanity/client";
import { NextResponse } from "next/server";

const FAQ_QUERY = `*[_type == "faq"] | order(order asc, _createdAt asc) {
  _id,
  question,
  answer,
  order
}`;

export async function GET() {
  try {
    const faqs = await client.fetch(FAQ_QUERY, {}, {
      next: { revalidate: 30 }
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json([], { status: 500 });
  }
}
