"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/" },
  { name: "Orders", href: "/orders" },
  { name: "Inventory", href: "/inventory" },
  { name: "Incidents", href: "/incidents" },
  { name: "Analytics", href: "/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white fixed left-0 top-0">

      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">OpsInsight</h1>

        <p className="text-xs text-slate-400 mt-1">
          Operations Intelligence
        </p>
      </div>

      <nav className="p-4 space-y-2">

        {menuItems.map((item) => {

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}

      </nav>

    </aside>
  );
}