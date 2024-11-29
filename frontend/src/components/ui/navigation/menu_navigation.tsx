"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { NavigationMenuLink } from "../navigation-menu"
import DesktopMenu from "./desktop.menu"
import MobileMenu from "./mobile.menu"


export const MenuBar = () => {

  const [isMobile, setIsMobile] = React.useState(false);


  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="h-16 mb-10 text-[15px] fixed inset-0 flex items-center bg-transparent z-50 px-4">
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
    </header>
  )
}

export const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)

ListItem.displayName = "ListItem"
