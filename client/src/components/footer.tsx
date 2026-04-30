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
          <div className="flex w-full md:w-fit items-center justify-center gap-3 mt-2 flex-col md:flex-row">
            <a
              href="https://forms.gle/PYWTVEEeprE7APmZ8"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block"
            >
              <div className="relative p-[2px] rounded-lg bg-[linear-gradient(90deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7,#ef4444)] bg-[length:200%_100%] animate-rainbow-border">
                <Button
                  color="white"
                  size="md"
                  className="relative z-10 bg-white hover:bg-gray-50 transition-colors w-full"
                >
                  Sign Up
                </Button>
              </div>
            </a>
            <span
              aria-hidden
              className="hidden select-none text-blue-gray-200 md:inline"
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
                size="md"
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
