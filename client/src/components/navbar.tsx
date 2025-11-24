import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import {
  RectangleStackIcon,
  UserCircleIcon,
  CommandLineIcon,
  Squares2X2Icon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

function NavItem({ children, href, onClick }: NavItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Check if href is external (starts with http:// or https://)
  const isExternal = href?.startsWith("http://") || href?.startsWith("https://");

  return (
    <li>
      <Typography
        as="a"
        href={href || "#"}
        target={isExternal ? "_blank" : "_self"}
        variant="paragraph"
        className="flex items-center gap-2 font-medium cursor-pointer"
        onClick={onClick ? handleClick : undefined}
      >
        {children}
      </Typography>
    </li>
  );
}

const NAV_MENU = [
  {
    name: "Home",
    icon: RectangleStackIcon,
  },
  {
    name: "About",
    icon: UserCircleIcon,
  },
  {
    name: "Projects",
    icon: CommandLineIcon,
    href: "https://www.material-tailwind.com/docs/react/installation",
  },
  {
    name: "Blog",
    icon: CommandLineIcon,
    href: "/blog",
  },
];

export function Navbar({
  aboutRef,
  projectsRef,
  homeRef,
}: {
  aboutRef?: React.RefObject<HTMLDivElement>;
  projectsRef?: React.RefObject<HTMLDivElement>;
  homeRef?: React.RefObject<HTMLDivElement>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(!isHomePage);

  const handleOpen = () => setOpen((cur) => !cur);

  const scrollToAbout = () => {
    if (isHomePage && aboutRef?.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#about");
    }
  };

  const scrollToProjects = () => {
    if (isHomePage && projectsRef?.current) {
      projectsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      router.push("/#projects");
    }
  };

  const scrollToHome = () => {
    if (isHomePage && homeRef?.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#home");
    }
  };

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    if (!isHomePage) {
      setIsScrolling(true);
      return;
    }

    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    // Set initial state based on scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MTNavbar
      shadow={false}
      fullWidth
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0"
    >
      <div className="container mx-auto flex items-center justify-between">
        {isScrolling ? (
          <button onClick={scrollToHome} className="flex items-center">
            <Image
              src="/image/SoftwareStudioLogoBlack.png"
              alt="Software Studio OU"
              width={120}
              height={50}
              className="w-auto"
            />
          </button>
        ) : (
          <button onClick={scrollToHome} className="flex items-center">
            <Image
              src="/image/SoftwareStudioLogoWhite.png"
              alt="Software Studio OU"
              width={120}
              height={50}
              className="w-auto"
            />
          </button>
        )}
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          {NAV_MENU.map(({ name, icon: Icon, href }) => (
            <NavItem
              key={name}
              href={href}
              onClick={
                name === "About"
                  ? scrollToAbout
                  : name === "Projects"
                  ? scrollToProjects
                  : name === "Home"
                  ? scrollToHome
                  : undefined
              }
            >
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </NavItem>
          ))}
        </ul>
        <div className="hidden items-center gap-4 lg:flex">
          <a href="https://forms.gle/odC79LhjZ3me5QYu9" target="_blank">
            <Button color={isScrolling ? "gray" : "white"} variant="text">
              Invest
            </Button>
          </a>
          <a href="https://forms.gle/PYWTVEEeprE7APmZ8" target="_blank">
            <Button color={isScrolling ? "gray" : "white"}>Sign Up</Button>
          </a>
        </div>
        <IconButton
          variant="text"
          color={isScrolling ? "gray" : "white"}
          onClick={handleOpen}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto mt-4 rounded-lg bg-white px-6 py-5">
          <ul className="flex flex-col gap-4 text-gray-900">
            {NAV_MENU.map(({ name, icon: Icon, href }) => (
              <NavItem
                key={name}
                href={href}
                onClick={
                  name === "About"
                    ? scrollToAbout
                    : name === "Home"
                    ? scrollToHome
                    : undefined
                }
              >
                <Icon className="h-5 w-5" />
                {name}
              </NavItem>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-4">
            <Button variant="text">Invest</Button>
            <a href="https://forms.gle/PYWTVEEeprE7APmZ8" target="_blank">
              <Button color="gray">Sign Up</Button>
            </a>
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
