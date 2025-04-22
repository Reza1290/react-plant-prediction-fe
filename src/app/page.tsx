import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginButton from "@/components/buttons/LoginButton";
import LogoutButton from "@/components/buttons/LogoutButton";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/protected");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-8 lg:p-24">
      <h1 className="text-3xl font-bold text-center mb-8 lg:mb-0">
        Image Prediction for Herbal Herbs
      </h1>
      <div className="z-10 w-full max-w-5xl items-center justify-end font-mono text-sm lg:flex">
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:bg-none">
          {session ? <LogoutButton /> : <LoginButton auth={session} />}
        </div>
      </div>
    </main>
  );
}
