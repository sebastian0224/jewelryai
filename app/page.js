// app/page.js
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import AutoSignInModal from "@/components/auth/AutoSignInModal";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Footer />
      </main>
      <Suspense>
        <AutoSignInModal />
      </Suspense>
    </>
  );
}
