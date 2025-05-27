import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: RouteComponent,
});

function RouteComponent() {

  return <div>Hello "/checkout"!</div>;
}
