import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold text-white">Sign Up</h1>
      <p className="mt-2 text-gray-400">
        Create your account to join tournament pools. Email and password only.
      </p>
      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}
