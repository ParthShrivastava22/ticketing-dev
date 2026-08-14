import { buildServerClient } from "@/lib/server-client";

export default async function LandingPage() {
  let currentUser = null;
  const axiosInstance = await buildServerClient();

  try {
    const response = await axiosInstance.get("/api/users/currentUser");
    currentUser = response.data.currentUser;
  } catch (err) {
    console.log(err);
  }

  return (
    <div className="p-8">
      {currentUser ? (
        <h1 className="text-2xl font-bold">You are Signed In</h1>
      ) : (
        <h1 className="text-2xl font-bold">You ain't signed in bruv</h1>
      )}
    </div>
  );
}
