import type { Metadata } from "next";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "JDAC - The Logistics Aggregator | Compare Surface Cargo Rates",
  description: "Compare freight rates from multiple surface cargo vendors. Find the best combination of price, delivery time and serviceability with JDAC.",
  keywords: ["logistics", "freight", "shipping", "surface cargo", "vendors", "rates comparison"],
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
