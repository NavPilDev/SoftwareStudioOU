"use client";

import { Typography, Button, IconButton } from "@material-tailwind/react";
import { useState, useEffect } from "react";

const CURRENT_YEAR = new Date().getFullYear();
interface ContactInfo {
  _id: string;
  prefix?: string;
  fullName: string;
  email: string;
}

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo[]>([]);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const response = await fetch("/api/contact-info");
        if (response.ok) {
          const fetchedContactInfo = await response.json();
          setContactInfo(fetchedContactInfo);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        setContactInfo([]);
      }
    }
    fetchContactInfo();
  }, []);

  return (
    <footer className="pb-5 p-10 md:pt-10">
      <div className="container flex flex-col mx-auto">
        <div className="flex !w-full py-10 mb-5 md:mb-20 flex-col justify-center !items-center bg-gray-900 max-w-6xl mx-auto rounded-2xl p-5 ">
          <Typography
            className="text-2xl md:text-3xl text-center font-bold "
            color="white"
          >
            Join OU William Kerber Software Studio!
          </Typography>
          <Typography
            color="white"
            className=" md:w-7/12 text-center my-3 !text-base"
          >
            Build real products, learn from industry leaders, and launch your
            tech startup.
          </Typography>
          <div className="flex w-full md:w-fit gap-3 mt-2 flex-col md:flex-row">
            <a href="https://forms.gle/PYWTVEEeprE7APmZ8" target="_blank" className="relative inline-block">
              <div className="relative p-[2px] rounded-lg bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 bg-[length:200%_100%] animate-rainbow-border">
                <Button
                  color="white"
                  size="md"
                  className="relative z-10 bg-white hover:bg-gray-50 transition-colors w-full"
                >
                  Sign Up
                </Button>
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center !justify-between">
          <Typography as="a" href="#" variant="h6" className="text-gray-900">
            OU William Kerber Software Studio
          </Typography>
          <ul className="flex justify-center my-4 md:my-0 w-max mx-auto items-center gap-4">

          </ul>
          <div className="flex w-fit justify-center gap-2">
            <IconButton size="sm" color="gray" variant="text">
              <i className="fa-brands fa-twitter text-lg" />
            </IconButton>
            <IconButton size="sm" color="gray" variant="text">
              <i className="fa-brands fa-youtube text-lg" />
            </IconButton>
            <IconButton size="sm" color="gray" variant="text">
              <i className="fa-brands fa-instagram text-lg" />
            </IconButton>
            <IconButton size="sm" color="gray" variant="text">
              <i className="fa-brands fa-github text-lg" />
            </IconButton>
          </div>
        </div>

        {contactInfo.length > 0 && (
          <div className="mt-8 text-center">
            <Typography
              variant="h6"
              className="mb-4 font-semibold !text-gray-900"
            >

              Contact
            </Typography>
            <div className="flex flex-row items-center justify-center gap-8 w-full">
              {contactInfo.map((contact) => (
                <div key={contact._id} className="mb-2">
                  <Typography
                    variant="small"
                    className="font-bold !text-gray-700"
                  >
                    {contact.prefix ? `${contact.prefix} ` : ""}
                    {contact.fullName}
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal !text-gray-600"
                  >
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:!text-gray-900 transition-colors"
                    >
                      {contact.email}
                    </a>
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        )}

        <Typography
          color="blue-gray"
          className="text-center mt-12 font-normal !text-gray-700"
        >
          &copy; {CURRENT_YEAR} OU William Kerber Software Studio
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
