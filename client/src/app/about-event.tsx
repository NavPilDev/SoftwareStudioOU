"use client";

import { Typography, Button } from "@material-tailwind/react";
import React from "react";
import Link from "next/link";

export const AboutEvent = React.forwardRef<HTMLDivElement>(function AboutEvent(
  props,
  ref
) {
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
      <div className="flex flex-col items-center gap-4 mt-8">
        <Typography variant="h4" className="text-center" color="blue-gray">
          Want to learn more about our team?
        </Typography>
        <Link href="/about-us">
          <Button color="gray" size="lg">
            Meet Our Team
          </Button>
        </Link>
      </div>
    </section>
  );
});

export default AboutEvent;
