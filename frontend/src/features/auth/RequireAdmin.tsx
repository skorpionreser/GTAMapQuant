import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from './useAuth';

interface RequireAdminProps {
  children: ReactNode
}

export function RequireAdmin({ children }: RequireAdminProps){
    const { session, isAdmin } = useAuth()

    if (!session || !isAdmin) {
        return <Navigate to="/" replace />
    }

    return children
}
