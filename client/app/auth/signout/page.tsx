"use client";

import { useEffect } from "react";
import { useRequest } from "@/hooks/use-request";
import { useRouter } from "next/navigation";

export default function SingOut() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    onSuccess: () => router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signed out</div>;
}
