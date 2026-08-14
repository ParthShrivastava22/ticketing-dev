"use client";

import AuthForm from "@/components/auth-form";
import { useRequest } from "@/hooks/use-request";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  const { doRequest } = useRequest({
    url: "/api/users/signin",
    method: "post",
    onSuccess: () => {
      console.log("Signin successful!");
      router.push("/landing");
    },
  });

  const handleSignIn = async (email: string, password: string) => {
    await doRequest({
      email,
      password,
    });
  };

  return (
    <AuthForm
      title="Welcome back"
      description="Enter your email and password to sign in."
      buttonText="Sign in"
      onSubmit={handleSignIn}
    />
  );
}
