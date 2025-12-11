// app/routes/index.tsx
import { Chat } from "@/components/chat";
import ProductCard from "@/components/commerce/product-card";
import HoverBox from "@/components/magic/hover-box";
import { InteractiveGridPattern } from "@/components/magic/interactive-pattern";
import { TextAnimate } from "@/components/magic/text-animate";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProductsQueryOptions } from "@/integrations/salesforce/options/products";
import { cn } from "@/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain,
  Code,
  ExternalLink,
  FileArchive,
  Heart,
  HelpCircle,
  LayoutGrid,
  Lock,
  ShoppingCart,
  User,
} from "lucide-react";

function FeatureCard({ icon, title, description }: any) {
  return (
    <HoverBox>
      <Card className="flex flex-col p-6">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="mb-2 text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </Card>
    </HoverBox>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context, params }) => {
    const { queryClient } = context;

    await queryClient.ensureQueryData(
      getProductsQueryOptions({
        refine: ["cgid=root"],
        limit: 10,
      }),
    );
  },
});

function Home() {
  
  const { data: products } = useSuspenseQuery(
    getProductsQueryOptions({
      refine: ["cgid=root"],
      limit: 10,
    }),
  );

  return (
    <div className="flex min-h-screen flex-col">
      <section className="container mx-auto grid items-center gap-8 pt-6 pb-8 md:py-10 lg:grid-cols-2">
        <div className="absolute inset-0 flex w-full items-start justify-center">
          <InteractiveGridPattern
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_top_center,white,transparent)]",
              "relative h-auto w-auto",
            )}
            width={50}
            height={50}
            squares={[20, 10]}
            squaresClassName="hover:fill-blue-500"
          />
        </div>
        <div className="relative z-10 flex flex-col items-start gap-4">
          <TextAnimate
            animation="fadeIn"
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            The Start Starter Store for Retail
          </TextAnimate>
          <p className="text-muted-foreground text-lg">
            A modern, high-performance e-commerce starter kit built with
            TanStack Start and shadcn/ui
          </p>
          <Button size="lg" className="mt-4">
            Get started
          </Button>
        </div>
        <div className="flex justify-center">
          <div className="bg-secondary/5 border-border pointer-events-none relative flex aspect-video w-full items-center justify-center rounded-lg border shadow-sm backdrop-blur-sm">
            Build with <Heart className="text-destructive mx-2" /> and TanStack
            Start
          </div>
        </div>
      </section>

      <section className="relative z-10 container mx-auto py-8 md:py-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col items-center p-6 text-center transition-all hover:-translate-y-2.5">
            <div className="bg-primary/10 mb-4 rounded-full p-3">
              <Code className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-medium">Download on GitHub</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Get the source code and start building your store
            </p>
            <Button variant="outline" className="mt-auto">
              <Code className="mr-2 h-4 w-4" /> Clone Repository
            </Button>
          </Card>

          <Card className="flex flex-col items-center p-6 text-center transition-all hover:-translate-y-2.5">
            <div className="bg-primary/10 mb-4 rounded-full p-3">
              <ExternalLink className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-medium">
              Deploy on Managed Runtime
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Deploy your store with one click to a managed platform
            </p>
            <Button variant="outline" className="mt-auto">
              <ExternalLink className="mr-2 h-4 w-4" /> Deploy Now
            </Button>
          </Card>

          <Card className="flex flex-col items-center p-6 text-center transition-all hover:-translate-y-2.5">
            <div className="bg-primary/10 mb-4 rounded-full p-3">
              <FileArchive className="text-primary h-6 w-6" />
            </div>
            <h3 className="mb-2 text-xl font-medium">Documentation</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Design your store with our documentation
            </p>
            <Button variant="outline" className="mt-auto" asChild>
              <a href="https://inertia-docs.vercel.app/docs">
                <FileArchive className="mr-2 h-4 w-4" /> Go to documentation
              </a>
            </Button>
          </Card>
        </div>
      </section>

      {/* Shop Products */}
      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto">
          <h2 className="mb-8 text-center text-3xl font-bold tracking-tight">
            Shop Products
          </h2>
          <p className="text-muted-foreground mb-10 text-center">
            This section contains content from the catalog.{" "}
            <Link to="/" className="text-primary underline">
              Read docs
            </Link>{" "}
            on how to replace it.
          </p>

          <Carousel className="mx-auto">
            <CarouselContent>
              {products.hits?.map((product, index) => (
                <CarouselItem
                  key={`product-${index}`}
                  className="p-4 md:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>
      </section>

      <section className="container mx-auto py-12 md:py-16">
        <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
          Features
        </h2>
        <p className="text-muted-foreground mb-12 text-center">
          Out-of-the-box features so that you focus only on adding enhancements.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<ShoppingCart className="h-8 w-8" />}
            title="Cart & Checkout"
            description="Ecommerce best practice for a shopper's cart and checkout experience."
          />

          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Einstein Recommendations"
            description="Deliver the next best product or offer to every shopper through product recommendations."
          />

          <FeatureCard
            icon={<User className="h-8 w-8" />}
            title="My Account"
            description="Shoppers can manage account information such as their profile, addresses, payments and orders."
          />

          <FeatureCard
            icon={<Lock className="h-8 w-8" />}
            title="Shopper Login"
            description="Enable shoppers to easily log in with a more personalized shopping experience."
          />

          <FeatureCard
            icon={<LayoutGrid className="h-8 w-8" />}
            title="Components & Design Kit"
            description="Built using shadcn/ui, a simple, modular and accessible React component library."
          />

          <FeatureCard
            icon={<Heart className="h-8 w-8" />}
            title="Wishlist"
            description="Registered shoppers can add product items to their wishlist from purchasing later."
          />
        </div>
      </section>

      <section className="bg-muted/50 py-12 md:py-16">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            We're here to help
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-md">
            Contact our support staff. They will get you to the right place.
          </p>
          <Button>
            <HelpCircle className="mr-2 h-4 w-4" />
            Contact Us
          </Button>
        </div>
      </section>

      <Chat />
    </div>
  );
}
