"use client";

import { Typography, Card, CardBody, CardHeader, Button } from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Image from "next/image";
import { PortableText } from "next-sanity";

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

export interface AnnouncementItem {
    _id: string;
    title: string;
    pdfUrl?: string;
    pdfFilename?: string;
    imagePreview?: SanityImageSource;
    description: any; // Portable text array
    link?: string;
    linkTitle?: string;
    order?: number;
}

export const Announcements = React.forwardRef<HTMLDivElement>(function Announcements(
    props,
    ref
) {
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const response = await fetch("/api/announcements");
                if (response.ok) {
                    const fetchedAnnouncements = await response.json();
                    setAnnouncements(fetchedAnnouncements);
                }
            } catch (error) {
                console.error("Error fetching announcements:", error);
                setAnnouncements([]);
            }
        }
        fetchAnnouncements();
    }, []);

    return (
        <section
            ref={ref}
            className="container mx-auto flex flex-col items-center py-10 px-4"
        >
            <Typography variant="h6" className="text-center mb-2" color="orange">
                Announcements
            </Typography>
            <Typography variant="h3" className="text-center mb-8" color="blue-gray">
                Latest Updates
            </Typography>
            {announcements.length === 0 ? (
                <div className="text-center py-8">
                    <Typography color="gray" className="font-normal">
                        No announcements available at this time.
                    </Typography>
                </div>
            ) : (
                <div className="flex flex-col gap-8 w-full max-w-7xl">
                    {announcements.map((announcement) => {
                        const imageUrl = announcement.imagePreview
                            ? urlFor(announcement.imagePreview)?.width(800).height(600).url()
                            : null;

                        return (
                            <Card key={announcement._id} className="shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex flex-col md:flex-row">
                                    {imageUrl && (
                                        <CardHeader floated={false} className="md:w-1/3 h-64 md:h-auto shrink-0 p-0 overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={announcement.title}
                                                width={800}
                                                height={600}
                                                className="w-full h-full object-cover"
                                            />
                                        </CardHeader>
                                    )}
                                    <CardBody className="flex flex-col justify-between flex-grow">
                                        <div>
                                            <Typography variant="h5" color="blue-gray" className="mb-2">
                                                {announcement.title}
                                            </Typography>
                                            <div className="font-normal !text-gray-600 mb-4 prose prose-sm max-w-none">
                                                <PortableText
                                                    value={announcement.description}
                                                    components={{
                                                        block: {
                                                            normal: ({ children }) => (
                                                                <p className="mb-2 text-gray-600">
                                                                    {children}
                                                                </p>
                                                            ),
                                                            h1: ({ children }) => (
                                                                <h1 className="text-2xl font-bold mb-2 text-gray-900">
                                                                    {children}
                                                                </h1>
                                                            ),
                                                            h2: ({ children }) => (
                                                                <h2 className="text-xl font-bold mb-2 text-gray-900">
                                                                    {children}
                                                                </h2>
                                                            ),
                                                            h3: ({ children }) => (
                                                                <h3 className="text-lg font-bold mb-2 text-gray-900">
                                                                    {children}
                                                                </h3>
                                                            ),
                                                        },
                                                        list: {
                                                            bullet: ({ children }) => (
                                                                <ul className="list-disc list-inside mb-2 space-y-1 text-gray-600">
                                                                    {children}
                                                                </ul>
                                                            ),
                                                            number: ({ children }) => (
                                                                <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-600">
                                                                    {children}
                                                                </ol>
                                                            ),
                                                        },
                                                        marks: {
                                                            link: ({ children, value }) => (
                                                                <a
                                                                    href={value?.href}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                                >
                                                                    {children}
                                                                </a>
                                                            ),
                                                            strong: ({ children }) => (
                                                                <strong className="font-semibold">{children}</strong>
                                                            ),
                                                            em: ({ children }) => (
                                                                <em className="italic">{children}</em>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                            {announcement.pdfUrl && (
                                                <a
                                                    href={announcement.pdfUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    download={announcement.pdfFilename}
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        size="md"
                                                        color="gray"
                                                        className="w-full"
                                                    >
                                                        Download PDF
                                                    </Button>
                                                </a>
                                            )}
                                            {announcement.link && (
                                                <a
                                                    href={announcement.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1"
                                                >
                                                    <Button
                                                        size="md"
                                                        variant="outlined"
                                                        color="gray"
                                                        className="w-full"
                                                    >
                                                        {announcement.linkTitle || "Learn More"}
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </CardBody>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </section>
    );
});

export default Announcements;

