import type { NextConfig } from "next";

// Next.jsが内部で注入する環境変数を削除し、lightningcssがネイティブバイナリをロードするように強制する
delete process.env.CSS_TRANSFORMER_WASM;

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "lightningcss",
    "lightningcss-darwin-arm64",
    "@tailwindcss/node",
    "@tailwindcss/postcss",
  ],
};

export default nextConfig;
