import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { NavigationLoadingOverlay } from "~/components/ui/navigation-loading";
import { GoogleAnalytics } from "~/components/analytics";
import { ConfirmationDialogProvider } from "~/components/ui/confirmation-dialog";
import { SITE_CONFIG } from "~/utils/seo";

import "./tailwind.css";

// Loader to provide environment variables to the client
export const loader = async () => {
  return json({
    ENV: {
      NODE_ENV: process.env.NODE_ENV || "development",
      GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
      GOOGLE_SEARCH_CONSOLE_VERIFICATION:
        process.env.GOOGLE_SEARCH_CONSOLE_VERIFICATION
    }
  });
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "apple-touch-icon", href: "/logo-light.png" },
  { rel: "manifest", href: "/manifest.json" }
];

// Global SEO meta tags for all pages
export const meta: MetaFunction = () => {
  return [
    { title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}` },
    { name: "description", content: SITE_CONFIG.description },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "theme-color", content: "#2563eb" },
    { name: "apple-mobile-web-app-title", content: SITE_CONFIG.name },
    { name: "application-name", content: SITE_CONFIG.name },
    { name: "msapplication-TileColor", content: "#2563eb" }
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <GoogleAnalytics env={ENV} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QYEL143FG0"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-QYEL143FG0');
        </script>
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ConfirmationDialogProvider>
      <NavigationLoadingOverlay />
      <Outlet />
    </ConfirmationDialogProvider>
  );
}
