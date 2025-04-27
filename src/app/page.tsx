import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import LoginButton from "@/components/buttons/LoginButton";
import LogoutButton from "@/components/buttons/LogoutButton";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24 max-w-lg mx-auto gap-5">
      <h1 className="text-green-700/80 text-3xl font-bold text-start mb-8 lg:mb-0 flex w-full">
        Selamat Datang
      </h1>
      <img src="/images/hero.png" alt="" />
      <p className="text-green-700/80 text-xl font-bold text-start mb-8 lg:mb-0 flex w-full">Jelajahi dunia tanaman dan temukan apakah itu herbal dengan mudah</p>
      <div className="z-10 w-full  items-center justify-end font-mono text-sm lg:flex">
        <div className="flex h-48 w-full items-center justify-center bg-gradient-to-t from-white via-white lg:h-auto lg:bg-none">
          {session ? <LogoutButton /> : <LoginButton auth={session} />}
        </div>
      </div>
    </main>
  );
}
