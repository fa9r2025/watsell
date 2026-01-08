import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { liquid } = await authenticate.public.appProxy(request);

  return liquid("Watsell app proxy is live.");
};
