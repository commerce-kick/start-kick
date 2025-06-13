import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import * as React from "react";

import BasketSheet from "@/components/commerce/basket-sheet";
import SearchBox from "@/components/commerce/search-box";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSalesforceAuth } from "@/hooks/use-salesforce-auth";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Link } from "@tanstack/react-router";
import {
  ShopperCustomersTypes,
  ShopperProductsTypes,
} from "commerce-sdk-isomorphic";
import { ChevronDown, Home, LogOut, Menu, User } from "lucide-react";

interface CommerceNavigationProps {
  categories: ShopperProductsTypes.Category[];
}

export function CommerceNavigation({ categories }: CommerceNavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {categories.map((category) => {
          // Check if category has subcategories
          const hasSubCategories =
            category.categories && category.categories.length > 0;

          if (!hasSubCategories) {
            // Simple category without subcategories
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <Link
                    to="/category/$categoryId"
                    params={{ categoryId: category.id }}
                  >
                    {category.name || "Unnamed Category"}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }

          // Check if this is a complex category (has nested subcategories)
          const isComplexCategory = category.categories?.some(
            (subCat) => subCat.categories && subCat.categories.length > 0,
          );

          if (isComplexCategory) {
            // Complex navigation with nested structure
            return (
              <NavigationMenuItem key={category.id}>
                <NavigationMenuTrigger>
                  {category.name || "Unnamed Category"}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[700px] lg:w-[800px] lg:grid-cols-3">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/category/$categoryId"
                          params={{ categoryId: category.id }}
                          className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium">
                            {category.name} Collection
                          </div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            {category.description ||
                              `Discover our latest ${category.name?.toLowerCase()} styles and accessories.`}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    {category.categories?.map((subCategory) => (
                      <div key={subCategory.id} className="space-y-2">
                        <h4 className="text-sm leading-none font-medium">
                          {subCategory.name || "Unnamed Subcategory"}
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {subCategory.categories?.map((nestedSubCategory) => (
                            <li key={nestedSubCategory.id}>
                              <Link
                                to="/category/$categoryId"
                                params={{ categoryId: nestedSubCategory.id }}
                                className="text-muted-foreground hover:text-primary hover:underline"
                              >
                                {nestedSubCategory.name || "Unnamed Item"}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          }

          // Simple category with subcategories (2-level)
          return (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger>
                {category.name || "Unnamed Category"}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {category.categories?.map((subCategory) => (
                    <ListItem
                      key={subCategory.id}
                      title={subCategory.name || "Unnamed Subcategory"}
                      to="/category/$categoryId"
                      //@ts-ignore
                      params={{ categoryId: subCategory.id }}
                    >
                      {subCategory.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title?: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium">{title}</div>
          {children && (
            <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
              {children as React.ReactNode}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

const DropDownUser = ({
  user,
  handleLogOut,
}: {
  user: ShopperCustomersTypes.Customer;
  handleLogOut: () => void;
}) => {
  const initials =
    `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`.toUpperCase();

  return (
    <DropdownMenu>
      <Button variant="ghost" size="sm" className="gap-2" asChild>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden capitalize sm:inline">{user.firstName}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium capitalize">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {/* Add user email here if available */}
              My Account
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account" className="flex cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />{" "}
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Updated MobileNav component for mobile navigation
const MobileNav = ({
  categories,
}: {
  categories: ShopperProductsTypes.Category[];
}) => {
  const [open, setOpen] = React.useState(false);

  // Recursive component for nested categories
  const CategoryItem = ({
    category,
    level = 0,
  }: {
    category: ShopperProductsTypes.Category;
    level?: number;
  }) => (
    <div key={category.id}>
      <Link
        to={"/category/$categoryId"}
        params={{ categoryId: category.id }}
        className={`flex items-center py-2 text-base font-medium ${
          level > 0 ? "text-muted-foreground pl-6 text-sm" : ""
        }`}
        onClick={() => setOpen(false)}
      >
        {category.name || "Unnamed Category"}
      </Link>
      {/* Render subcategories if they exist */}
      {category.categories && category.categories.length > 0 && (
        <div className="ml-4">
          {category.categories.map((subCategory) => (
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 sm:w-[350px]">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="px-6 py-4">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="flex items-center py-2 text-base font-medium"
              onClick={() => setOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Complete Header component with updated typing
export function Header({
  categories,
  user,
}: {
  categories: ShopperProductsTypes.Category[];
  user?: ShopperCustomersTypes.Customer;
}) {
  const { logoutMutation } = useSalesforceAuth();

  const handleLogOut = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />

          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary h-6 w-6"
            >
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
              <path d="M12 3v6" />
            </svg>
            <span>Acme</span>
          </Link>
          <CommerceNavigation categories={categories} />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <SearchBox />

          <BasketSheet />
          {!user?.authType ? (
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link to="/login">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            </Button>
          ) : (
            <DropDownUser user={user} handleLogOut={handleLogOut} />
          )}
        </div>
      </div>
    </header>
  );
}
