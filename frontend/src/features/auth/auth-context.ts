import { createContext } from 'react'
import type { LoginRequest } from './types/LoginRequest'
import type { LoginResponse } from './types/LoginResponse'

export interface AuthContextValue {
  session: LoginResponse | null
  isAdmin: boolean
  signIn: (request: LoginRequest) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
