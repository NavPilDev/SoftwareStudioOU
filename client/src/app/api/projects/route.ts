import { client } from "@/sanity/client";
import { NextResponse } from "next/server";

const PROJECTS_QUERY = `*[_type == "project"] | order(year desc, order asc, _createdAt asc) {
  _id,
  title,
  description,
  name,
  position,
  category,
  image,
  profilePicture,
  year,
  order
}`;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    let query = PROJECTS_QUERY;
    if (year) {
      query = `*[_type == "project" && year == ${year}] | order(order asc, _createdAt asc) {
        _id,
        title,
        description,
        name,
        position,
        category,
        image,
        profilePicture,
        year,
        order
      }`;
    }

    const projects = await client.fetch(query, {}, {
      next: { revalidate: 30 }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json([], { status: 500 });
  }
}
