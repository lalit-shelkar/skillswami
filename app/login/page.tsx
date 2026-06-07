import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-white">Log In</h1>
      <p className="mt-2 text-gray-400">Access your Skillswami account to join pools.</p>
      <div className="mt-8">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
