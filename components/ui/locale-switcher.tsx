"use client";

import { useState, useEffect } from "react";
import { Locale, defaultLocale } from "@/i18n/config";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const COOKIE_NAME = "NEXT_LOCALE";

export default function LocaleSwitcher() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  // Retrieve the current locale from `document.cookie` on client-side load
  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`)
    );
    setLocale((match ? match[2] : defaultLocale) as Locale);
  }, []);

  // Update the locale in the cookie and reload the page
  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/`;
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {locale === "en" ? "🇺🇸" : "🇧🇷"}
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLocaleChange("en")}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLocaleChange("pt")}>
          🇧🇷 Portuguese
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
