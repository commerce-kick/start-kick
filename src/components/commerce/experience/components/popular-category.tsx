import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Component } from "@/integrations/salesforce/types/page";
import { Link } from "@tanstack/react-router";

interface PopularCategoryProps {
  component: Component;
}

export function PopularCategory({ component }: PopularCategoryProps) {
  const { data } = component as any;
  const { category, catDisplayName } = data || {};

  if (!category) {
    return null;
  }

  // Format category name for display
  const displayName =
    catDisplayName ||
    category
      ?.replace(/-/g, " ")
      .replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <Button
          asChild
          variant="ghost"
          className="h-auto w-full justify-start p-0"
        >
          <Link
            to="/category/$categoryId"
            params={{ categoryId: category }}
            className="text-left"
          >
            <span className="font-medium">{displayName}</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
