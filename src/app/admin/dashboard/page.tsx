import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Bihar Opinion Poll',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminDashboardPage() {
  return <AdminDashboard />
}
