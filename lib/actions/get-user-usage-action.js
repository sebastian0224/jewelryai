"use server";

import prisma from "../prisma";

// Plan limits configuration
const PLAN_LIMITS = {
  free: 10,
  pro: 100,
  enterprise: 300,
};

export async function getUserUsageAction(userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        monthlyUsage: true,
        plan: true,
        createdAt: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Get plan limit
    const maxUsage = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    // Calculate days until reset (first day of next month)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const daysUntilReset = Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24));

    // Calculate progress percentage
    const progressPercentage = Math.min(
      (user.monthlyUsage / maxUsage) * 100,
      100
    );

    // Determine if user is approaching limit
    const isApproachingLimit = progressPercentage >= 80;
    const isAtLimit = user.monthlyUsage >= maxUsage;

    return {
      success: true,
      data: {
        currentUsage: user.monthlyUsage,
        maxUsage,
        plan: user.plan,
        progressPercentage,
        daysUntilReset,
        isApproachingLimit,
        isAtLimit,
        resetDate: nextMonth.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    };
  } catch (error) {
    console.error("❌ getUserUsageAction error:", error);
    return {
      success: false,
      error: error.message || "Failed to get user usage data",
    };
  }
}
