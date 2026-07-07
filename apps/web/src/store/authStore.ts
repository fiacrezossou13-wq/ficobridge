import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  requires2FA: boolean
  tempEmail: string | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  setRequires2FA: (email: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      requires2FA: false,
      tempEmail: null,
      setToken: (token) => set({ token, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      setRequires2FA: (email) => set({ requires2FA: !!email, tempEmail: email }),
      logout: () => set({ token: null, user: null, isAuthenticated: false, requires2FA: false, tempEmail: null }),
    }),
    { name: 'ficobridge-auth' }
  )
)
