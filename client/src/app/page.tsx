"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import SponsoredBy from "./sponsored-by";
import AboutEvent from "./about-event";
import OurStats from "./our-stats";
import Projects from "./projects";
import Faq, { type FAQItem } from "./faq";
import Announcements from "./announcements";
import React, { useRef, useEffect, useState } from "react";

export default function Portfolio() {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          // Remove hash from URL after scrolling starts
          setTimeout(() => {
            window.history.replaceState(null, "", window.location.pathname);
          }, 100);
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const response = await fetch("/api/faqs");
        if (response.ok) {
          const fetchedFaqs = await response.json();
          setFaqs(fetchedFaqs);
        } else {
          console.error("Failed to fetch FAQs");
          setFaqs([]);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setFaqs([]);
      }
    }
    fetchFAQs();
  }, []);

  return (
    <>
      <Navbar aboutRef={aboutRef} projectsRef={projectsRef} homeRef={homeRef} />
      <div id="home" ref={homeRef}>
        <Hero />
      </div>
      {/* <SponsoredBy /> */}
      <div id="announcements">
        <Announcements />
      </div>
      <div id="about" ref={aboutRef}>
        <AboutEvent />
      </div>
      {/* <OurStats /> */}

      <div id="projects" ref={projectsRef} className="scroll-mt-[100px]">
        <Projects />
      </div>
      <Faq faqs={faqs} />
      <Footer />
    </>
  );
}
