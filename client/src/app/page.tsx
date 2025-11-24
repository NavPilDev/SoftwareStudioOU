"use client";
// components
import { Navbar, Footer } from "@/components";

// sections
import Hero from "./hero";
import SponsoredBy from "./sponsored-by";
import AboutEvent from "./about-event";
import OurStats from "./our-stats";
import EventContent from "./event-content";
import Faq from "./faq";
import React, { useRef, useEffect } from "react";

export default function Portfolio() {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <Navbar aboutRef={aboutRef} projectsRef={projectsRef} homeRef={homeRef} />
      <div id="home" ref={homeRef}>
        <Hero />
      </div>
      {/* <SponsoredBy /> */}
      <div id="about" ref={aboutRef}>
        <AboutEvent />
      </div>
      {/* <OurStats /> */}
      <div id="projects" ref={projectsRef}>
        <EventContent />
      </div>
      <Faq />
      <Footer />
    </>
  );
}
