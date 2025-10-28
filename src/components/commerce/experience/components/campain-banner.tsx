import { Card } from "@/components/ui/card";
import { Component } from "@/integrations/salesforce/types/page";

interface CampaignBannerProps {
  component: Component;
}

export function CampaignBanner({ component }: CampaignBannerProps) {
  const { data } = component as any;
  const { bannerMessage } = data || {};

  if (!bannerMessage) {
    return null;
  }

  return (
    <Card className="bg-primary text-primary-foreground p-4 text-center">
      <div
        className="font-medium"
        dangerouslySetInnerHTML={{ __html: bannerMessage }}
      />
    </Card>
  );
}
