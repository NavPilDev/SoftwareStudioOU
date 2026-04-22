"use client";

import { Typography, Button } from "@material-tailwind/react";
import EventContentCard from "@/components/event-content-card";
import React, { useState, useEffect, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
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

type ProjectTab = { kind: "year"; year: number } | { kind: "join" };

function computeInitialWindowStart(
  tabsLength: number,
  selectedIndex: number
): number {
  if (tabsLength <= 3) return 0;
  const maxStart = tabsLength - 3;
  const idealStart = selectedIndex - 1;
  return Math.max(0, Math.min(idealStart, maxStart));
}

export const Projects = React.forwardRef<HTMLDivElement>(function Projects(
  props,
  ref
) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | "join" | null>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [windowStart, setWindowStart] = useState(0);

  const projectTabs = useMemo((): ProjectTab[] => {
    return [
      ...availableYears.map((year) => ({ kind: "year" as const, year })),
      { kind: "join" as const },
    ];
  }, [availableYears]);

  const selectedIndex = useMemo(() => {
    if (selectedYear === null) return -1;
    if (selectedYear === "join")
      return projectTabs.findIndex((t) => t.kind === "join");
    return projectTabs.findIndex(
      (t) => t.kind === "year" && t.year === selectedYear
    );
  }, [projectTabs, selectedYear]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const fetchedProjects = await response.json();
          setProjects(fetchedProjects);

          const years = Array.from<number>(
            new Set(fetchedProjects.map((p: ProjectItem) => p.year))
          ).sort((a, b) => a - b);
          setAvailableYears(years);

          if (years.length > 0) {
            const calendarYear = new Date().getFullYear();
            const defaultYear = years.includes(calendarYear)
              ? calendarYear
              : years[years.length - 1];

            const tabs: ProjectTab[] = [
              ...years.map((y) => ({ kind: "year" as const, year: y })),
              { kind: "join" as const },
            ];
            const selIdx = tabs.findIndex(
              (t) => t.kind === "year" && t.year === defaultYear
            );
            setSelectedYear(defaultYear);
            setWindowStart(computeInitialWindowStart(tabs.length, selIdx));
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    }
    fetchProjects();
  }, []);

  const maxWindowStart = Math.max(0, projectTabs.length - 3);

  const shiftWindow = (delta: -1 | 1) => {
    const nw = Math.min(Math.max(windowStart + delta, 0), maxWindowStart);
    let nextSelected = selectedYear;
    if (selectedIndex >= 0 && projectTabs.length > 0) {
      const visLen = Math.min(3, projectTabs.length - nw);
      const lastVis = nw + visLen - 1;
      if (selectedIndex < nw || selectedIndex > lastVis) {
        const mid =
          projectTabs[nw + Math.min(1, visLen - 1)] ?? projectTabs[nw];
        nextSelected = mid.kind === "join" ? "join" : mid.year;
      }
    }
    setWindowStart(nw);
    setSelectedYear(nextSelected);
  };

  const onKeyDownStrip = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (windowStart > 0) shiftWindow(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (windowStart < maxWindowStart) shiftWindow(1);
    }
  };

  const selectTab = (tab: ProjectTab) => {
    if (tab.kind === "join") {
      setSelectedYear("join");
    } else {
      setSelectedYear(tab.year);
      const idx = projectTabs.findIndex(
        (t) => t.kind === "year" && t.year === tab.year
      );
      setWindowStart(
        computeInitialWindowStart(projectTabs.length, idx)
      );
    }
  };

  const isJoinTab = selectedYear === "join";
  const filteredProjects =
    selectedYear && typeof selectedYear === "number"
      ? projects.filter((p) => p.year === selectedYear)
      : [];

  const joinHeadlineYear = new Date().getFullYear() + 1;
  const visibleTabs = projectTabs.slice(
    windowStart,
    Math.min(windowStart + 3, projectTabs.length)
  );

  const canGoLeft = windowStart > 0;
  const canGoRight = windowStart < maxWindowStart;

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
      {projectTabs.length > 0 && (
        <div className="mb-8 w-full max-w-xl px-4">
          <div
            role="tablist"
            tabIndex={0}
            onKeyDown={onKeyDownStrip}
            className="flex items-center justify-center gap-2 md:gap-4 outline-none focus-visible:ring-2 focus-visible:ring-blue-gray-400 rounded-lg py-1"
          >
            <button
              type="button"
              aria-label="Show earlier years"
              disabled={!canGoLeft}
              onClick={() => shiftWindow(-1)}
              className="shrink-0 rounded-full p-2 text-blue-gray-700 transition enabled:hover:bg-blue-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeftIcon className="h-6 w-6" aria-hidden />
            </button>
            <div className="flex flex-1 min-w-0 justify-center gap-1 sm:gap-2">
              {visibleTabs.map((tab, i) => {
                const globalIndex = windowStart + i;
                const isSelected =
                  tab.kind === "join"
                    ? selectedYear === "join"
                    : selectedYear === tab.year;
                const isLeftEdge = i === 0 && globalIndex > 0;
                const isRightEdge =
                  i === visibleTabs.length - 1 &&
                  globalIndex < projectTabs.length - 1;
                const fadeEdge = isLeftEdge || isRightEdge;

                const label = tab.kind === "join" ? "+" : String(tab.year);

                return (
                  <button
                    key={
                      tab.kind === "join"
                        ? "join"
                        : `year-${tab.year}-${globalIndex}`
                    }
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectTab(tab)}
                    className={[
                      "min-w-0 flex-1 max-w-[6.5rem] truncate rounded-lg px-3 py-2.5 text-center text-sm font-medium transition sm:px-4 sm:text-base",
                      isSelected
                        ? "bg-blue-gray-800 text-white shadow-md"
                        : "bg-blue-gray-50 text-blue-gray-700 hover:bg-blue-gray-100",
                      fadeEdge ? "opacity-50" : "opacity-100",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Show later years"
              disabled={!canGoRight}
              onClick={() => shiftWindow(1)}
              className="shrink-0 rounded-full p-2 text-blue-gray-700 transition enabled:hover:bg-blue-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRightIcon className="h-6 w-6" aria-hidden />
            </button>
          </div>
        </div>
      )}
      <div className="mx-auto container">
        {isJoinTab ? (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <Typography
              variant="h3"
              color="blue-gray"
              className="mb-4 font-bold"
            >
              Join Us in {joinHeadlineYear}!
            </Typography>
            <Typography variant="lead" className="mb-8 !text-gray-600">
              Be part of the next generation of innovative projects. Sign up now
              to participate in OU William Kerber Software Studio{" "}
              {joinHeadlineYear}.
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
                const url = urlFor(project.profilePicture)
                  ?.width(200)
                  .height(200)
                  .url();
                profilePictureUrl = url || undefined;
              } catch (error) {
                console.error(
                  "Error building profile picture URL:",
                  error,
                  project.profilePicture
                );
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
