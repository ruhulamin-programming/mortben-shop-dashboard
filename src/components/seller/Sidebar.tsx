"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { LogOutIcon, Menu, X } from "lucide-react";
import Cookies from "js-cookie";

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const links = [
    { href: "/seller", label: "Overview" },
    { href: "/seller/users", label: "Manage Users" },
    { href: "/seller/profile", label: "Seller Profile" },
    { href: "/seller/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    Cookies.remove("accessToken");
    router.push("/");
  };

  return (
    <div>
      <button
        className="lg:hidden fixed top-3 left-2 z-50 bg-gray-900 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      <aside
        className={clsx(
          "fixed top-0 left-0 z-40 h-full bg-gray-800 text-gray-50 flex flex-col p-4 transition-transform duration-300 ease-in-out",
          "lg:w-64 w-58",
          {
            "-translate-x-full": !isOpen,
            "translate-x-0": isOpen,
            "lg:translate-x-0 lg:static": true,
          }
        )}
      >
        <div className="lg:text-start text-center">
          <Link href={"/seller"} className="text-2xl font-bold">
            Seller Logo
          </Link>
        </div>
        <nav className="space-y-4 lg:text-2xl text-xl mt-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "block transition-colors",
                pathname === href
                  ? "text-blue-400 font-semibold"
                  : "hover:text-blue-400"
              )}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div
          onClick={handleLogout}
          className="flex gap-2 items-center justify-center bg-red-500 rounded-md mt-10 py-1 cursor-pointer"
        >
          <LogOutIcon />
          <p className="lg:text-2xl text-xl ">Logout</p>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
