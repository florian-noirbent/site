import { SITE } from "../config/site";

const monthYear = {
  short: new Intl.DateTimeFormat(SITE.locale, { month: "short", year: "numeric" }),
  long: new Intl.DateTimeFormat(SITE.locale, { month: "long", year: "numeric" })
};

const fullDate = new Intl.DateTimeFormat(SITE.locale, { day: "numeric", month: "long", year: "numeric" });

export const formatMonthYear = (date: Date, style: keyof typeof monthYear = "short") =>
  monthYear[style].format(date);

export const formatDate = (date: Date) => fullDate.format(date);

/** `YYYY-MM-DD`, used for `<time datetime>` and client-side date filtering. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const byDateDesc = <T extends { data: { date: Date } }>(a: T, b: T) =>
  b.data.date.getTime() - a.data.date.getTime();
