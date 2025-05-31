import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { getCustomerQueryOptions } from "@/integrations/salesforce/options/customer";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, Phone, Settings, User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for Customer validation
const customerSchema = z.object({
  customerId: z.string().optional(),
  customerNo: z.string().optional(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  secondName: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  login: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
  enabled: z.boolean().default(true),
  companyName: z.string().optional(),
  jobTitle: z.string().optional(),
  phoneHome: z.string().optional(),
  phoneMobile: z
    .string()
    .regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  phoneBusiness: z.string().optional(),
  fax: z.string().optional(),
  preferredLocale: z.string().optional(),
  authType: z.enum(["oauth", "password", "sso"]).optional(),
  gender: z.enum(["0", "1", "2"]).optional(),
  salutation: z.enum(["Mr.", "Mrs.", "Ms.", "Dr."]).optional(),
  title: z.string().optional(),
  suffix: z.string().optional(),
  birthday: z.date().optional(),
  note: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export const Route = createFileRoute("/_account/account")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const { queryClient } = context;

    queryClient.ensureQueryData(getCustomerQueryOptions());
  },
});

function RouteComponent() {
  const { data: customer } = useSuspenseQuery(getCustomerQueryOptions());

  const form = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerId: customer?.Id || "",
      customerNo: customer?.CustomerNo || "",
      firstName: customer?.FirstName || "",
      lastName: customer?.LastName || "",
      secondName: customer?.SecondName || "",
      password: "", // Password should not be pre-filled for security reasons
      email: customer?.Email || "",
      login: customer?.Login || "",
      enabled: customer?.Enabled ?? true,
      companyName: customer?.CompanyName || "",
      jobTitle: customer?.JobTitle || "",
      phoneHome: customer?.PhoneHome || "",
      phoneMobile: customer?.PhoneMobile || "",
      phoneBusiness: customer?.PhoneBusiness || "",
      fax: customer?.Fax || "",
      preferredLocale: customer?.PreferredLocale || "en-US",
      authType: customer?.AuthType,
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    console.log("Form submitted:", data);
  };

  const isEnabled = form.watch("enabled");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <User2 className="text-primary h-5 w-5" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="text-muted-foreground">
            Manage your shipping addresses
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          id="customer-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User2 className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Birthday</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>How we can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Account status and authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Additional information about this customer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes about this customer..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Maximum 500 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
