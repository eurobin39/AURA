import { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-2 py-1 text-sm font-medium bg-sky-600 text-white rounded-full">
      {children}
    </span>
  );
}
