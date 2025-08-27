"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Wand2, Image, TrendingUp, Sparkles } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Generate", href: "/dashboard", icon: Wand2 },
  { name: "Gallery", href: "/dashboard/gallery", icon: Image },
  { name: "Usage", href: "/dashboard/usage", icon: TrendingUp },
];

function SidebarContent({ onLinkClick }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-8 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-sidebar-foreground">
              JewelryAI
            </h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstName || user?.fullName || "Usuario"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">
              {user?.emailAddresses?.[0]?.emailAddress || ""}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false); // Cerrar sidebar en mobile cuando se hace click en un link
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-50 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Hamburger - Floating */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white shadow-lg border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-56">
            <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
            <SidebarContent onLinkClick={handleLinkClick} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
