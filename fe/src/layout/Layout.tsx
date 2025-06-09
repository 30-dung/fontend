import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "../hooks/useScrollTop";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  ScrollToTop();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
