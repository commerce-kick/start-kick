import { createFileRoute } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";

import { CustomerInfo } from "@/components/commerce/checkout/customer-info";
import { OrderSummary } from "@/components/commerce/checkout/order-summary";
import { Payment } from "@/components/commerce/checkout/payment";
import { Review } from "@/components/commerce/checkout/review";
import { ShippingAddress } from "@/components/commerce/checkout/shipping-address";
import { ShippingOptions } from "@/components/commerce/checkout/shipping-options";
import {
  getBasketQueryOptions,
  useAddPaymentInstrumentToBasketMutation,
  useDeleteBasketMutation,
  useUpdateCustomerForBasketMutation,
  useUpdateShippingAddressForShipmentMutation,
  useUpdateShippingMethodForShipmentMutation,
} from "@/integrations/salesforce/options/basket";
import { getCustomerQueryOptions } from "@/integrations/salesforce/options/customer";
import { useCreateOrderMutation } from "@/integrations/salesforce/options/orders";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/checkout")({
  component: RouteComponent,
  loader: ({ context }) => {
    const { queryClient } = context;
    queryClient.ensureQueryData(getBasketQueryOptions());
  },
});

function RouteComponent() {
  const [activeStep, setActiveStep] = useState(0);

  const { data: basket } = useQuery(getBasketQueryOptions());
  const { data: customer } = useQuery(getCustomerQueryOptions());

  const deleteBasketMutation = useDeleteBasketMutation();
  const updateCustomerForBasketMutation = useUpdateCustomerForBasketMutation();
  const updateShippingAddressForShipmentMutation =
    useUpdateShippingAddressForShipmentMutation();
  const updateShippingMethodForShipmentMutation =
    useUpdateShippingMethodForShipmentMutation();
  const addPaymentInstrumentToBasketMutation =
    useAddPaymentInstrumentToBasketMutation();
  const createOrderMutation = useCreateOrderMutation();

  const steps = [
    { id: 0, name: "Contact Info" },
    { id: 1, name: "Shipping Address" },
    { id: 2, name: "Shipping Options" },
    { id: 3, name: "Payment" },
    { id: 4, name: "Review" },
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleDestroy = async () => {
    if (!basket?.basketId) return;
    await deleteBasketMutation.mutateAsync({
      basketId: basket.basketId,
    });
  };

  const handleCustomerInfo = async (data: any) => {
    if (!basket?.basketId || !data.email) return;

    await updateCustomerForBasketMutation.mutateAsync({
      email: data.email,
      basketId: basket.basketId,
    });
    handleNext();
  };

  const handleShippingAddress = async (data: any) => {
    if (!basket?.basketId) return;

    await updateShippingAddressForShipmentMutation.mutateAsync({
      params: {
        basketId: basket.basketId,
        shipmentId: "me",
        useAsBilling: data.useSameAsBilling,
      },
      body: {
        address1: data.shippingAddress.address1,
        address2: data.shippingAddress.address2,
        city: data.shippingAddress.city,
        countryCode: data.shippingAddress.country,
        firstName: data.shippingAddress.firstName,
        lastName: data.shippingAddress.lastName,
        phone: data.shippingAddress.phone,
        postalCode: data.shippingAddress.postalCode,
        stateCode: data.shippingAddress.state,
      },
    });
    handleNext();
  };

  const handleShippingMethod = async (data: any) => {
    if (!basket?.basketId) return;

    await updateShippingMethodForShipmentMutation.mutateAsync({
      params: {
        basketId: basket.basketId,
        shipmentId: "me",
      },
      body: {
        id: data.shippingMethod,
      },
    });
    handleNext();
  };

  const handlePayment = async (data: any) => {
    if (!basket?.basketId) return;


    console.log(data)

    await addPaymentInstrumentToBasketMutation.mutateAsync({
      params: {
        basketId: basket.basketId,
      },
      body: {
        paymentMethodId: "CREDIT_CARD",
        paymentCard: {
          holder: data.nameOnCard,
          maskedNumber: data.cardNumber,
          cardType: "Visa",
          expirationMonth: Number.parseInt(data.expiryMonth),
          expirationYear: Number.parseInt(data.expiryYear),
        },
      },
    });
    handleNext();
  };

  const handlePlaceOrder = async () => {
    if (!basket?.basketId) return;

    await createOrderMutation.mutateAsync({
      body: { basketId: basket.basketId },
    });
  };

  // Get email from basket or customer
  const email = basket?.customerInfo?.email || customer?.email || "";

  // Get shipping address from basket if available
  const shippingAddress = basket?.shipments?.[0]?.shippingAddress;

  // Get billing address from basket if available
  const billingAddress = basket?.billingAddress;

  // Check if shipping and billing addresses are the same
  const hasSameAddress =
    shippingAddress &&
    billingAddress &&
    shippingAddress.address1 === billingAddress.address1 &&
    shippingAddress.city === billingAddress.city &&
    shippingAddress.postalCode === billingAddress.postalCode;

  return (
    <div className="container py-12">
      <div className="flex-1 items-start md:grid md:grid-cols-[minmax(0,1fr)_320px] md:gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
            <p className="text-muted-foreground mt-2">
              Complete your purchase by following these steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-6 flex items-center space-x-2 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    index === activeStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : index < activeStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-muted text-muted-foreground"
                  }`}
                >
                  {index < activeStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <span className="ml-2 hidden text-sm font-medium whitespace-nowrap sm:inline">
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <ChevronRight className="text-muted-foreground mx-1 h-4 w-4 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {activeStep === 0 && (
            <CustomerInfo
              customer={customer}
              defaultValues={{ email }}
              onNext={handleCustomerInfo}
              onBack={handleDestroy}
            />
          )}

          {activeStep === 1 && (
            <ShippingAddress
              defaultValues={{
                firstName:
                  shippingAddress?.firstName || customer?.firstName || "",
                lastName: shippingAddress?.lastName || customer?.lastName || "",
                phone: shippingAddress?.phone || customer?.phone || "",
                address1: shippingAddress?.address1 || "",
                address2: shippingAddress?.address2 || "",
                city: shippingAddress?.city || "",
                state: shippingAddress?.stateCode || "",
                postalCode: shippingAddress?.postalCode || "",
                country: shippingAddress?.countryCode || "US",
              }}
              billingValues={
                billingAddress
                  ? {
                      firstName: billingAddress.firstName || "",
                      lastName: billingAddress.lastName || "",
                      phone: billingAddress.phone || "",
                      address1: billingAddress.address1 || "",
                      address2: billingAddress.address2 || "",
                      city: billingAddress.city || "",
                      state: billingAddress.stateCode || "",
                      postalCode: billingAddress.postalCode || "",
                      country: billingAddress.countryCode || "US",
                    }
                  : undefined
              }
              useSameAsBilling={hasSameAddress !== false}
              onNext={handleShippingAddress}
              onBack={handlePrevious}
            />
          )}

          {activeStep === 2 && (
            <ShippingOptions
              basketId={basket?.basketId}
              selectedMethod={basket?.shipments?.[0]?.shippingMethod?.id}
              onNext={handleShippingMethod}
              onBack={handlePrevious}
            />
          )}

          {activeStep === 3 && (
            <Payment
              defaultValues={
                basket?.paymentInstruments?.[0]?.paymentCard
                  ? {
                      nameOnCard:
                        basket.paymentInstruments[0].paymentCard.holder || "",
                      cardNumber:
                        basket.paymentInstruments[0].paymentCard.maskedNumber ||
                        "",
                      expiryMonth:
                        basket.paymentInstruments[0].paymentCard.expirationMonth?.toString() ||
                        "",
                      expiryYear:
                        basket.paymentInstruments[0].paymentCard.expirationYear?.toString() ||
                        "",
                      cvv: "",
                    }
                  : undefined
              }
              onNext={handlePayment}
              onBack={handlePrevious}
            />
          )}

          {activeStep === 4 && (
            <Review
              basket={basket}
              customer={customer}
              onBack={handlePrevious}
              onPlaceOrder={handlePlaceOrder}
            />
          )}
        </main>

        <aside className="mt-8 md:sticky md:top-16 md:mt-0 md:h-[calc(100vh-4rem)] md:overflow-y-auto">
          <OrderSummary basket={basket} />
        </aside>
      </div>
    </div>
  );
}
