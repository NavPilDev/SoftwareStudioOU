import { client } from "@/sanity/client";
import { NextResponse } from "next/server";

const ADMIN_TEAM_MEMBERS_QUERY = `*[_type == "adminTeamMember"] | order(order asc, _createdAt asc) {
  _id,
  name,
  role,
  description,
  profilePicture,
  order
}`;

export async function GET() {
    try {
        const adminTeamMembers = await client.fetch(ADMIN_TEAM_MEMBERS_QUERY, {}, {
            next: { revalidate: 30 }
        });
        return NextResponse.json(adminTeamMembers);
    } catch (error) {
        console.error("Error fetching admin team members:", error);
        return NextResponse.json([], { status: 500 });
    }
}

