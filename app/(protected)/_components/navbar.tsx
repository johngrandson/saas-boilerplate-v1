"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import LocaleSwitcher from "@/components/ui/locale-switcher";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations("NavBar");

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <LocaleSwitcher />
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">{t("server")}</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/client" ? "default" : "outline"}
        >
          <Link href="/client">{t("client")}</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/admin" ? "default" : "outline"}
        >
          <Link href="/admin">{t("admin")}</Link>
        </Button>
        <Button
          asChild
          variant={pathname === "/account-settings" ? "default" : "outline"}
        >
          <Link href="/account-settings">{t("settings")}</Link>
        </Button>
      </div>
    </nav>
  );
};
