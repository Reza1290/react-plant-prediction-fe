
import LoginForm from "@/components/LoginForm";


export default function SignIn() {

  return (
    <div className="flex min-h-screen flex-col items-center mx-auto p-24 max-w-[40rem]">
      <h1 className="font-bold text-3xl">Sign in to your account</h1>
      <LoginForm />
    </div>
  );
}
