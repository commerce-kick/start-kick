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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Address, Customer } from "@/integrations/salesforce/types/api";
import { MapPin, MoreHorizontal, Plus, Trash } from "lucide-react";
import { useState } from "react";

interface AddressManagementProps {
  customer: Customer;
  onAddAddress: (data: Address) => void;
  onUpdateAddress: (data: Address) => void;
  onDeleteAddress: (addressId: string) => void;
  onSetDefault: (addressId: string) => void;
}

const AddressOptions = ({
  onDefault,
  onDelete,
  onUpdate,
}: {
  onDelete: () => void;
  onUpdate: () => void;
  onDefault: () => void;
}) => {
  return (
    <DropdownMenu>
      <Button variant="ghost" size="sm" className="gap-2" asChild>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDefault}>Default</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onUpdate}>Update</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} variant="destructive">
          <Trash className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function AddressManagement({
  customer,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
}: AddressManagementProps) {
  const [address, setAddress] = useState<Address | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const formatAddress = (address: Address) => {
    return `${address.address1}${address.address2 ? `, ${address.address2}` : ""}, ${address.city}, ${address.stateCode} ${address.postalCode}`;
  };

  const handleCallback = (newAddress: Address) => {
    setIsAddingNew(false);
    setAddress(null);
    if (address?.addressId) {
      onUpdateAddress(newAddress);
    } else {
      onAddAddress(newAddress);
    }
  };

  const hanldeUpdate = async (address: Address) => {
    setAddress(address);
    setIsAddingNew(true);
  };

  const handleOpenChange = (open) => {
    if (open) {
      setIsAddingNew(true);
    } else {
      setIsAddingNew(false);
      setAddress(null);
    }
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
              <AddressOptions
                onDefault={() => onSetDefault(address.addressId)}
                onDelete={() => onDeleteAddress(address.addressId)}
                onUpdate={() => hanldeUpdate(address)}
              />
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
      <Dialog open={isAddingNew} onOpenChange={handleOpenChange}>
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
            defaultValues={{ ...address }}
            onSubmit={(data) => {
              const formatData: Address = {
                ...data.address,
                preferred: data.setAsDefault,
                ...(address && { addressId: address.addressId }),
              };

              handleCallback(formatData);
            }}
            onBack={() => setIsAddingNew(false)}
            submitButtonText="Save Address"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
