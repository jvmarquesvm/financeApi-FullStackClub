import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
//http://localhost:300/api/webhooks/stripe - POST
export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  //Secret construída quando configurar o webhook - passo 2
  //$ stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  switch (event.type) {
    //Evento do Stripe quando acontece um pagamento
    case "invoice.paid": {
      // Atualizar o usuário com o seu novo plano
      const { customer, subscription, subscription_details } =
        event.data.object;
      const clerkUserId = subscription_details?.metadata?.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      //Serve para cancelar uma compra
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customer,
          stripeSubscriptionId: subscription,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }
    case "customer.subscription.deleted": {
      // Remover plano premium do usuário
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      const clerkUserId = subscription.metadata.clerk_user_id;
      if (!clerkUserId) {
        return NextResponse.error();
      }
      await clerkClient().users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
    }
  }
  //Notificar ao Stripe que tudo foi processado com sucesso
  return NextResponse.json({ received: true });
};
