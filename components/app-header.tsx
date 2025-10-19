"use client";

import { FileText, SearchSlashIcon, SparklesIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Badge } from "./ui/badge";

export const navigationItems = [
  {
    icon: SparklesIcon,
    label: "Agente CARF",
    href: "/",
  },
  {
    icon: FileText,
    label: "Meus processos",
    href: "/processos",
    badge: 8,
  },
  {
    icon: SearchSlashIcon,
    label: "Consultar processos",
    href: "/consultar",
  },
  {
    icon: TrendingUp,
    label: "Performance",
    href: "/performance",
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);
  return (
    <>
      <div className="fixed bottom-4 right-4 z-30 sm:hidden">
        <SidebarToggle className="h-12 w-12 rounded-full border bg-background/95 shadow-lg backdrop-blur" />
      </div>
      <header
        className={cn(
          "hidden items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 py-2 transition-transform duration-300 sm:sticky sm:top-0 sm:z-10 sm:flex sm:px-4",
          !isVisible && "sm:-translate-y-full"
        )}
      >
        <SidebarToggle />

        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant={isActive ? "secondary" : "outline"}
                    className="ml-auto text-xs"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
