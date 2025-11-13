"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth?: string
  city?: string
  profileImage?: string
  joinedAt: string
  isVerified: boolean
  totalSavings: number
  activeCircles: number
  rewardsEarned: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>
  signup: (userData: SignupData) => Promise<boolean>
  logout: () => void
  sendOTP: (phone: string) => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

export interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  dateOfBirth: string
  city: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in (from localStorage or session)
    const savedUser = localStorage.getItem('travelcircle_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Mock authentication - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      if (email === 'test@example.com' && password === 'password') {
        const mockUser: User = {
          id: '1',
          name: 'Test User',
          email: email,
          phone: '+91 9876543210',
          city: 'Mumbai',
          dateOfBirth: '1990-01-01',
          profileImage: undefined,
          joinedAt: new Date().toISOString(),
          isVerified: true,
          totalSavings: 230000,
          activeCircles: 3,
          rewardsEarned: 4600
        }
        setUser(mockUser)
        localStorage.setItem('travelcircle_user', JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPhone = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Mock OTP verification - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (otp === '123456') {
        const mockUser: User = {
          id: '1',
          name: 'Phone User',
          email: '',
          phone: phone,
          city: 'Delhi',
          profileImage: undefined,
          joinedAt: new Date().toISOString(),
          isVerified: true,
          totalSavings: 150000,
          activeCircles: 2,
          rewardsEarned: 3000
        }
        setUser(mockUser)
        localStorage.setItem('travelcircle_user', JSON.stringify(mockUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Phone login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Mock signup - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dateOfBirth: userData.dateOfBirth,
        city: userData.city,
        profileImage: undefined,
        joinedAt: new Date().toISOString(),
        isVerified: false,
        totalSavings: 0,
        activeCircles: 0,
        rewardsEarned: 0
      }
      
      setUser(newUser)
      localStorage.setItem('travelcircle_user', JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error('Signup error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      // Mock OTP sending - replace with real SMS API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`OTP sent to ${phone}: 123456`) // Mock OTP
      return true
    } catch (error) {
      console.error('Send OTP error:', error)
      return false
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false
    
    try {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem('travelcircle_user', JSON.stringify(updatedUser))
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('travelcircle_user')
  }

  const value = {
    user,
    login,
    loginWithPhone,
    signup,
    logout,
    sendOTP,
    updateProfile,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}