"use client";

import React from "react";
import {
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

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
            If you have any questions that aren't answered here, please contact us using the contact information in the footer.
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
            faqs.map((faq, key) => {
              const isOpen = open === key + 1;
              return (
                <Accordion
                  key={faq._id}
                  open={isOpen}
                  onClick={() => handleOpen(key + 1)}
                >
                  <AccordionHeader className="text-left text-gray-900">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>{faq.question}</span>
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                          }`}
                      />
                    </div>
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
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default Faq;
