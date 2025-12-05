"use client";

import { Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";
import React, { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Image from "next/image";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export interface AdminTeamMemberItem {
  _id: string;
  name: string;
  role: string;
  description: string;
  profilePicture?: SanityImageSource;
  order?: number;
}

export const AboutEvent = React.forwardRef<HTMLDivElement>(function AboutEvent(
  props,
  ref
) {
  const [adminTeamMembers, setAdminTeamMembers] = useState<AdminTeamMemberItem[]>([]);

  useEffect(() => {
    async function fetchAdminTeamMembers() {
      try {
        const response = await fetch("/api/admin-team-members");
        if (response.ok) {
          const fetchedAdminTeamMembers = await response.json();
          setAdminTeamMembers(fetchedAdminTeamMembers);
        }
      } catch (error) {
        console.error("Error fetching admin team members:", error);
        setAdminTeamMembers([]);
      }
    }
    fetchAdminTeamMembers();
  }, []);

  return (
    <section
      ref={ref}
      className="container mx-auto flex flex-col items-center px-4 py-10"
    >
      <Typography variant="h6" className="text-center mb-2" color="orange">
        About
      </Typography>
      <Typography variant="h3" className="text-center" color="blue-gray">
        Why Join?
      </Typography>
      <Typography
        variant="lead"
        className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500"
      >
        William Kerber&apos;s Software Studio allows students to build real
        products, learn from industry leaders, and launch their tech startups.
        We have weekly sessions where we have guest speakers, workshops, and
        project building sessions. Software Studio takes place over two
        semesters. While this is a club, students can also take it for
        credit(see FAQ). Software Studio is a great way to get started in
        entrepreneurship and innovation, while also making valuable connections
        along the way.
      </Typography>
      <Typography variant="h3" className="text-center w-full mb-8" color="blue-gray">
        About Us
      </Typography>
      <div className="mt-4 w-full space-y-12">
        {adminTeamMembers.length === 0 ? (
          <div className="text-center py-8">
            <Typography color="gray" className="font-normal">
              No admin team members available at this time.
            </Typography>
          </div>
        ) : (
          adminTeamMembers.map((member, idx) => {
            const isEven = idx % 2 === 0;
            const imageUrl = member.profilePicture
              ? urlFor(member.profilePicture)?.width(300).height(450).url()
              : "/image/avatar1.jpg";

            return (
              <div
                key={member._id}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } items-center gap-8 w-full`}
              >
                <div className="flex-shrink-0 w-full md:w-1/3 max-w-xs">
                  <Image
                    src={imageUrl || "/image/avatar1.jpg"}
                    alt={member.name}
                    width={300}
                    height={450}
                    className="w-full aspect-[2/3] rounded-lg object-cover shadow-lg"
                  />
                </div>
                <div
                  className={`flex-1 w-full md:w-2/3 ${isEven ? "md:text-left" : "md:text-right"
                    } text-center md:text-left`}
                >
                  <Typography variant="h4" className="mb-2" color="blue-gray">
                    {member.name}
                  </Typography>
                  <Typography variant="h6" className="mb-4" color="orange">
                    {member.role}
                  </Typography>
                  <Typography
                    variant="lead"
                    className="font-normal !text-gray-600"
                  >
                    {member.description}
                  </Typography>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
});

export default AboutEvent;
