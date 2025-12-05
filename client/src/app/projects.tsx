"use client";

import {
  Tab,
  Tabs,
  TabsHeader,
  Typography,
  Button,
} from "@material-tailwind/react";
import EventContentCard from "@/components/event-content-card";
import React, { useState, useEffect } from "react";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";

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

export interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  name: string;
  position: string;
  category: string;
  image?: SanityImageSource;
  profilePicture?: SanityImageSource;
  year: number;
  order?: number;
}

export const Projects = React.forwardRef<HTMLDivElement>(function Projects(
  props,
  ref
) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | string | null>(
    null
  );
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [nextYear, setNextYear] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const fetchedProjects = await response.json();
          // Debug: log first project to see image data structure
          if (fetchedProjects.length > 0) {
            console.log("Sample project data:", {
              hasImage: !!fetchedProjects[0].image,
              hasProfilePicture: !!fetchedProjects[0].profilePicture,
              image: fetchedProjects[0].image,
              profilePicture: fetchedProjects[0].profilePicture,
            });
          }
          setProjects(fetchedProjects);

          // Extract unique years and sort them
          const years = Array.from<number>(
            new Set(fetchedProjects.map((p: ProjectItem) => p.year))
          ).sort((a, b) => b - a);
          setAvailableYears(years);

          // Calculate next year (last tab year + 1)
          const lastTabYear =
            years.length > 0
              ? years[years.length - 1]
              : new Date().getFullYear();
          setNextYear(lastTabYear + 1);

          // Set default to most recent year
          if (years.length > 0) {
            setSelectedYear(years[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  const isNextYearTab = selectedYear === "next-year";
  const filteredProjects =
    selectedYear && typeof selectedYear === "number"
      ? projects.filter((p) => p.year === selectedYear)
      : [];

  return (
    <section
      ref={ref}
      className="container mx-auto flex flex-col items-center py-10"
    >
      <div className="w-full flex mb-8 flex-col items-center max-w-6xl">
        <Typography
          className="text-5xl font-bold leading-tight lg:w-3/4 text-center"
          color="blue-gray"
        >
          Projects
        </Typography>
      </div>
      {(availableYears.length > 0 || nextYear) && (
        <Tabs value={selectedYear?.toString() || ""} className="mb-8">
          <div className="w-full flex mb-8 flex-col items-center">
            <TabsHeader className="h-12 w-72 md:w-96">
              {availableYears.map((year) => (
                <Tab
                  key={year}
                  value={year.toString()}
                  className="font-medium"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Tab>
              ))}
              {nextYear && (
                <Tab
                  value="next-year"
                  className="font-medium"
                  onClick={() => setSelectedYear("next-year")}
                >
                  {nextYear}
                </Tab>
              )}
            </TabsHeader>
          </div>
        </Tabs>
      )}
      <div className="mx-auto container">
        {isNextYearTab ? (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <Typography
              variant="h3"
              color="blue-gray"
              className="mb-4 font-bold"
            >
              Join Us in {nextYear}!
            </Typography>
            <Typography variant="lead" className="mb-8 !text-gray-600">
              Be part of the next generation of innovative projects. Sign up now
              to participate in Software Studio OU {nextYear}.
            </Typography>
            <a
              href="https://forms.gle/PYWTVEEeprE7APmZ8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button color="gray" size="lg" className="mt-4">
                Sign Up Now
              </Button>
            </a>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-8">
            <Typography color="gray" className="font-normal">
              No projects available for this year.
            </Typography>
          </div>
        ) : (
          filteredProjects.map((project) => {
            const imageUrl = project.image
              ? urlFor(project.image)?.width(768).height(768).url()
              : "/image/avatar1.jpg";

            let profilePictureUrl: string | undefined = undefined;
            if (project.profilePicture) {
              try {
                const url = urlFor(project.profilePicture)?.width(200).height(200).url();
                profilePictureUrl = url || undefined;
              } catch (error) {
                console.error("Error building profile picture URL:", error, project.profilePicture);
              }
            }

            return (
              <EventContentCard
                key={project._id}
                title={project.title || ""}
                des={project.description || ""}
                name={project.name || ""}
                position={project.position || ""}
                panel={project.category || ""}
                img={imageUrl || "/image/avatar1.jpg"}
                profileImg={profilePictureUrl}
              />
            );
          })
        )}
      </div>
    </section>
  );
});

export default Projects;
