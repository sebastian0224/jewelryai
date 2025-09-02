"use server";

import prisma from "../prisma";

// Configuración de límites por plan
const PLAN_LIMITS = {
  free: 12,
  pro: 60,
};

// Función para obtener el primer día del mes actual
function getMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

// Función para obtener el primer día del siguiente mes
function getNextMonthStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1);
}

// Función para calcular días hasta el reset
function getDaysUntilReset() {
  const now = new Date();
  const nextReset = getNextMonthStart();
  const diffTime = nextReset.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Función para formatear fecha de reset
function formatResetDate() {
  const nextReset = getNextMonthStart();
  return nextReset.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Obtiene información completa del usage del usuario
 */
export async function getUserUsage(userId) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Obtener usuario de la DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        monthlyUsage: true,
        plan: true,
        lastUsageReset: true,
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const plan = user.plan || "free";
    const maxUsage = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
    const currentUsage = user.monthlyUsage || 0;

    // Verificar si necesita reset mensual
    const monthStart = getMonthStart();
    const needsReset = !user.lastUsageReset || user.lastUsageReset < monthStart;

    let finalUsage = currentUsage;

    // Si necesita reset, hacerlo
    if (needsReset) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyUsage: 0,
          lastUsageReset: monthStart,
        },
      });
      finalUsage = 0;
    }

    const remainingImages = Math.max(0, maxUsage - finalUsage);
    const progressPercentage = Math.min(100, (finalUsage / maxUsage) * 100);
    const isAtLimit = finalUsage >= maxUsage;
    const isApproachingLimit = finalUsage >= maxUsage * 0.8; // 80% del límite

    return {
      success: true,
      data: {
        currentUsage: finalUsage,
        maxUsage,
        remainingImages,
        plan,
        progressPercentage,
        isAtLimit,
        isApproachingLimit,
        daysUntilReset: getDaysUntilReset(),
        resetDate: formatResetDate(),
      },
    };
  } catch (error) {
    console.error("Error getting user usage:", error);
    return {
      success: false,
      error: error.message || "Failed to get user usage",
    };
  }
}

/**
 * Incrementa el usage después de una generación exitosa
 */
export async function UpdateUserUsage(userId, count) {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Incrementar usage
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyUsage: {
          increment: count,
        },
      },
      select: {
        monthlyUsage: true,
        plan: true,
      },
    });

    return {
      success: true,
      newUsage: updatedUser.monthlyUsage,
      plan: updatedUser.plan,
    };
  } catch (error) {
    console.error("Error incrementing user usage:", error);
    return {
      success: false,
      error: error.message || "Failed to increment user usage",
    };
  }
}
