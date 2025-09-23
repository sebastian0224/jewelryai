import { verifyWebhook } from "@clerk/nextjs/webhooks";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

interface ClerkWebhookUser {
  id: string;
  object: "user";
  birthday: string;
  created_at: number;
  email_addresses: Array<{
    email_address: string;
    id: string;
    linked_to: any[];
    object: "email_address";
    verification: {
      status: string;
      strategy: string;
    };
  }>;
  external_accounts: any[];
  external_id: string | null;
  first_name: string;
  gender: string;
  image_url: string;
  last_name: string;
  last_sign_in_at: number | null;
  password_enabled: boolean;
  phone_numbers: any[];
  primary_email_address_id: string | null;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  private_metadata: Record<string, any>;
  profile_image_url: string;
  public_metadata: Record<string, any>;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, any>;
  updated_at: number;
  username: string | null;
  web3_wallets: any[];
}

interface ClerkWebhookEvent {
  data: ClerkWebhookUser;
  instance_id: string;
  object: "event";
  timestamp: number;
  type: string;
}

export async function POST(req: NextRequest) {
  try {
    const evt = (await verifyWebhook(req)) as unknown as ClerkWebhookEvent;

    console.log("Event data structure:", Object.keys(evt.data));
    console.log("Full event data:", evt.data);

    // Ahora TypeScript reconocerá todas las propiedades
    const { id, first_name, email_addresses, last_name, image_url } = evt.data;
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
