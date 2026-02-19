"use client";

import { usePathname } from "next/navigation";
import { memo, useMemo } from "react";
import useTopOfScreen from "~/hooks/useTopOfScreen";
import { cn } from "~/lib/utils";
import { useMousePosition } from "../hooks/useMousePosition";
import BetterLink from "./BetterLink";
import Container from "./Container";
import DarkModeToggle from "./DarkModeToggle";
import { HStack } from "./HelperDivs";
import { FadeInText } from "./fade-in";

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { label: "About Me", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Playground", href: "/playground" },
];

// Memoize the Links component to prevent unnecessary rerenders
const Links = memo<{ pathname: string }>(({ pathname }) => {
  return navItems.map((item: NavItem, index: number) => {
    const isActive = item.href === pathname;
    return (
      <BetterLink
        key={index}
        href={item.href}
        className={cn(
          // "relative py-2 after:absolute after:bottom-2 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-primary after:to-accent after:transition-all hover:after:w-full",
          "relative py-2",
          isActive ? "font-bold" : "opacity-70",
        )}
      >
        {isActive ? (
          <FadeInText
            text={item.label}
            delayBetween={0.02}
            yOffset={10}
            className="inline-block"
          />
        ) : (
          item.label
        )}
      </BetterLink>
    );
  });
});

Links.displayName = "Links";

const Navbar = () => {
  const { atTopOfPage } = useTopOfScreen();
  const mousePos = useMousePosition();
  const pathname = usePathname();

  // Only recompute when the mouse y position crosses the threshold or atTopOfPage changes
  const showNavbar = useMemo(() => {
    return mousePos.y < 100 || !atTopOfPage;
  }, [mousePos.y, atTopOfPage]);

  return (
    <header className="fixed left-1/2 top-4 z-50 w-full max-w-navbar -translate-x-1/2">
      <Container
        className="mx-auto w-full py-4"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: showNavbar ? 1 : 0, y: showNavbar ? 0 : -100 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          stiffness: 300,
          damping: 25,
        }}
      >
        <nav className="relative mx-auto w-full px-4 lg:text-sm">
          <div className="flex items-center justify-between">
            <BetterLink href="/" className="p-0">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-xl font-black tracking-tight">
                  Miles Fritzmather
                </span>
              </div>
            </BetterLink>
            <HStack
              centered
              gap={8}
              className="absolute left-1/2 flex -translate-x-1/2 flex-row"
            >
              <Links pathname={pathname} />
            </HStack>
            <div className="flex flex-row items-center justify-end gap-4 space-x-6 lg:space-x-0">
              <DarkModeToggle />
              {/* <SuperThemeToggle /> */}
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default Navbar;
