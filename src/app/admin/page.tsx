import AdminLogin from '@/components/admin/AdminLogin'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - Bihar Opinion Poll',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminLogin />
}
