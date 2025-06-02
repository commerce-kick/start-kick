import { AccountPageSkeleton } from "@/components/commerce/account/account-page-skeleton";
import { AddressManagement } from "@/components/commerce/account/address-management";
import {
  getCustomerQueryOptions,
  useCreateCustumerAddressMutation,
  useDeleteCustomerAddressMutation,
  useUpdateCustomerAddressMutation,
} from "@/integrations/salesforce/options/customer";
import { Address } from "@/integrations/salesforce/types/api";
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
  const createCustomerAddressMutation = useCreateCustumerAddressMutation();
  const deleteCustomerAddressMutation = useDeleteCustomerAddressMutation();
  const updateCustomerAddressMutation = useUpdateCustomerAddressMutation();

  const handleAddAddress = async (data: Address) => {
    await createCustomerAddressMutation.mutateAsync({
      body: data,
    });
  };

  const handleDelete = async (addressId: string) => {
    deleteCustomerAddressMutation.mutate({
      addressId,
    });
  };

  const handleDefault = async (addressId: string) => {
    const address = customer.addresses?.find(
      (address) => address.addressId === addressId,
    );

    if (!address) return;

    updateCustomerAddressMutation.mutate({
      body: {
        ...address,
        preferred: true,
      },
    });
  };

  const handleUpdate = async (newAddress: Address) => {
    updateCustomerAddressMutation.mutate({
      body: newAddress,
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
        onDeleteAddress={handleDelete}
        onSetDefault={handleDefault}
        onUpdateAddress={handleUpdate}
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
