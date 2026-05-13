import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY in environment");
  }

  return new Stripe(secretKey);
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripeClient();
    const body = await req.json();
    const {
      amount,
      clubName,
      donorEmail,
      donorName,
      message,
      isRecurring,
      promoApplied,
      returnPath: rawReturnPath,
    } = body;
    // Only allow same-origin paths (no external redirects)
    const returnPath = typeof rawReturnPath === "string" && rawReturnPath.startsWith("/") && !rawReturnPath.startsWith("//")
      ? rawReturnPath
      : "/donate";


    const cents = Math.round(Number(amount) * 100);
    if (!promoApplied && (isNaN(cents) || cents < 50)) {
      return NextResponse.json(
        { error: "Minimum donation is $0.50" },
        { status: 400 }
      );
    }

    const metadata: Record<string, string> = {
      clubName: clubName || "General School Club Fund",
      donorName: donorName || "Anonymous",
      message: message || "",
    };


    let discounts: Stripe.Checkout.SessionCreateParams["discounts"] | undefined;
    if (promoApplied) {
      const COUPON_ID = "clubconnect_free";
      try {
        await stripe.coupons.retrieve(COUPON_ID);
      } catch {
        await stripe.coupons.create({
          id: COUPON_ID,
          percent_off: 100,
          duration: "once",
          name: "ClubConnect Free Checkout",
        });
      }
      discounts = [{ coupon: COUPON_ID }];
    }

    const finalCents = promoApplied ? Math.max(cents || 2500, 50) : cents;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer_email: donorEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${clubName || "General School Club Fund"}`,
              description: message
                ? `Message: ${message}`
                : "ClubConnect school club donation",
            },
            unit_amount: finalCents,
            ...(isRecurring && !promoApplied ? { recurring: { interval: "month" } } : {}),
          },
          quantity: 1,
        },
      ],
      mode: isRecurring && !promoApplied ? "subscription" : "payment",
      success_url: `${req.nextUrl.origin}${returnPath}?donated=true&amount=${(finalCents / 100).toFixed(2)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}${returnPath}`,
      metadata,
      ...(discounts ? { discounts } : {}),
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
