"use client";

import { Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useMemo } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Image from "next/image";
import { Navbar, Footer } from "@/components";

// Utility function to convert URLs in text to clickable links and preserve line breaks
const LinkifyText = ({ text }: { text: string }) => {
    // URL regex pattern - matches http, https, www, and email addresses
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

    // Split text by newlines first
    const lines = text.split(/\n/);

    return (
        <>
            {lines.map((line, lineIndex) => {
                // Process each line for URLs
                const parts = line.split(urlRegex);

                return (
                    <React.Fragment key={lineIndex}>
                        {parts.map((part, partIndex) => {
                            // Check if this part is a URL
                            if (urlRegex.test(part)) {
                                let href = part;
                                // Add https:// if it's a www link
                                if (part.startsWith('www.')) {
                                    href = `https://${part}`;
                                }
                                // Add mailto: if it's an email
                                else if (part.includes('@')) {
                                    href = `mailto:${part}`;
                                }

                                return (
                                    <a
                                        key={`${lineIndex}-${partIndex}`}
                                        href={href}
                                        target={part.includes('@') ? undefined : "_blank"}
                                        rel={part.includes('@') ? undefined : "noopener noreferrer"}
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        {part}
                                    </a>
                                );
                            }
                            return <span key={`${lineIndex}-${partIndex}`}>{part}</span>;
                        })}
                        {/* Add line break after each line except the last one */}
                        {lineIndex < lines.length - 1 && <br />}
                    </React.Fragment>
                );
            })}
        </>
    );
};

// Get config - fallback to hardcoded values if config() doesn't work
let projectId: string | undefined;
let dataset: string | undefined;
try {
    const config = client.config();
    projectId = config?.projectId;
    dataset = config?.dataset;
} catch (error) {
    // Fallback to hardcoded values
    projectId = "xwlnwgbx";
    dataset = "production";
}

const urlFor = (source: SanityImageSource) => {
    if (!projectId || !dataset || !source) return null;
    try {
        return imageUrlBuilder({ projectId, dataset }).image(source);
    } catch (error) {
        console.error("Error creating image URL builder:", error);
        return null;
    }
};

export interface AdminTeamMemberItem {
    _id: string;
    name: string;
    role: string;
    description: string;
    profilePicture?: SanityImageSource;
    order?: number;
}

export default function AboutUsPage() {
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

    // Group team members by role
    const membersByRole = useMemo(() => {
        const grouped: Record<string, AdminTeamMemberItem[]> = {};
        adminTeamMembers.forEach((member) => {
            const role = member.role || "Other";
            if (!grouped[role]) {
                grouped[role] = [];
            }
            grouped[role].push(member);
        });
        return grouped;
    }, [adminTeamMembers]);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                <section className="container mx-auto flex flex-col items-center px-4 py-20">
                    <div className="w-full max-w-6xl">
                        <Typography variant="h6" className="text-center mb-2 mt-3" color="orange">
                            About
                        </Typography>
                        <Typography variant="h3" className="text-center" color="blue-gray">
                            Why Join?
                        </Typography>
                        <div className="flex justify-center w-full">
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
                        </div>
                        <Typography variant="h3" className="text-center mb-12" color="blue-gray">
                            About Us
                        </Typography>
                        <div className="mt-4 w-full space-y-16">
                            {adminTeamMembers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Typography color="gray" className="font-normal">
                                        No admin team members available at this time.
                                    </Typography>
                                </div>
                            ) : (
                                Object.entries(membersByRole).map(([role, members]) => (
                                    <div key={role} className="w-full">
                                        <Typography
                                            variant="h3"
                                            className="text-center mb-8"
                                            color="orange"
                                        >
                                            {role}
                                        </Typography>
                                        <div className="space-y-12">
                                            {members.map((member, idx) => {
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
                                                            <Typography variant="h4" className="mb-4" color="blue-gray">
                                                                {member.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="lead"
                                                                className="font-normal !text-gray-600"
                                                            >
                                                                <LinkifyText text={member.description} />
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

