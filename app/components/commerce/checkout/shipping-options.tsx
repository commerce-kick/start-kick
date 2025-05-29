import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { getShippingMethodsForShipmentQueryOptions } from "@/integrations/salesforce/options/basket";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const shippingSchema = z.object({
  shippingMethod: z.string().min(1, "Please select a shipping method"),
  giftWrap: z.boolean().default(false),
  giftMessage: z.string().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

interface ShippingOptionsProps {
  basketId?: string;
  selectedMethod?: string;
  onNext: (data: ShippingFormData) => void;
  onBack: () => void;
}

export function ShippingOptions({
  basketId,
  selectedMethod,
  onNext,
  onBack,
}: ShippingOptionsProps) {
  const { data: shippingMethods, isLoading } = useQuery(
    getShippingMethodsForShipmentQueryOptions({ basketId: basketId! }),
  );

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      shippingMethod: selectedMethod || "",
      giftWrap: false,
      giftMessage: "",
    },
  });

  // Update selected method when it changes
  useEffect(() => {
    if (selectedMethod) {
      form.setValue("shippingMethod", selectedMethod);
    }
  }, [selectedMethod, form]);

  const onSubmit = (data: ShippingFormData) => {
    onNext(data);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">Loading shipping methods...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping & Gift Options</CardTitle>
        <CardDescription>
          Choose your shipping method and gift options
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="shippingMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Shipping Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {shippingMethods?.applicableShippingMethods?.map(
                        (method) => (
                          <div
                            key={method.id}
                            className="flex items-center space-x-2 rounded-md border p-3"
                          >
                            <RadioGroupItem
                              value={method.id!}
                              id={method.id!}
                            />
                            <FormLabel
                              htmlFor={method.id!}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">
                                    {method.name}
                                  </div>
                                  <div className="text-muted-foreground text-sm">
                                    {method.description}
                                  </div>
                                  {method.c_estimatedArrivalTime && (
                                    <div className="text-muted-foreground text-sm">
                                      Estimated arrival:{" "}
                                      {method.c_estimatedArrivalTime}
                                    </div>
                                  )}
                                </div>
                                <span className="font-medium">
                                  {method.price}
                                </span>
                              </div>
                            </FormLabel>
                          </div>
                        ),
                      )}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <FormLabel>Gift Options</FormLabel>
              <FormField
                control={form.control}
                name="giftWrap"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Add gift wrapping (+$4.99)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="giftMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gift message (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a personal message..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue to Payment</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
