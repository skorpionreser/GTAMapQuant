import { login } from "./api/authApi";
import { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";
import type { LoginRequest } from "./types/LoginRequest";
import type { LoginResponse } from "./types/LoginResponse";

const authSessionStorageKey = 'gtamapquant-auth-session'

interface AuthContextValue{
    session: LoginResponse | null
    isAdmin: boolean
    signIn: (request: LoginRequest) => Promise<void>
    signOut: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

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

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}
