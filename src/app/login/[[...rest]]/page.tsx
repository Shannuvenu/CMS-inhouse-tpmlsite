import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex justify-center px-6 py-24">
      <SignIn routing="path" path="/login" />
    </div>
  );
}