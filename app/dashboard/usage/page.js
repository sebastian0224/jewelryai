"use client";

import { UsageCard } from "@/components/dashboard/Usage/UsageCard";

export default function UsagePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-8">Usage & Statistics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Usage Card */}
        <div className="lg:col-span-2">
          <UsageCard />
        </div>
      </div>
    </div>
  );
}
