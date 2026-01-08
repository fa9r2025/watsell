import { useLoaderData } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const plan = url.searchParams.get("plan") || "free";

  return { plan };
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
