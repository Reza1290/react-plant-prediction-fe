
import LoginForm from "@/components/LoginForm";


export default function SignIn() {

  return (
    <div className="flex min-h-screen justify-center items-center flex-col max-w-lg mx-auto">
      <h1 className="font-bold text-3xl mx-24">Sign in to your account</h1>
      <LoginForm />
    </div>
  );
}
