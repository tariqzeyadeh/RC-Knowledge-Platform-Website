import { cookies } from "next/headers"
import { defaultLocale, getDictionary, isLocale, type Dictionary, type Locale } from "./index"

export async function getServerLocale(): Promise<Locale> {
  const cookie = (await cookies()).get("locale")?.value
  return isLocale(cookie) ? cookie : defaultLocale
}

export async function getServerDictionary(): Promise<Dictionary> {
  return getDictionary(await getServerLocale())
}
