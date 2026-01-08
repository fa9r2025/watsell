import { json } from "@remix-run/node";
import { db } from "~/db.server";

export async function action({ request }) {
  try {
    const shop = request.headers.get("X-Shopify-Shop-Domain");

    if (!shop) {
      return json({ ok: false, error: "No shop" }, { status: 400 });
    }

    await db.click.create({
      data: { shop }
    });

    return json({ ok: true });
  } catch (e) {
    console.error(e);
    return json({ ok: false }, { status: 500 });
  }
}

