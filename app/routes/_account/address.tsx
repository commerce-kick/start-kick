import {
  getCustomerQueryOptions,
  useCreateCustumerAddressMutation,
} from "@/integrations/salesforce/options/customer";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { AddressManagement } from "@/components/commerce/account/address-management";
import { AddressCallback } from "@/integrations/salesforce/types/params";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_account/address")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: customer, isLoading } = useQuery(getCustomerQueryOptions());

  const createCustomerAdressMutation = useCreateCustumerAddressMutation();

  const handleAddAddress = async (data: AddressCallback) => {
    await createCustomerAdressMutation.mutateAsync({
      body: {
        ...data.address,
        preferred: data.setAsDefault,
      },
    });
  };

  const handleEditAddress = async () => {};

  const handleDeleteAddress = async (addressId: string) => {};

  const handleSetPreferred = async (addressId: string) => {};

  if (isLoading) {
    return (
      <>
        <div className="mb-8 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">My Addresses</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="bg-muted h-6 w-3/4 rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-2/3 rounded" />
                <div className="bg-muted h-8 w-24 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  if (!customer) {
    return <></>;
  }

  return (
    <AddressManagement
      customer={customer}
      onAddAddress={handleAddAddress}
      onDeleteAddress={() => {}}
      onSetDefault={() => {}}
      onUpdateAddress={() => {}}
    />
  );
}
