"use client";

import { Typography } from "@material-tailwind/react";
import React, { useState, useEffect, useMemo } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Image from "next/image";
import { Navbar, Footer } from "@/components";

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
                                                                {member.description}
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

