import { CorsOptions } from "cors";

const whitelist: string[] = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://www.google.com",
  "https://medstream.onrender.com",
  "https://medstream-five.vercel.app",
  "https://medstream-admin.vercel.app",
  "https://findmeds.vercel.app",
  "https://findmeds-admin.vercel.app",
];

const allowedHostSuffixes = [".vercel.app"];

const allowedHostPrefixes = [
  "findmeds",
  "findmeds-admin",
  "medstream",
  "medstream-admin",
  "medstream-five",
];

const extraOriginsFromEnv = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedVercelOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    const isKnownPrefix = allowedHostPrefixes.some(
      (prefix) =>
        host === `${prefix}.vercel.app` || host.startsWith(`${prefix}-`),
    );
    const isKnownSuffix = allowedHostSuffixes.some((suffix) =>
      host.endsWith(suffix),
    );
    return isKnownPrefix && isKnownSuffix;
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin: string) =>
  whitelist.includes(origin) ||
  extraOriginsFromEnv.includes(origin) ||
  isAllowedVercelOrigin(origin);

const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true); // Allow request
    } else {
      // Do not throw here; returning false avoids surfacing as 500 for preflight.
      callback(null, false);
    }
  },
};

export default corsOptions;
