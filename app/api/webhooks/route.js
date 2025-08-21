import { verifyWebhook } from "@clerk/nextjs/webhooks";
import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;
    const eventType = evt.type;

    if (eventType === "user.created") {
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            id,
            email: email_addresses[0]?.email_address || "",
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            avatarUrl: image_url,
            plan: "free",
          },
        });
      }
    }

    if (eventType === "user.updated") {
      await prisma.user.update({
        where: { id },
        data: {
          email: email_addresses[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          avatarUrl: image_url,
        },
      });
    }

    if (eventType === "user.deleted") {
      await prisma.user.delete({
        where: { id },
      });
    }

    console.log(`✅ Webhook processed: ${eventType} for user ${id}`);
    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return new Response("Webhook error", { status: 400 });
  }
}
