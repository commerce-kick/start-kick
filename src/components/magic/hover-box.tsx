import { ReactNode } from "react";

export default function HoverBox({ children }: { children: ReactNode }) {
  return (
    <div className="hover:-translate-y-2.5 transition-all">{children}</div>
  );
}
