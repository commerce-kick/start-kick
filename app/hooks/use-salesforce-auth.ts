// hooks/use-salesforce-auth.ts
import {
  authenticateCustomer,
  logoutCustomer,
} from "@/integrations/salesforce/server/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSalesforceAuth() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authenticateCustomer({ data: { username, password } }),
    onSuccess: () => {
      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutCustomer({}),
    onSuccess: () => {
      // Invalidate all queries to refetch as guest
      queryClient.invalidateQueries();
    },
  });

  return {
    loginMutation,
    logoutMutation,
  };
}
