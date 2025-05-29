import { Button } from "@/components/ui/button";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_account")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="border-grid fixed top-16 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
        <div className="grid grid-flow-row auto-rows-max gap-0.5 text-sm">
          <Button variant="ghost" asChild className="justify-start">
            <Link to="/account">Account Info</Link>
          </Button>

          <Button variant="ghost" asChild className="justify-start">
            <Link to="/wishlist">Wislist</Link>
          </Button>
        </div>
      </aside>
      <main className="py-12">
        <Outlet />
      </main>
    </div>
  );
}
