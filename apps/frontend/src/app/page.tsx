import { redirect } from "next/navigation";

export default function Home() {
  redirect("/waitlist");
  return null; // Ensure nothing renders
}