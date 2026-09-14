import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "JC NIVA | Websites for coaches that move visitors to action",
  description: "Clear, vibrant, conversion-focused websites for independent coaches.",
  metadataBase: new URL("https://jcniva.com"),
  openGraph: { title: "JC NIVA — Digital Craftsmanship", description: "Websites for coaches that do more than look good.", images: ["/assets/jc-niva-logo.jpeg"] }
};

export default function RootLayout({ children }) { return <html lang="en"><body><SiteHeader />{children}<SiteFooter /><SpeedInsights /></body></html>; }
