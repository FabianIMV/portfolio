import type { Metadata } from "next";
import { Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Fabián Muñoz - SRE | Terminal Portfolio",
  description: "Site Reliability Engineer with 3+ years in observability. Interactive terminal & dashboard portfolio showcasing Kubernetes, Datadog, Grafana expertise.",
  keywords: ["SRE", "Site Reliability Engineer", "Observability", "Kubernetes", "Datadog", "Grafana", "DevOps", "Chile"],
  authors: [{ name: "Fabián Muñoz" }],
  openGraph: {
    title: "Fabián Muñoz - SRE Terminal Portfolio",
    description: "Interactive SRE portfolio with terminal mode and live incident simulation",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabián Muñoz - SRE Terminal Portfolio",
    description: "Interactive SRE portfolio with terminal mode and live incident simulation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${firaCode.variable} antialiased font-sans bg-[#030014]`}
      >
        {children}
      </body>
    </html>
  );
}
