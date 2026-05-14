import { createServerFn } from "@tanstack/react-start";
import type { LocalLensData } from "@/lib/db.server";

export const getLocalLensDataFn = createServerFn().handler(async (): Promise<LocalLensData> => {
  const { getLocalLensData } = await import("@/lib/db.server");
  return getLocalLensData();
});
