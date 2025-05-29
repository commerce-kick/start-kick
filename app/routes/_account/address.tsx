import { getCustomerQueryOptions } from "@/integrations/salesforce/options/customer";

import { useQuery } from "@tanstack/react-query";
import {
    Building,
    Edit,
    Mail,
    MapPin,
    Phone,
    Plus,
    Star,
    Trash2,
} from "lucide-react";
import { useState } from "react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import AddressForm from "@/components/commerce/account/address-form";
import { createFileRoute } from "@tanstack/react-router";
import { ShopperCustomersTypes } from "commerce-sdk-isomorphic";

export const Route = createFileRoute("/_account/address")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: customer, isLoading } = useQuery(getCustomerQueryOptions());
  const [selectedAddress, setSelectedAddress] =
    useState<ShopperCustomersTypes.CustomerAddress | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );

  const addresses = customer?.addresses || [];

  const handleAddAddress = async (
    addressData: Partial<ShopperCustomersTypes.CustomerAddress>,
  ) => {};

  const handleEditAddress = async (
    addressData: Partial<ShopperCustomersTypes.CustomerAddress>,
  ) => {};

  const handleDeleteAddress = async (addressId: string) => {};

  const handleSetPreferred = async (addressId: string) => {};

  const formatAddress = (address: ShopperCustomersTypes.CustomerAddress) => {
    const parts = [
      address.address1,
      address.address2,
      address.suite,
      address.city && address.stateCode
        ? `${address.city}, ${address.stateCode}`
        : address.city || address.stateCode,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(", ");
  };

  const getFullName = (address: ShopperCustomersTypes.CustomerAddress) => {
    if (address.fullName) return address.fullName;

    const nameParts = [
      address.title,
      address.firstName,
      address.secondName,
      address.lastName,
      address.suffix,
    ].filter(Boolean);

    return nameParts.join(" ");
  };

  if (isLoading) {
    return (
      <>
        <div className="mb-8 flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">My Addresses</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="bg-muted h-6 w-3/4 rounded" />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-2/3 rounded" />
                <div className="bg-muted h-8 w-24 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">My Addresses</h1>
            <p className="text-muted-foreground">
              Manage your shipping and billing addresses
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              onSubmit={handleAddAddress}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <MapPin className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
            <h2 className="mb-2 text-2xl font-semibold">No addresses found</h2>
            <p className="text-muted-foreground mb-6">
              Add your first address to make checkout faster and easier.
            </p>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Address</DialogTitle>
                </DialogHeader>
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.addressId} className="relative overflow-hidden">
              {address.preferred && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg bg-yellow-500 hover:bg-yellow-600">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    Preferred
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      {getFullName(address)}
                    </h3>
                    {address.companyName && (
                      <div className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Building className="h-3 w-3" />
                        {address.companyName}
                      </div>
                    )}
                    {address.jobTitle && (
                      <p className="text-muted-foreground text-sm">
                        {address.jobTitle}
                      </p>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                    <div className="text-sm">
                      <p>{formatAddress(address)}</p>
                      {address.countryCode && (
                        <p className="text-muted-foreground mt-1">
                          {address.countryCode.toUpperCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {address.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{address.phone}</span>
                    </div>
                  )}

                  {address.postBox && (
                    <div className="flex items-center gap-2">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">
                        P.O. Box {address.postBox}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedAddress(address);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>

                    {!address.preferred && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPreferred(address.addressId)}
                      >
                        <Star className="mr-1 h-3 w-3" />
                        Set Preferred
                      </Button>
                    )}
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAddress(address.addressId)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          {selectedAddress && (
            <AddressForm
              initialData={selectedAddress}
              onSubmit={handleEditAddress}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedAddress(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
