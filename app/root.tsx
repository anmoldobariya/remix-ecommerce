import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { NavigationLoadingOverlay } from "~/components/ui/navigation-loading";
import { GoogleAnalytics } from "~/components/analytics";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/logo-light.png" },
  { rel: "manifest", href: "/manifest.json" },
];

// Global SEO meta tags for all pages
export const meta: MetaFunction = () => {
  return [
    { title: "Optical Shop - Premium Eyewear with Personal Service" },
    { name: "description", content: "Premium eyewear collection with personalized service. Sunglasses, prescription glasses, computer glasses and more. Get instant quotes and expert consultations." },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#2563eb" },
    { name: "apple-mobile-web-app-title", content: "Optical Shop" },
    { name: "application-name", content: "Optical Shop" },
    { name: "msapplication-TileColor", content: "#2563eb" },
    // Organization structured data will be added by individual pages
    {
      tagName: "script",
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Optical Shop",
        "url": "https://opticalshop.com",
        "logo": "https://opticalshop.com/logo-light.png",
        "description": "Premium eyewear collection with personalized service.",
        "telephone": "+1-800-OPTICAL",
        "email": "hello@opticalshop.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Vision Street",
          "addressLocality": "Eye City",
          "addressRegion": "NY",
          "postalCode": "10001",
          "addressCountry": "United States"
        }
      })
    }
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <GoogleAnalytics />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <NavigationLoadingOverlay />
      <Outlet />
    </>
  );
}
