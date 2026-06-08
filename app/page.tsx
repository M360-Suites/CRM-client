import { redirect } from "next/navigation";
import Image from "next/image";

export default function Home() {
  // Server-side redirect to the login page
  redirect("/login");
  return null;
}
