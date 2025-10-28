import { Component } from "@/integrations/salesforce/types/page";

interface EditorialRichTextProps {
  component: Component;
}

export function EditorialRichText({ component }: EditorialRichTextProps) {
  const { data } = component as any;
  const { richText } = data || {};

  if (!richText) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: richText }}
      />
    </div>
  );
}
