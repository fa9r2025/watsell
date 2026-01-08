import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

// Railway يعطي HOST بلا https أحيانًا → نصلّحو
const rawHost = (
  process.env.SHOPIFY_APP_URL ||
  process.env.HOST ||
  ""
).trim();

if (!rawHost) {
  throw new Error("Missing SHOPIFY_APP_URL or HOST env variable");
}

const appUrl = rawHost.startsWith("http")
  ? rawHost
  : `https://${rawHost}`;

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: appUrl,
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;

// 🔥 OAuth يحتاج هاذم
export const authenticate = shopify.authenticate;
export const login = shopify.authenticate.admin;
