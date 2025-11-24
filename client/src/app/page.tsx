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
import React, { useRef } from "react";

export default function Portfolio() {
  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <Navbar aboutRef={aboutRef} projectsRef={projectsRef} homeRef={homeRef} />
      <Hero ref={homeRef} />
      <SponsoredBy />
      <AboutEvent ref={aboutRef} />
      <OurStats />
      <EventContent ref={projectsRef} />
      <Faq />
      <Footer />
    </>
  );
}
