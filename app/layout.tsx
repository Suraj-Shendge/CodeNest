import "../styles/globals.css";
import { Metadata } from "next";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Modern LeetCode",
  description: "Interactive coding challenges with animations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        {/* All client‑side UI (theme, container, page‑transitions) lives in Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
