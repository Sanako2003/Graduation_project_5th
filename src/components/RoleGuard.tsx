"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  allowedRoles: string[];
  children: React.ReactNode;
};

function getRoleHome(role?: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "instructor":
      return "/admin_profial";
    default:
      return "/profile";
  }
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role ?? "")) {
      router.replace(getRoleHome(user.role));
    }
  }, [user, allowedRoles, router]);

  // مش مسجل أو ما عنده صلاحية → ما نعرض شي
  if (!user || !allowedRoles.includes(user.role ?? "")) {
    return null;
  }

  return <>{children}</>;
}
