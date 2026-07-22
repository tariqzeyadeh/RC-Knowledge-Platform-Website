import { defaultLocale, isLocale, type Locale } from "@/i18n"

export function getLocaleFromRequest(request: Request): Locale {
  const url = new URL(request.url)
  const queryLocale = url.searchParams.get("locale")
  if (isLocale(queryLocale)) return queryLocale

  const cookie = request.headers.get("cookie") ?? ""
  const match = cookie.match(/(?:^|; )locale=([^;]*)/)
  if (isLocale(match?.[1])) return match[1]

  return defaultLocale
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, { status })
}
