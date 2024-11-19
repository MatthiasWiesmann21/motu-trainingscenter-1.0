import authOptions from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { parse } from "url";
import Stripe from "stripe";

// Initialize Stripe with your secret API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16", // Use the latest API version or the one you need
});

export async function GET(req: Request) {
  try {
    const products = await stripe.products.list({
      limit: 10,
    });
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list({
          product: product.id,
        });

        return {
          ...product,
          prices: prices.data, // Add prices to the product object
        };
      })
    );
    return NextResponse.json(productsWithPrices);
  } catch (error) {
    console.log("[LIVE_EVENT_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
