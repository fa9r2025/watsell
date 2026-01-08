import prisma from "../db.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  if (!shop) {
    return new Response("Missing shop", { status: 400 });
  }

  await prisma.click.create({ data: { shop } });

  return new Response(null, { status: 204 });
};

export const loader = async () => {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
};
