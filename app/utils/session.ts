import type { SalesforceSessionData } from "@/integrations/salesforce/types";
import { useSession } from "@tanstack/react-start/server";

export function useAppSession() {
  return useSession<SalesforceSessionData>({
    password: process.env.SESSION_SECRET || "your-session-secret-here-asd-a-sd-asd-as-d-as-da-sd-as",
  });
}
