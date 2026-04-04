"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/common/AuthContext";

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
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
      router.push("/nest");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (user) return null;

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (!loading && user && user?.role !== "super_admin") {
      router.push("/nest");
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;
  if (user.role !== "super_admin") return null;

  return children;
};