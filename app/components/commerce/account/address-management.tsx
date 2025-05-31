import { AddressForm } from "@/components/commerce/adress-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Address, Customer } from "@/integrations/salesforce/types/api";
import { AddressCallback } from "@/integrations/salesforce/types/params";
import { MapPin, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";

interface AddressManagementProps {
  customer: Customer;
  onAddAddress: (data: AddressCallback) => void;
  onUpdateAddress: (addressId: string, data: Address) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

export function AddressManagement({
  customer,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressManagementProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);

  const formatAddress = (address: Address) => {
    return `${address.address1}${address.address2 ? `, ${address.address2}` : ""}, ${address.city}, ${address.stateCode} ${address.postalCode}`;
  };

  const handleAddAddress = (data: {
    address: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => {
    onAddAddress({
      address: data.address,
      setAsDefault: data.setAsDefault,
    });
    setIsAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {customer.addresses && customer.addresses.length > 0 ? (
        <>
          {customer.addresses?.map((address) => (
            <div
              key={address.addressId}
              className="flex items-start justify-between rounded-lg border p-4"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {address.firstName} {address.lastName}
                    </span>
                    {address.preferred && (
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {formatAddress(address)}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {address.phone}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </>
      ) : (
        <div className="py-8 text-center">
          <MapPin className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">No addresses saved</h3>
          <p className="text-muted-foreground mb-4">
            Add an address to make checkout faster
          </p>
        </div>
      )}
      <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Add a new address to your account
            </DialogDescription>
          </DialogHeader>
          <AddressForm
            customer={customer}
            title=""
            description=""
            onSubmit={handleAddAddress}
            onBack={() => setIsAddingNew(false)}
            submitButtonText="Save Address"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
