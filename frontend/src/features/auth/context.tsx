import { useState, useEffect, type ReactNode } from "react"
import type { User } from "./contract"
import { authApi } from "./api"
import { AuthContext } from "./context"
import type { AuthContextType } from "./context"
import { ApiError } from "@/lib/api-client"

function toUser(userData: User): User {
  return {
    _id: userData._id,
    email: userData.email,
    name: userData.name,
    avatarUrl: userData.avatarUrl,
    bio: userData.bio,
    role: userData.role,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt
  } as User
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const userData = await authApi.getProfile()
      setUser(toUser(userData))
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          await authApi.refresh()
          const userData = await authApi.getProfile()
          setUser(toUser(userData))
        } catch {
          setUser(null)
        }
      } else {
        setUser(null)
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const response = await authApi.login({ email, password })
    setUser(response.user)
  }

  async function register(email: string, password: string, name: string) {
    const response = await authApi.register({ email, password, name })
    setUser(response.user)
  }

  async function logout() {
    await authApi.logout()
    setUser(null)
  }

  async function refreshUser() {
    try {
      const userData = await authApi.getProfile()
      setUser({
        _id: userData._id,
        email: userData.email,
        name: userData.name,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio,
        role: userData.role,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      } as User)
    } catch {
      // silently fail
    }
  }

  return (
    <AuthContext.Provider
      value={
        {
          user,
          isLoading,
          login,
          register,
          logout,
          refreshUser
        } as AuthContextType
      }
    >
      {children}
    </AuthContext.Provider>
  )
}
