import { login } from "./api/authApi";
import { useState} from "react";
import type { ReactNode } from "react";
import type { LoginRequest } from "./types/LoginRequest";
import type { LoginResponse } from "./types/LoginResponse";
import { AuthContext } from './auth-context'

const authSessionStorageKey = 'gtamapquant-auth-session'

interface AuthProviderProps{
    children: ReactNode
}

function getStoredSession(): LoginResponse | null {
    const storedSession = sessionStorage.getItem(authSessionStorageKey)

    if (!storedSession) {
        return null
    }

    try {
        return JSON.parse(storedSession) as LoginResponse
    } catch {
        sessionStorage.removeItem(authSessionStorageKey)
        return null
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [session, setSession] = useState<LoginResponse | null>(getStoredSession)

    async function signIn(request: LoginRequest){
        const response = await login(request)
        sessionStorage.setItem(
        authSessionStorageKey,
        JSON.stringify(response),
        )
        setSession(response)
    }

    function signOut(){
        sessionStorage.removeItem(authSessionStorageKey)
        setSession(null)
    }

    const isAdmin = session?.role === 'Admin'

    return (
        <AuthContext.Provider value={{ session, isAdmin, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
