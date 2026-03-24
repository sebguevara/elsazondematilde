import type { Metadata, Viewport } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { esES } from '@clerk/localizations'
import { Nunito, Lilita_One } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { getSiteContent } from '@/lib/content-manager'
import { SiteShellHeader } from '@/components/app/site-shell-header'
import './globals.css'

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito',
  display: 'swap',
})

const lilitaOne = Lilita_One({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-lilita',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "El Sazón de Matilde's | Empanadas Colombianas Caseras",
  description: 'Las mejores empanadas colombianas con el sazón de la abuela. Tradicional, Pollo, Hawaiana, Ranchera y más. Pedí por WhatsApp.',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-icon.png',
    icon: '/favicon.ico'
  },
  keywords: ['empanadas', 'colombianas', 'comida casera', 'Matilde', 'tradicional', 'WhatsApp'],
  openGraph: {
    title: "El Sazón de Matilde's",
    description: 'Empanadas colombianas con el sazón de la abuela',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F5C846',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const content = await getSiteContent()

  return (
    <html lang="es" className={`${nunito.variable} ${lilitaOne.variable} scroll-smooth`}>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-title" content="Matilde's" />
    </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ClerkProvider
          localization={esES}
          signInUrl="/login"
          signInForceRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#A52A2A',
              colorBackground: '#FFFFFF',
              colorText: '#3D2914',
              colorInputBackground: '#FFF8E7',
              colorInputText: '#3D2914',
              borderRadius: '0.75rem',
              fontFamily: 'var(--font-nunito)',
            },
          }}
        >
          <SiteShellHeader brand={content.brand} />
          {children}
          <Toaster position="top-center" richColors />
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  )
}
