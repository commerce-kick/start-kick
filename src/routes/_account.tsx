import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { Heart, MapPin, Menu, ShoppingBag, User } from "lucide-react";

export const Route = createFileRoute("/_account")({
  component: RouteComponent,
});

function RouteComponent() {
  const matches = useMatches();
  const currentPath = matches[matches.length - 1]?.pathname || "";

  const navItems = [
    { path: "/account", label: "Account Info", icon: User },
    { path: "/wishlist", label: "Wishlist", icon: Heart },
    { path: "/order-history", label: "Order History", icon: ShoppingBag },
    { path: "/address", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="container py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">My Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Mobile Navigation */}
        <div className="block md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  Account Navigation
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Account Menu</SheetTitle>
              </SheetHeader>
              <div className="grid gap-2 px-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;
                  return (
                    <Button
                      key={item.path}
                      variant={isActive ? "secondary" : "ghost"}
                      asChild
                      className="justify-start"
                    >
                      <Link to={item.path}>
                        <Icon className="mr-2 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Sidebar Navigation */}
        <aside className="hidden w-64 shrink-0 md:block">
          <Card className="">
            <CardHeader className="pb-3">
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1 p-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "secondary" : "ghost"}
                    asChild
                    className="h-12 justify-start rounded-none"
                  >
                    <Link to={item.path}>
                      <Icon className="mr-2 h-5 w-5" />
                      {item.label}
                    </Link>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
