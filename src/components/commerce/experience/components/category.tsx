import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";
import { Link } from "@tanstack/react-router";

interface CategoryProps {
  component: Component;
}

export function Category({ component }: CategoryProps) {
  const { data } = component as any;
  const {
    textHeadline,
    image,
    category1,
    category2,
    category3,
    category4,
    category5,
    customCategoryName1,
    customCategoryName2,
  } = data || {};

  const categories = [
    { id: category1, name: customCategoryName1 || "Category 1" },
    { id: category2, name: customCategoryName2 || "Category 2" },
    { id: category3, name: "Category 3" },
    { id: category4, name: "Category 4" },
    { id: category5, name: "Category 5" },
  ].filter((cat) => cat.id);

  return (
    <div className="container mx-auto px-4 py-6">
      {textHeadline && (
        <div
          className="mb-6 text-center"
          dangerouslySetInnerHTML={{ __html: textHeadline }}
        />
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((category, index) => (
          <Card key={index} className="overflow-hidden">
            {image?.url && (
              <div className="relative aspect-square">
                <Image
                  layout="fullWidth"
                  src={image.url || "/placeholder.svg"}
                  alt={category.name}
                  className="object-cover"
                />
              </div>
            )}
            <CardContent className="p-4 text-center">
              <h3 className="mb-2 font-semibold">{category.name}</h3>
              <Button asChild variant="outline" size="sm">
                <Link
                  to="/category/$categoryId"
                  params={{ categoryId: category.id }}
                >
                  Shop Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
