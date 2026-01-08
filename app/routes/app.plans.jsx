const PLANS = [
  {
    name: "Free",
    limit: "15 orders",
    description: "For testing the button with low usage.",
  },
  {
    name: "Starter",
    limit: "100 orders",
    description: "For small stores getting started.",
  },
  {
    name: "Pro",
    limit: "350 orders",
    description: "For growing stores with steady traffic.",
  },
  {
    name: "Business",
    limit: "1000 orders",
    description: "For high volume stores and campaigns.",
  },
];

export default function PlansPage() {
  return (
    <s-page heading="Plans">
      <s-section heading="Choose a plan">
        <s-paragraph>
          Each plan includes a monthly usage limit for WhatsApp button orders.
        </s-paragraph>
        <s-stack direction="block" gap="base">
          {PLANS.map((plan) => (
            <s-box
              key={plan.name}
              padding="base"
              borderWidth="base"
              borderRadius="base"
              background="subdued"
            >
              <s-stack direction="block" gap="small">
                <s-heading>{plan.name}</s-heading>
                <s-text emphasis="bold">{plan.limit}</s-text>
                <s-paragraph>{plan.description}</s-paragraph>
                <s-button variant="primary">Choose {plan.name}</s-button>
              </s-stack>
            </s-box>
          ))}
        </s-stack>
      </s-section>
    </s-page>
  );
}
