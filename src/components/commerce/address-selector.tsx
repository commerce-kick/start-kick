import { AddressForm } from "@/components/commerce/adress-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Address, Customer } from "@/integrations/salesforce/types/api";
import { MapPin, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddressSelectorProps {
  customer?: Customer | null;
  title?: string;
  description?: string;
  showSaveOptions?: boolean;
  onSubmit: (data: {
    address: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => void;
  onBack?: () => void;
  submitButtonText?: string;
}

export function AddressSelector({
  customer,
  title = "Shipping Address",
  description = "Select or enter your shipping address",
  showSaveOptions = true,
  onSubmit,
  onBack,
  submitButtonText = "Continue",
}: AddressSelectorProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<
    string | undefined
  >();

  const hasAddresses = customer?.addresses && customer.addresses.length > 0;

  useEffect(() => {
    if (!hasAddresses) {
      setIsCreatingNew(true);
    } else {
      setSelectedAddressId(
        customer.addresses?.find((a) => a.preferred === true)?.addressId,
      );
    }
  }, [hasAddresses, customer]);

  const handleAddressFormSubmit = (data: {
    address: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => {
    onSubmit(data);
  };

  const handleExistingAddressSubmit = () => {
    if (!selectedAddressId || !customer?.addresses) return;

    const existingAddress = customer.addresses.find(
      (addr) => addr.addressId === selectedAddressId,
    );

    if (!existingAddress) return;

    onSubmit({
      address: existingAddress,
      saveAddress: false,
      setAsDefault: false,
    });
  };

  const formatAddress = (address: Address) => {
    return `${address.address1}${address.address2 ? `, ${address.address2}` : ""}, ${address.city}, ${address.stateCode} ${address.postalCode}`;
  };

  // If creating new address or no existing addresses, show the form
  if (isCreatingNew || !hasAddresses) {
    return (
      <AddressForm
        customer={customer}
        title={title}
        description={description}
        showSaveOptions={showSaveOptions}
        onSubmit={handleAddressFormSubmit}
        onBack={hasAddresses ? () => setIsCreatingNew(false) : onBack}
        submitButtonText={submitButtonText}
      />
    );
  }

  // Show address selector for existing addresses
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label className="text-base font-medium">Choose Address</Label>
          <RadioGroup
            value={selectedAddressId}
            onValueChange={(value) => {
              if (value === "new") {
                setIsCreatingNew(true);
                setSelectedAddressId(undefined);
              } else {
                setSelectedAddressId(value);
              }
            }}
            className="space-y-3"
          >
            {customer.addresses?.map((address) => (
              <div
                key={address.addressId}
                className="flex items-start space-x-3"
              >
                <RadioGroupItem
                  value={address.addressId}
                  id={address.addressId}
                  className="mt-1"
                />
                <Label
                  htmlFor={address.addressId}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <MapPin className="text-muted-foreground h-4 w-4" />
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
                </Label>
              </div>
            ))}

            {/* Add New Address Option */}
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="new" id="new" className="mt-1" />
              <Label htmlFor="new" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Plus className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Add new address</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          {onBack && (
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            onClick={handleExistingAddressSubmit}
            disabled={!selectedAddressId}
            className={onBack ? "" : "ml-auto"}
          >
            {submitButtonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
