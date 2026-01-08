import { useState } from "react";
import { authenticate } from "../shopify.server";

const PLAN_TO_BILLING = {
  starter: "Starter",
  pro: "Pro",
  business: "Business",
};
const PLAN_KEYS = new Set(Object.keys(PLAN_TO_BILLING));

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    limit: "100 orders",
    description: "For small stores getting started.",
    price: "$10",
  },
  {
    id: "pro",
    name: "Pro",
    limit: "350 orders",
    description: "For growing stores with steady traffic.",
    price: "$25",
  },
  {
    id: "business",
    name: "Business",
    limit: "1000 orders",
    description: "For high volume stores and campaigns.",
    price: "$50",
  },
];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return {};
};

export const action = async ({ request }) => {
  const { billing } = await authenticate.admin(request);
  const formData = await request.formData();
  const plan = String(formData.get("plan") || "");

  if (!PLAN_KEYS.has(plan)) {
    return new Response("Invalid plan", { status: 400 });
  }

  const billingPlan = PLAN_TO_BILLING[plan];
  const isTest =
    process.env.SHOPIFY_BILLING_TEST === "true" ||
    process.env.NODE_ENV !== "production";

  return billing.request({ plan: billingPlan, isTest });
};

export default function PlansPage() {
  const [submittingPlan, setSubmittingPlan] = useState(null);

  const submitPlan = async (plan) => {
    try {
      setSubmittingPlan(plan);
      const response = await fetch("/app/plans", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ plan }).toString(),
      });

      if (response.status === 401) {
        const redirectUrl =
          response.headers.get(
            "X-Shopify-API-Request-Failure-Reauthorize-Url",
          ) || response.headers.get("Location");
        if (redirectUrl) {
          window.top?.location?.assign(redirectUrl);
          return;
        }
      }

      if (response.redirected) {
        window.top?.location?.assign(response.url);
      }
    } finally {
      setSubmittingPlan(null);
    }
  };

  return (
    <s-page heading="Plans">
      <s-section heading="Choose a plan">
        <s-paragraph>
          Each plan includes a monthly usage limit for WhatsApp button orders.
        </s-paragraph>
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <div className="plan-card" key={plan.id}>
              <div className="plan-header">
                <h2>{plan.name}</h2>
                <span className="plan-price">{plan.price}</span>
              </div>
              <div className="plan-subtitle">{plan.description}</div>
              <div className="plan-limit">{plan.limit}</div>
              <button
                type="button"
                className="plan-cta"
                onClick={() => submitPlan(plan.id)}
                disabled={submittingPlan === plan.id}
              >
                {submittingPlan === plan.id
                  ? "Processing..."
                  : `Choose ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </s-section>
      <style>
        {`
          .plans-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(220px, 1fr));
            gap: 20px;
          }
          .plan-card {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.06);
          }
          .plan-header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
          }
          .plan-header h2 {
            margin: 0;
            font-size: 20px;
          }
          .plan-price {
            font-size: 22px;
            font-weight: 700;
          }
          .plan-subtitle {
            margin-top: 6px;
            color: #6b7280;
          }
          .plan-limit {
            margin-top: 10px;
            font-weight: 600;
          }
          .plan-cta {
            margin-top: 16px;
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: none;
            background: #111827;
            color: #ffffff;
            font-weight: 600;
            cursor: pointer;
          }
          .plan-cta:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
          @media (max-width: 1100px) {
            .plans-grid {
              grid-template-columns: repeat(2, minmax(220px, 1fr));
            }
          }
          @media (max-width: 640px) {
            .plans-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </s-page>
  );
}
