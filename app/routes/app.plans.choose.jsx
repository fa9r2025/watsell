import { redirect, useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

const PLAN_TO_BILLING = {
  starter: "Starter",
  pro: "Pro",
  business: "Business",
};

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "free";

  return { plan };
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);

  const formData = await request.formData();
  const plan = (formData.get("plan") || "free").toString();

  if (plan === "free") {
    return redirect("/app/plans?selected=free");
  }

  const billingPlan = PLAN_TO_BILLING[plan];
  if (!billingPlan) {
    return redirect("/app/plans?error=unknown-plan");
  }

  const returnUrl = new URL("/app/plans?selected=" + plan, request.url).href;

  await billing.request({
    plan: billingPlan,
    isTest: process.env.NODE_ENV !== "production",
    returnUrl,
  });
};

export default function PlanChoosePage() {
  const { plan } = useLoaderData();

  return (
    <s-page heading="Plan selected">
      <s-section>
        <s-paragraph>
          You selected: <s-text emphasis="bold">{plan}</s-text>
        </s-paragraph>
        <s-paragraph>
          Billing setup will be wired here once plans are connected to Shopify
          Billing.
        </s-paragraph>
      </s-section>
    </s-page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
