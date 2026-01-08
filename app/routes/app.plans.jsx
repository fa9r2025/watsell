import { useSubmit } from "react-router";

const PLANS = [
  {
    id: "free",
    name: "Free",
    limit: "15 orders",
    description: "For testing the button with low usage.",
  },
  {
    id: "starter",
    name: "Starter",
    limit: "100 orders",
    description: "For small stores getting started.",
  },
  {
    id: "pro",
    name: "Pro",
    limit: "350 orders",
    description: "For growing stores with steady traffic.",
  },
  {
    id: "business",
    name: "Business",
    limit: "1000 orders",
    description: "For high volume stores and campaigns.",
  },
];

export default function PlansPage() {
  const submit = useSubmit();

  return (
    <s-page heading="Plans">
      <s-section heading="Choose a plan">
        <s-paragraph>
          Each plan includes a monthly usage limit for WhatsApp button orders.
        </s-paragraph>
        <div className="plans-grid">
          {PLANS.map((plan) => (
            <s-box
              key={plan.id}
              padding="base"
              borderWidth="base"
              borderRadius="base"
              background="subdued"
            >
              <s-stack direction="block" gap="small">
                <s-heading>{plan.name}</s-heading>
                <s-text emphasis="bold">{plan.limit}</s-text>
                <s-paragraph>{plan.description}</s-paragraph>
                <s-button
                  variant="primary"
                  onClick={() =>
                    submit({ plan: plan.id }, { method: "post", action: "/app/plans/choose" })
                  }
                >
                  Choose {plan.name}
                </s-button>
              </s-stack>
            </s-box>
          ))}
        </div>
      </s-section>
      <style>
        {`
          .plans-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(200px, 1fr));
            gap: 16px;
          }
          @media (max-width: 1100px) {
            .plans-grid {
              grid-template-columns: repeat(2, minmax(200px, 1fr));
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
