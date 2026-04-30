import { client } from "@/sanity/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROJECTS_QUERY = `*[_type == "project"] | order(year desc, order asc, _createdAt asc) {
  _id,
  title,
  tagline,
  description,
  name,
  position,
  category,
  image,
  profilePicture,
  year,
  batch,
  order
}`;

export async function GET(request: NextRequest) {
  try {
    const year = request.nextUrl.searchParams.get("year");
    const yearNumber = year ? Number.parseInt(year, 10) : null;

    const query = yearNumber !== null && Number.isFinite(yearNumber)
      ? `*[_type == "project" && year == $year] | order(order asc, _createdAt asc) {
          _id,
          title,
          tagline,
          description,
          name,
          position,
          category,
          image,
          profilePicture,
          year,
          batch,
          order
        }`
      : PROJECTS_QUERY;

    const projects = await client.fetch(query, yearNumber !== null && Number.isFinite(yearNumber) ? { year: yearNumber } : {}, {
      next: { revalidate: 30 }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json([], { status: 500 });
  }
}
