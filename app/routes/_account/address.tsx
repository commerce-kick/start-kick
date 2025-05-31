import { AccountPageSkeleton } from "@/components/commerce/account/account-page-skeleton";
import { AddressManagement } from "@/components/commerce/account/address-management";
import {
  getCustomerQueryOptions,
  useCreateCustumerAddressMutation,
} from "@/integrations/salesforce/options/customer";
import { AddressCallback } from "@/integrations/salesforce/types/params";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/_account/address")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context;
    queryClient.ensureQueryData(getCustomerQueryOptions());
  },
});

function AddressContent() {
  const { data: customer } = useSuspenseQuery(getCustomerQueryOptions());
  const createCustomerAdressMutation = useCreateCustumerAddressMutation();

  const handleAddAddress = async (data: AddressCallback) => {
    await createCustomerAdressMutation.mutateAsync({
      body: {
        ...data.address,
        preferred: data.setAsDefault,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <MapPin className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
      </div>

      <AddressManagement
        customer={customer}
        onAddAddress={handleAddAddress}
        onDeleteAddress={() => {}}
        onSetDefault={() => {}}
        onUpdateAddress={() => {}}
      />
    </div>
  );
}

function RouteComponent() {
  return (
    <Suspense fallback={<AccountPageSkeleton variant="default" cards={2} />}>
      <AddressContent />
    </Suspense>
  );
}
