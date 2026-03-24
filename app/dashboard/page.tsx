import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { getSiteContent } from '@/lib/content-manager'

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/login')
  }

  const content = await getSiteContent()

  return <DashboardShell initialContent={content} />
}
