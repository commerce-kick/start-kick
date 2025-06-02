import { AddressSelector } from "@/components/commerce/address-selector";
import { AddressForm } from "@/components/commerce/adress-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useCreateCustumerAddressMutation } from "@/integrations/salesforce/options/customer";
import { Address, Customer } from "@/integrations/salesforce/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const shippingFormSchema = z.object({
  useSameAsBilling: z.boolean(),
});

interface ShippingAddressWithSelectorProps {
  customer?: Customer | null;
  onNext: (data: {
    shippingAddress: Address;
    useSameAsBilling: boolean;
    billingAddress?: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => void;
  onBack: () => void;
}

export function ShippingAddressWithSelector({
  customer,
  onNext,
  onBack,
}: ShippingAddressWithSelectorProps) {
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address | null>(null);

  const [saveOptions, setSaveOptions] = useState<{
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }>({});

  const createCustomerAddressMutation = useCreateCustumerAddressMutation();

  const form = useForm({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      useSameAsBilling: true,
    },
  });

  const handleShippingAddressSubmit = async (data: {
    address: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => {
    if (data.saveAddress) {
      await createCustomerAddressMutation.mutateAsync({
        body: {
          ...data.address,
          preferred: data.setAsDefault,
        },
      });
    }

    setSelectedShippingAddress(data.address);

    setSaveOptions({
      saveAddress: data.saveAddress,
      setAsDefault: data.setAsDefault,
    });
  };

  const handleFinalSubmit = (data: z.infer<typeof shippingFormSchema>) => {
    if (!selectedShippingAddress) return;

    onNext({
      shippingAddress: selectedShippingAddress,
      useSameAsBilling: data.useSameAsBilling,
      ...saveOptions,
    });
  };

  const handleFinalBilling = (data: {
    address: Address;
    saveAddress?: boolean;
    setAsDefault?: boolean;
  }) => {
    if (!selectedShippingAddress) return;

    onNext({
      shippingAddress: selectedShippingAddress,
      billingAddress: data.address,
      useSameAsBilling: false,
      ...saveOptions,
    });
  };

  if (!selectedShippingAddress) {
    return (
      <AddressSelector
        customer={customer}
        title="Shipping Address"
        description="Select or enter your shipping address"
        onSubmit={handleShippingAddressSubmit}
        onBack={onBack}
        submitButtonText="Continue"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)}>
        <div className="space-y-6">
          {/* Selected Shipping Address Display */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>Your selected shipping address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border p-4">
                <div className="font-medium">
                  {selectedShippingAddress.firstName}{" "}
                  {selectedShippingAddress.lastName}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  {selectedShippingAddress.address1}
                  {selectedShippingAddress.address2 &&
                    `, ${selectedShippingAddress.address2}`}
                </div>
                <div className="text-muted-foreground text-sm">
                  {selectedShippingAddress.city},{" "}
                  {selectedShippingAddress.stateCode}{" "}
                  {selectedShippingAddress.postalCode}
                </div>
                <div className="text-muted-foreground text-sm">
                  {selectedShippingAddress.phone}
                </div>
              </div>

              <div className="py-3">
                <FormField
                  control={form.control}
                  name="useSameAsBilling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Use same as shipping address</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("useSameAsBilling") && (
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedShippingAddress(null)}
                    className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
                  >
                    Continue to Shipping Options
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Billing Address Options */}
      {!form.watch("useSameAsBilling") && (
        <div className="mt-4">
          <AddressForm
            customer={customer}
            title="Billing Address"
            description="Select or enter your billing address"
            showSaveOptions={false}
            onBack={() => setSelectedShippingAddress(null)}
            onSubmit={handleFinalBilling}
            submitButtonText="Continue to Shipping Options"
          />
        </div>
      )}
    </Form>
  );
}
