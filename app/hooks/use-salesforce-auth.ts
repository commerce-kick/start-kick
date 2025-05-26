// hooks/use-salesforce-auth.ts
import {
  authenticateCustomer,
  logoutCustomer,
  registerCustomer,
} from "@/integrations/salesforce/server/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function useSalesforceAuth() {
  const queryClient = useQueryClient();

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => authenticateCustomer({ data: { username, password } }),
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.navigate({
        to: "/",
        replace: true,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (formData: {
      data: {
        email: string;
        firstName: string;
        lastName: string;
        password: string;
      };
    }) => registerCustomer(formData),
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.navigate({
        to: "/",
        replace: true,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutCustomer({}),
    onSuccess: () => {
      queryClient.invalidateQueries();
      router.navigate({
        to: "/",
        replace: true,
      });
    },
  });

  return {
    loginMutation,
    logoutMutation,
    registerMutation,
  };
}
