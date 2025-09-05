import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <Link href="/">
            <h3 className="text-xl font-bold text-card-foreground">
              Jewelry<span className="text-secondary">AI</span>
            </h3>
          </Link>

          <p className="text-muted-foreground text-sm">
            © 2024 JewelryAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
