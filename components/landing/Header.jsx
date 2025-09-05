// components/Header.js
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold text-foreground cursor-pointer">
                Jewelry<span className="text-secondary">AI</span>
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Pricing
            </a>
            <a
              href="#demo"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              Demo
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <button className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-colors">
                Start Free
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </header>
  );
}
