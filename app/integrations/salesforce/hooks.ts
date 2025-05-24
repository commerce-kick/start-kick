import { salesforceQueries } from "@/integrations/salesforce/queries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function useSalesforce() {
  const router = useRouter();
  const context = router.options.context;

  if (!context.salesforceClient) {
    throw new Error("Salesforce client not found in router context");
  }

  return context.salesforceClient;
}

export function useSalesforceAuth() {
  const salesforceClient = useSalesforce();
  const queryClient = useQueryClient();

  const authStatusQuery = useQuery(
    salesforceQueries.auth(salesforceClient).status()
  );

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => salesforceClient.auth().login(username, password),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["salesforce"] }),
  });

  const logoutMutation = useMutation({
    mutationFn: () => salesforceClient.auth().logout(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["salesforce"] }),
  });

  return {
    authStatus: authStatusQuery.data,
    isLoadingAuthStatus: authStatusQuery.isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isAuthenticated: authStatusQuery.data?.isAuthenticated ?? false,
    isCustomerAuthenticated:
      authStatusQuery.data?.isCustomerAuthenticated ?? false,
    customerId: authStatusQuery.data?.customerId,
  };
}
