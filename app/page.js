// app/page.js
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";
import AutoSignInModal from "@/components/auth/AutoSignInModal";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <main className="min-h-screen bg-background">
        <Header />
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </main>
      <Suspense>
        <AutoSignInModal />
      </Suspense>
    </>
  );
}
