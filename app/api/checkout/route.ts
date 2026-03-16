import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amount,
      clubName,
      donorEmail,
      donorName,
      message,
      isRecurring,
      promoApplied,
    } = body;

    // Validate amount
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

    // For promo code "test" — create a $0 checkout for demo
    if (promoApplied) {
      // Use payment mode with amount 0 isn't supported by Stripe,
      // so we create a checkout session with the lowest amount and 100% coupon
      // or simply return a simulated success for the demo flow
      return NextResponse.json({
        demo: true,
        message: "Demo transaction completed successfully. No charge was made.",
        transactionId: `demo_${Date.now().toString(36)}`,
      });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
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
            unit_amount: cents,
            ...(isRecurring ? { recurring: { interval: "month" } } : {}),
          },
          quantity: 1,
        },
      ],
      mode: isRecurring ? "subscription" : "payment",
      success_url: `${req.nextUrl.origin}/donate?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/donate?canceled=true`,
      metadata,
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
