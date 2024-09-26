import { isDevelopment } from "./env";

export const server = !isDevelopment
  ? "https://multi-vendor-ecommerce-silk.vercel.app/api/v2"
  : "http://localhost:8000/api/v2";

export const backend_url = !isDevelopment
  ? "https://multi-vendor-ecommerce-silk.vercel.app/"
  : "http://localhost:8000/";

// export const server = "https://multi-vendor-ecommerce-silk.vercel.app/api/v2";
// export const backend_url = "https://multi-vendor-ecommerce-silk.vercel.app/";

// export const server = "http://localhost:8000/api/v2";
// export const backend_url = "http://localhost:8000/";
