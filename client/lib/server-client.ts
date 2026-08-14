import axios from "axios";
import { headers } from "next/headers";

export const buildServerClient = async () => {
  const headersList = await headers();

  return axios.create({
    baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
    headers: {
      Host: headersList.get("host") || "ticketing.dev",
      Cookie: headersList.get("cookie") || "",
    },
  });
};
