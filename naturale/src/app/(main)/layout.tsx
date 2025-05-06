import MainLayout from "@/components/layouts/MainLayout";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
} 