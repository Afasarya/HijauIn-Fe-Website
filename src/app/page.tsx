import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect ke dashboard sebagai default landing page
  redirect("/dashboard");
}
