import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/ui/image";
import { Component } from "@/integrations/salesforce/types/page";

interface ImageAndTextProps {
  component: Component;
}

export function ImageAndText({ component }: ImageAndTextProps) {
  const { data } = component;
  const { image, heading, ITCText, ITCLink } = data || {};

  return (
    <Card className="overflow-hidden">
      {image?.url && (
        <div className="relative aspect-square">
          <Image
            layout="fullWidth"
            src={image.url || "/placeholder.svg"}
            alt=""
            className="object-cover"
          />
        </div>
      )}
      <CardContent className="p-4">
        {heading && (
          <div className="mb-2" dangerouslySetInnerHTML={{ __html: heading }} />
        )}
        {ITCText && (
          <div
            className="text-muted-foreground mb-3 text-sm"
            dangerouslySetInnerHTML={{ __html: ITCText }}
          />
        )}
        {ITCLink && (
          <Button asChild variant="outline" size="sm">
            <a href={ITCLink}>Learn More</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
