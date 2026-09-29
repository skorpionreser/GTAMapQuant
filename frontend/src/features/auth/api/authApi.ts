import type { LoginRequest } from "../types/LoginRequest";
import type { LoginResponse } from "../types/LoginResponse";

const authUrl = 'http://localhost:5114/api/Auth/login'

export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(authUrl,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(loginRequest)})
    
    if (!response.ok){
        throw new Error('Failed to auth.')
    }

    return response.json() as Promise<LoginResponse>
}