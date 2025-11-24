"use client";

import { Tab, Tabs, TabsHeader, Typography } from "@material-tailwind/react";

import EventContentCard from "@/components/event-content-card";
import React from "react";

const EVENT_CONTENT = [
  {
    title: "Atlas",
    des: "All in one fitnesss app for tracking your workouts, goals, and progress.",
    name: "Jay Singh",
    position: "Chief Executive, Spotify",
    panel: "Panel Discussion",
    img: "/image/avatar1.jpg",
  },
  {
    title: "Deepend Security",
    des: "Explore the basic principles, algorithms, and applications of Machine Learning. Through hands-on exercises and practical examples, you'll develop a solid understanding of how Machine Learning powers AI-driven solutions.",
    name: "Marcell Glock",
    position: "Chief Executive, Spotify",
    panel: "Workshop",
    img: "/image/avatar2.jpg",
  },
  {
    title: "AI in Healthcare: Revolutionizing Patient Care",
    des: "This session is a must-attend for healthcare professionals, AI enthusiasts, and anyone interested in the intersection of technology and well-being. Join us as we discuss how AI is bringing about positive changes in healthcare.",
    name: "Marcell Glock",
    position: "Chief Executive, Spotify",
    panel: "Workshop",
    img: "/image/avatar3.jpg",
  },
];

export const EventContent = React.forwardRef<HTMLDivElement>(
  function EventContent(props, ref) {
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
        <Tabs value="Day1" className="mb-8">
          <div className="w-full flex mb-8 flex-col items-center">
            <TabsHeader className="h-12 w-72 md:w-96">
              <Tab value="2025" className="font-medium">
                2025
              </Tab>
              {/* <Tab value="2026" className="font-medium">
              2026
            </Tab>
            <Tab value="2027" className="font-medium">
              2027
            </Tab> */}
            </TabsHeader>
          </div>
        </Tabs>
        <div className="mx-auto container">
          {EVENT_CONTENT.map((props, idx) => (
            <EventContentCard key={idx} {...props} />
          ))}
        </div>
      </section>
    );
  }
);

export default EventContent;
