"use client";

import { FileText, SearchSlashIcon, SparklesIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { PlusIcon } from "./icons";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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
  const router = useRouter();
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
      <header className="sticky top-0 z-20 flex items-center gap-2 border-b bg-background px-2 py-1.5 md:hidden">
        <SidebarToggle />
        <Button
          className="ml-auto h-8 px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="sr-only">New Chat</span>
        </Button>
      </header>
      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <SidebarToggle className="h-12 w-12 rounded-full border bg-background/95 shadow-lg backdrop-blur" />
      </div>
      <header
        className={cn(
          "sticky top-0 z-10 hidden items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter:blur(0)]:bg-background/60 px-2 py-2 md:flex md:px-4 transition-transform duration-300",
          !isVisible && "-translate-y-full"
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
