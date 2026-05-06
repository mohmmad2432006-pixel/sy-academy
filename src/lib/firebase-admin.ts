import { initializeApp, getApps, cert, App } from 'firebase-admin/app'

let adminApp: App | null = null

export function initAdminApp() {
  if (adminApp || getApps().length > 0) return
  try {
    // For local dev: use service account JSON
    // For Vercel: use environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    
    if (process.env.FIREBASE_PRIVATE_KEY) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      })
    } else {
      // Fallback: initialize without credentials (works in Firebase hosting)
      adminApp = initializeApp({ projectId })
    }
  } catch (e) {
    console.error('Firebase admin init error:', e)
  }
}
