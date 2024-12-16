"use client";

import { useCallback } from "react";
import { axiosBase } from "../../utils/axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const logout = useCallback(async () => {
    await axiosBase.post("/auth/logout", undefined, { withCredentials: true });
    router.push("/auth/login");
  }, [router]);

  return (
    <div>
      <h2>Home</h2>
      <button
        type="button"
        className="shadow bg-blue-500 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}
