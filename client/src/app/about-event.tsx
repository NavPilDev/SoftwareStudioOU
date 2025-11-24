"use client";

import { Typography } from "@material-tailwind/react";
import AboutCard from "@/components/about-card";
import React from "react";

const EVENT_INFO = [
  {
    title: "Cutting-Edge Insights!",
    description:
      "Gain deep insights into the latest AI trends, developments, and applications that are reshaping industries worldwide. ",
    subTitle: "Presentation",
  },
  {
    title: "Practical Knowledge!",
    description:
      "Attend workshops and hands-on sessions to acquire practical skills that you can apply immediately.",
    subTitle: "Workshops",
  },
];

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
        About the event
      </Typography>
      <Typography variant="h3" className="text-center" color="blue-gray">
        Why Join?
      </Typography>
      <Typography
        variant="lead"
        className="mt-2 lg:max-w-4xl mb-8 w-full text-center font-normal !text-gray-500"
      >
        Hands-on skills in design, AI, cloud, APIs, security, and DevOps. Learn
        from startup founders & industry leaders Build real products with peers
        and pitch your final product at the OU showcase in April
      </Typography>
      <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {EVENT_INFO.map((props, idx) => (
          <AboutCard key={idx} {...props} />
        ))}
        <div className="md:col-span-2">
          <AboutCard
            title="Networking!"
            subTitle="Community"
            description="Connect with industry leaders, AI experts, and fellow enthusiasts to build valuable professional relationships."
          />
        </div>
      </div>
    </section>
  );
});

export default AboutEvent;
