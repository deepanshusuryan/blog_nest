"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";

// 🔒 Use this on pages that REQUIRE login (e.g. /blog, /dashboard)
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/blog");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return children;
};