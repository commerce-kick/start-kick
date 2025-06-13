import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AuthTypes } from "@/integrations/salesforce/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const customerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface CustomerInfoProps {
  defaultValues?: Partial<CustomerFormData>;
  customer?: ShopperCustomersTypes.Customer;
  onNext: (data: CustomerFormData) => Promise<void>;
  onBack: () => Promise<void>;
}

export function CustomerInfo({
  defaultValues,
  customer,
  onNext,
  onBack,
}: CustomerInfoProps) {
  const isRegistered = customer?.authType === AuthTypes.REGISTERED;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      email: defaultValues?.email || "",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      await onNext(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>
          {isRegistered
            ? "Welcome back! Continue with your email address."
            : "Please provide your email to continue checkout."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      {...field}
                      disabled={isRegistered}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isRegistered && (
              <div className="text-muted-foreground text-sm">
                You're signed in as {customer?.firstName} {customer?.lastName}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Back to Cart
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isRegistered ? "Continue to Shipping" : "Continue as Guest"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
