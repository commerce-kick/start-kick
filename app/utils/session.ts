import type { SalesforceSessionData } from "@/integrations/salesforce/types/params";
import { useSession } from "@tanstack/react-start/server";

export function useAppSession() {
  return useSession<SalesforceSessionData>({
    name: "SLAS",
    password:
      process.env.SESSION_SECRET ||
      "your-session-secret-here-asd-a-sd-asd-as-d-as-da-sd-as",
  });
}
