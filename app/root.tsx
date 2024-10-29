import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import {  motion} from "framer-motion";

import "./tailwind.css";
import { ManifestLink } from "@remix-pwa/sw";

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
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <ManifestLink />
        <Links />
      </head>
      <body className="flex justify-center bg-blue-50">
        <div className="max-w-2xl w-full min-w-56 px-4">
          <Heading />
          {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  

  return (
   
     <Outlet />
  );
}



function Items({ name, to }: { name: string; to: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={to} className="relative font-semibold tracking-wide px-2 py-1 space-y-2">
        {name}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute  bottom-0 left-0 right-0 h-0.5 bg-blue-600"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

function Heading() {
  return (
    <motion.div
      className="flex justify-center sticky top-0 z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex overflow-x-auto shadow-lg bg-white shadow-blue-200 gap-10 my-5 p-4 rounded-2xl mx-3"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Items name="Home" to="/" />
        <Items name="Category" to="/category" />
        <Items name="Authors" to="/authors" />
      </motion.div>
    </motion.div>
  );
}