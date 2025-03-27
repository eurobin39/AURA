import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import Login from "./login"; 

export default async function LoginPage() {
  const session = await getSession();

  if (session?.id) {
    redirect("/home"); 
  }

  return <Login />; 
}