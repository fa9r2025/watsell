import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  console.log(`Compliance webhook ${topic} for ${shop}`);
  console.log(JSON.stringify(payload));

  return new Response();
};
