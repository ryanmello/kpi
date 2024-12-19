"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.status != "authenticated") {
      router.push("/sign-in");
    }
  }, [session, router]);

  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default HomePage;
