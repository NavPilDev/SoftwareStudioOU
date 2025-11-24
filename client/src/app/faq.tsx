"use client";

import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order?: number;
}

interface FaqProps {
  faqs: FAQItem[];
}

export function Faq({ faqs }: FaqProps) {
  const [open, setOpen] = React.useState(0);
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <section className="py-8 px-8 lg:py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <Typography variant="h1" color="blue-gray" className="mb-4">
            Frequently asked questions
          </Typography>
          <Typography
            variant="lead"
            className="mx-auto mb-24 lg:w-3/5 !text-gray-500"
          >
            Welcome to the AI Conference 2023 FAQ section. We&apos;re here to
            address your most common queries and provide you with the
            information you need to make the most of your conference experience.
          </Typography>
        </div>

        <div className="mx-auto lg:max-w-screen-lg lg:px-20">
          {faqs.length === 0 ? (
            <div className="text-center py-8">
              <Typography color="gray" className="font-normal">
                No FAQs available at this time.
              </Typography>
            </div>
          ) : (
            faqs.map((faq, key) => (
              <Accordion
                key={faq._id}
                open={open === key + 1}
                onClick={() => handleOpen(key + 1)}
              >
                <AccordionHeader className="text-left text-gray-900">
                  {faq.question}
                </AccordionHeader>
                <AccordionBody>
                  <Typography
                    color="blue-gray"
                    className="font-normal text-gray-500"
                  >
                    {faq.answer}
                  </Typography>
                </AccordionBody>
              </Accordion>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Faq;
