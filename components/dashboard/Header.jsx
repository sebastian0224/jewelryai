"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { UsageBar } from "@/components/dashboard/UsageBar";

export function Header() {
  return (
    <header className="bg-[#155E63] border-b border-[#A8A8A8] shadow-sm">
      <div className="container mx-auto max-w-7xl">
        <div className="relative flex items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo - Left */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C9A227] rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-[#FAFAF7]" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#FAFAF7]">
              JewelryAI
            </h1>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-[#FAFAF7] hover:text-[#C9A227] transition-colors font-medium text-base rounded-lg hover:bg-[#FAFAF7]/10"
            >
              Generate
            </Link>
            <Link
              href="/dashboard/gallery"
              className="px-4 py-2 text-[#FAFAF7] hover:text-[#C9A227] transition-colors font-medium text-base rounded-lg hover:bg-[#FAFAF7]/10"
            >
              Gallery
            </Link>
          </nav>

          {/* Usage Bar + Profile - Right */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <UsageBar />
            </div>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-xl shadow-md border-2 border-primary/20",
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Shows only on small screens */}
        <div className="md:hidden border-t border-[#A8A8A8]/20 px-6 py-3">
          <nav className="flex justify-center space-x-6">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-[#FAFAF7] hover:text-[#C9A227] transition-colors font-medium text-sm rounded-lg hover:bg-[#FAFAF7]/10"
            >
              Generate
            </Link>
            <Link
              href="/dashboard/gallery"
              className="px-3 py-2 text-[#FAFAF7] hover:text-[#C9A227] transition-colors font-medium text-sm rounded-lg hover:bg-[#FAFAF7]/10"
            >
              Gallery
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
