import {
 
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,

} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import {  motion} from "framer-motion";

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
  {
    rel: "manifest",
    href: "/manifest.webmanifest",
  },

];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
       
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
  
  

  return (
   
      <NavLink to={to} className=" font-semibold tracking-wide  ">
      {({ isActive }) => (
        isActive ? <motion.div
          className="px-4 py-4 bg-blue-200 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
        >
          {name}
        </motion.div> : <div className="px-4 py-4">{name}</div>
        )}
        
          
      </NavLink>
    
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
      <div
        className="flex overflow-x-scroll scrollbar-none scrollbar-rounded-lg shadow-lg bg-white shadow-blue-200 gap-10 my-5 rounded-2xl mx-3 p-4"
       
      >
        <Items name="Home" to="/" />
        <Items name="Category" to="/category" />
        <Items name="Authors" to="/authors" />
        <Items name="Install" to="/install" />
        <Items name="Notification" to="/sendmsg" />
      </div>
    </motion.div>
  );
}