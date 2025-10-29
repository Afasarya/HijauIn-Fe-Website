import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Login - HijauIn Admin Panel",
  description: "Login to HijauIn Admin Panel",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
