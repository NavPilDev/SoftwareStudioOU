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
  tagline?: string;
  description: string;
  name: string;
  position: string;
  category: string;
  image?: SanityImageSource;
  profilePicture?: SanityImageSource;
  year: number;
  batch: "Spring" | "Fall";
  order?: number;
}

type ProjectTab = { kind: "batch"; key: string; batch: Batch } | { kind: "join" };

type Batch = { year: number; season: "Spring" | "Fall" };

function seasonToIndex(season: Batch["season"]): number {
  return season === "Spring" ? 0 : 1;
}

function compareBatches(a: Batch, b: Batch): number {
  if (a.year !== b.year) return a.year - b.year;
  return seasonToIndex(a.season) - seasonToIndex(b.season);
}

function nextBatch(after: Batch): Batch {
  if (after.season === "Spring") return { year: after.year, season: "Fall" };
  return { year: after.year + 1, season: "Spring" };
}

function inferCurrentSeason(d: Date): Batch["season"] {
  // Rough split: Jan–Jun => Spring, Jul–Dec => Fall
  return d.getMonth() < 6 ? "Spring" : "Fall";
}

function formatBatch(b: Batch): string {
  return `${b.season} ${b.year}`;
}

function formatBatchRange(start: Batch): string {
  const end = nextBatch(start);
  return `${formatBatch(start)} - ${formatBatch(end)}`;
}

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
  const [selectedBatch, setSelectedBatch] = useState<Batch | "join" | null>(null);
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [windowStart, setWindowStart] = useState(0);

  const projectTabs = useMemo((): ProjectTab[] => {
    return [
      ...availableBatches.map((b) => ({
        kind: "batch" as const,
        key: `${b.season}-${b.year}`,
        batch: b,
      })),
      { kind: "join" as const },
    ];
  }, [availableBatches]);

  const selectedIndex = useMemo(() => {
    if (selectedBatch === null) return -1;
    if (selectedBatch === "join")
      return projectTabs.findIndex((t) => t.kind === "join");
    const key = `${selectedBatch.season}-${selectedBatch.year}`;
    return projectTabs.findIndex(
      (t) => t.kind === "batch" && t.key === key
    );
  }, [projectTabs, selectedBatch]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const fetchedProjects = await response.json();
          setProjects(fetchedProjects);

          const batches: Batch[] = Array.from(
            new Map<string, Batch>(
              fetchedProjects.map((p: ProjectItem) => {
                const b: Batch = { year: p.year, season: p.batch };
                return [`${b.season}-${b.year}`, b] as const;
              })
            ).values()
          ).sort(compareBatches);
          setAvailableBatches(batches);

          if (batches.length > 0) {
            const now = new Date();
            const current: Batch = {
              year: now.getFullYear(),
              season: inferCurrentSeason(now),
            };
            const defaultBatch = batches.find(
              (b) => b.year === current.year && b.season === current.season
            )
              ? current
              : batches[batches.length - 1];

            const tabs: ProjectTab[] = [
              ...batches.map((b) => ({
                kind: "batch" as const,
                key: `${b.season}-${b.year}`,
                batch: b,
              })),
              { kind: "join" as const },
            ];
            const defaultKey = `${defaultBatch.season}-${defaultBatch.year}`;
            const selIdx = tabs.findIndex(
              (t) => t.kind === "batch" && t.key === defaultKey
            );
            setSelectedBatch(defaultBatch);
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
    let nextSelected = selectedBatch;
    if (selectedIndex >= 0 && projectTabs.length > 0) {
      const visLen = Math.min(3, projectTabs.length - nw);
      const lastVis = nw + visLen - 1;
      if (selectedIndex < nw || selectedIndex > lastVis) {
        const mid =
          projectTabs[nw + Math.min(1, visLen - 1)] ?? projectTabs[nw];
        if (mid.kind === "join") {
          nextSelected = "join";
        } else {
          nextSelected = mid.batch;
        }
      }
    }
    setWindowStart(nw);
    setSelectedBatch(nextSelected);
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
      setSelectedBatch("join");
    } else {
      setSelectedBatch(tab.batch);
      const idx = projectTabs.findIndex(
        (t) => t.kind === "batch" && t.key === tab.key
      );
      setWindowStart(
        computeInitialWindowStart(projectTabs.length, idx)
      );
    }
  };

  const isJoinTab = selectedBatch === "join";
  const filteredProjects =
    selectedBatch && selectedBatch !== "join"
      ? projects.filter(
          (p) => p.year === selectedBatch.year && p.batch === selectedBatch.season
        )
      : [];

  const { joinHeadline, joinRange } = useMemo(() => {
    const parsed: Batch[] = projects
      .map((p) => ({
        year: p.year,
        season: p.batch,
      }))
      .filter((b) => Number.isFinite(b.year));

    const last =
      parsed.length > 0
        ? parsed.reduce((acc, cur) => (compareBatches(acc, cur) >= 0 ? acc : cur))
        : (() => {
            const now = new Date();
            return { year: now.getFullYear(), season: inferCurrentSeason(now) };
          })();

    const nb = nextBatch(last);
    const fb = nextBatch(nb);

    return {
      joinHeadline: `Join us in ${nb.season} ${nb.year}`,
      joinRange: `${nb.season} ${nb.year} - ${fb.season} ${fb.year}`,
    };
  }, [projects]);
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
                    ? selectedBatch === "join"
                    : selectedBatch !== null &&
                      selectedBatch !== "join" &&
                      tab.key === `${selectedBatch.season}-${selectedBatch.year}`;
                const isLeftEdge = i === 0 && globalIndex > 0;
                const isRightEdge =
                  i === visibleTabs.length - 1 &&
                  globalIndex < projectTabs.length - 1;
                const fadeEdge = isLeftEdge || isRightEdge;

                const label =
                  tab.kind === "join" ? "+" : formatBatchRange(tab.batch);

                return (
                  <button
                    key={
                      tab.kind === "join"
                        ? "join"
                        : `batch-${tab.key}-${globalIndex}`
                    }
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => selectTab(tab)}
                    className={[
                      "min-w-0 flex-1 rounded-lg px-3 py-2.5 text-center text-xs font-medium leading-snug transition sm:px-4 sm:text-sm",
                      isSelected
                        ? "bg-blue-gray-800 text-white shadow-md"
                        : "bg-blue-gray-50 text-blue-gray-700 hover:bg-blue-gray-100",
                      fadeEdge ? "opacity-50" : "opacity-100",
                    ].join(" ")}
                  >
                    <span className="block whitespace-normal break-words">
                      {label}
                    </span>
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
              {joinHeadline}
            </Typography>
            <Typography variant="lead" className="mb-8 !text-gray-600">
              Be part of the next generation of innovative projects. Sign up now
              to participate in OU William Kerber Software Studio {joinRange}.
            </Typography>
            <a
              href="https://forms.gle/PYWTVEEeprE7APmZ8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button color="gray" size="lg">
                  Sign Up Now
                </Button>
                <span
                  aria-hidden
                  className="hidden select-none text-blue-gray-400 sm:inline"
                >
                  |
                </span>
                <a
                  href="https://discord.gg/BUyTfQ9SBE"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join our Discord"
                >
                  <Button
                    size="lg"
                    className="flex items-center gap-2 bg-[#5865F2] text-white shadow-md hover:bg-[#4752C4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2]/60"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                      className="shrink-0"
                    >
                      <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495a18.2687 18.2687 0 0 0-5.4872 0c-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561 19.9004 19.9004 0 0 0 5.9937 3.0452.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057 13.176 13.176 0 0 1-1.8722-.8923.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.0991.246.1981.372.2924a.077.077 0 0 1-.0066.1277 12.299 12.299 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.2251 1.9932a.076.076 0 0 0 .0842.0286 19.8392 19.8392 0 0 0 6.0023-3.0452.077.077 0 0 0 .0303-.0552c.5004-5.177.838-9.6739-2.5585-13.6604a.061.061 0 0 0-.0312-.0286ZM8.02 15.3312c-1.1838 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.175 1.0942 2.1569 2.419 0 1.3332-.9555 2.419-2.1569 2.419Zm7.9748 0c-1.1838 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.1569-2.4189 1.2108 0 2.175 1.0942 2.1569 2.419 0 1.3332-.9465 2.419-2.1569 2.419Z" />
                    </svg>
                    Join the Discord
                  </Button>
                </a>
              </div>
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
                panel={project.tagline || project.category || ""}
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
