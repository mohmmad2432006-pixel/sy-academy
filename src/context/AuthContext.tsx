'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'
import { getDeviceFingerprint } from '@/lib/device'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  userData: any | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const syncUser = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()
      const fingerprint = getDeviceFingerprint()
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: firebaseUser.displayName || 'مستخدم',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          fingerprint,
        }),
      })
      const data = await res.json()
      if (data.user) setUserData(data.user)
      return data
    } catch (e) {
      console.error('sync error', e)
    }
  }

  useEffect(() => {
    // Handle redirect result first
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        await syncUser(result.user)
      }
    }).catch(console.error)

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await syncUser(firebaseUser)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    try {
      // Try popup first, fallback to redirect
      try {
        const result = await signInWithPopup(auth, googleProvider)
        await syncUser(result.user)
        toast.success('تم تسجيل الدخول بنجاح!')
      } catch (popupError: any) {
        if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
          await signInWithRedirect(auth, googleProvider)
        } else {
          throw popupError
        }
      }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      toast.error('فشل تسجيل الدخول بـ Google: ' + (error.message || 'خطأ غير معروف'))
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await syncUser(result.user)
      toast.success('تم تسجيل الدخول بنجاح!')
    } catch (error: any) {
      const msg = error.code === 'auth/wrong-password' ? 'كلمة المرور غير صحيحة'
        : error.code === 'auth/user-not-found' ? 'البريد الإلكتروني غير موجود'
        : error.code === 'auth/invalid-credential' ? 'البيانات غير صحيحة'
        : 'فشل تسجيل الدخول'
      toast.error(msg)
      throw error
    }
  }

  const registerWithEmail = async (name: string, email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      await syncUser(result.user)
      toast.success('تم إنشاء الحساب بنجاح!')
    } catch (error: any) {
      const msg = error.code === 'auth/email-already-in-use' ? 'البريد الإلكتروني مستخدم بالفعل'
        : error.code === 'auth/weak-password' ? 'كلمة المرور ضعيفة جداً'
        : 'فشل إنشاء الحساب'
      toast.error(msg)
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
    setUserData(null)
    toast.success('تم تسجيل الخروج')
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, signInWithGoogle, signInWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
