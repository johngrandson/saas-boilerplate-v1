import { cookies } from "next/headers";
import { Locale, defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

async function getUserLocale() {
  return cookies().get(COOKIE_NAME)?.value || defaultLocale;
}

async function setUserLocale(locale: Locale) {
  cookies().set(COOKIE_NAME, locale);
}

export { getUserLocale, setUserLocale };
