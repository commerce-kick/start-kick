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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const paymentSchema = z.object({
  nameOnCard: z.string().min(1, "Name on card is required"),
  cardNumber: z.string().min(1, "Card number is required"),
  expiryMonth: z.string().min(1, "Expiry month is required"),
  expiryYear: z.string().min(1, "Expiry year is required"),
  cvv: z
    .string()
    .min(3, "CVV must be at least 3 digits")
    .max(4, "CVV must be at most 4 digits"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentProps {
  defaultValues?: Partial<PaymentFormData>;
  onNext: (data: PaymentFormData) => void;
  onBack: () => void;
}

export function Payment({ defaultValues, onNext, onBack }: PaymentProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      nameOnCard: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      ...defaultValues,
    },
  });

  // Update form values when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      Object.entries(defaultValues).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof PaymentFormData, value);
        }
      });
    }
  }, [defaultValues, form]);

  const onSubmit = (data: PaymentFormData) => {
    // Transform the card number to masked format before submitting
    const transformedData = {
      ...data,
      cardNumber: maskCardNumber(data.cardNumber),
    };
    onNext(transformedData);
  };

  const maskCardNumber = (cardNumber: string) => {
    // Remove all spaces and non-digits
    const cleanNumber = cardNumber.replace(/\D/g, "");

    // If already masked or less than 4 digits, return as is
    if (cardNumber.includes("*") || cleanNumber.length < 4) {
      return cardNumber;
    }

    // Get last 4 digits
    const last4 = cleanNumber.slice(-4);

    // Create masked version with asterisks
    const maskedPortion = "*".repeat(Math.max(0, cleanNumber.length - 4));

    return maskedPortion + last4;
  };

  const formatCardNumberForDisplay = (value: string) => {
    // If already masked, don't format
    if (value.includes("*")) {
      return value;
    }

    // Remove all non-digits
    const v = value.replace(/\D/g, "");

    // Add spaces every 4 digits for display
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your payment details to complete your purchase
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full name as shown on card"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCardNumberForDisplay(
                          e.target.value,
                        );
                        field.onChange(formatted);
                      }}
                      disabled={field.value?.includes("*")}
                      className={field.value?.includes("*") ? "bg-muted" : ""}
                      maxLength={19}
                    />
                  </FormControl>
                  {field.value?.includes("*") && (
                    <p className="text-muted-foreground text-sm">
                      Using saved payment method
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (month) => (
                            <SelectItem
                              key={month}
                              value={month.toString().padStart(2, "0")}
                            >
                              {month.toString().padStart(2, "0")}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(
                          { length: 10 },
                          (_, i) => new Date().getFullYear() + i,
                        ).map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString().slice(-2)}
                          >
                            {year.toString().slice(-2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        maxLength={4}
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
            <Button type="submit">Review Order</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
