"use client";

import Image from "next/image";
import { IconButton, Button, Typography } from "@material-tailwind/react";
import { PlayIcon } from "@heroicons/react/24/solid";

function Hero() {
  return (
    <div className="relative min-h-screen w-full bg-[url('/image/hero.jpeg')] bg-cover bg-no-repeat">
      <div className="absolute inset-0 h-full w-full bg-gray-900/60" />
      <div className="grid min-h-screen px-8">
        <div className="container relative z-10 my-auto mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Logo on the left */}
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/image/SoftwareStudioLogoWhite.png"
              alt="Software Studio Logo"
              width={300}
              height={300}
              className="w-auto h-auto max-w-full"
              priority
            />
          </div>

          {/* Text content on the right */}
          <div className="text-center lg:text-right">
            <Typography variant="h3" color="white" className="mb-2">
              Be a Part of
            </Typography>
            <Typography variant="h1" color="white" className="lg:max-w-3xl">
              Entrepreneurship and Innovation!
            </Typography>
            <Typography
              variant="lead"
              color="white"
              className="mt-1 mb-12 w-full md:max-w-full lg:max-w-2xl"
            >
              A two-semester, hands-on program where OU students form teams,
              pitch ideas, build prototypes, and launch tech products — guided
              by faculty, mentors, and guest entrepreneurs
            </Typography>
            <div className="flex items-center gap-4 justify-center lg:justify-end">
              <Button variant="gradient" color="white">
                Get started
              </Button>
              <IconButton className="rounded-full bg-white p-6">
                <PlayIcon className="h-4 w-4 text-gray-900" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
