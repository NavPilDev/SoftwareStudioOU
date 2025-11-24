"use client";

import Link from "next/link";
import Image from "next/image";
import { Typography, Card, CardBody } from "@material-tailwind/react";

interface BlogCardProps {
  title: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string | null;
  excerpt?: string;
}

export default function BlogCard({
  title,
  slug,
  publishedAt,
  imageUrl,
  excerpt,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/${slug}`} className="block h-full">
      <Card className="h-full overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardBody className="p-6">
          <Typography variant="small" color="gray" className="mb-2 font-normal">
            {formattedDate}
          </Typography>
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-3 font-bold line-clamp-2"
          >
            {title}
          </Typography>
          {excerpt && (
            <Typography
              variant="paragraph"
              color="gray"
              className="mb-4 line-clamp-3"
            >
              {excerpt}
            </Typography>
          )}
          <Typography
            variant="small"
            color="blue-gray"
            className="font-semibold hover:underline"
          >
            Read more →
          </Typography>
        </CardBody>
      </Card>
    </Link>
  );
}
