import { Address } from "@/integrations/salesforce/types/api";

export const formatCurrency = (amount?: number, currency = "USD") => {
  if (!amount) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatAddress = (address?: Address) => {
  if (!address) return "No address";
  const parts = [
    address.address1,
    address.city && address.stateCode
      ? `${address.city}, ${address.stateCode}`
      : address.city || address.stateCode,
    address.postalCode,
  ].filter(Boolean);
  return parts.join(", ");
};
