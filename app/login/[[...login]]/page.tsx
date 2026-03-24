import Image from 'next/image'
import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getSiteContent } from '@/lib/content-manager'

export default async function LoginPage() {
  const { userId } = await auth()
  const content = await getSiteContent()

  if (userId) {
    redirect('/dashboard')
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#fff8e7_0%,#fdf0c4_42%,#fff8e7_100%)] px-3 py-3 sm:px-4 md:px-6 md:py-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-40 w-40 rounded-full bg-matilde-yellow/20 blur-3xl sm:h-60 sm:w-60" />
        <div className="absolute right-[8%] top-[18%] h-44 w-44 rounded-full bg-matilde-red/10 blur-3xl sm:h-72 sm:w-72" />
        <div className="absolute bottom-[8%] left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-white/30 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <div className="relative z-10 w-full max-w-[32rem] rounded-[2rem] border border-[#ead7a8] bg-white/92 p-2 shadow-[0_24px_70px_rgba(93,64,55,0.16)] backdrop-blur sm:rounded-[2.25rem] sm:p-3 md:p-4">
        <div className="flex flex-col items-center gap-3 px-3 pt-3 text-center sm:px-4 sm:pt-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-[#eddcb5]">
            <Image
              src={content.brand.logo || '/logo_rojo.png'}
              alt={content.brand.name}
              fill
              className="object-contain p-1.5"
              priority
            />
          </div>
          <p className="font-serif text-2xl leading-none text-matilde-red sm:text-[2rem]">
            {content.brand.name}
          </p>
        </div>

        <div className="px-3 pt-3 text-center sm:px-4 sm:pt-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-matilde-red/70 sm:text-sm">
            Acceso privado
          </p>
          <p className="mt-1 font-serif text-3xl text-matilde-red sm:text-[2.15rem]">
            Iniciar sesión
          </p>
        </div>

        <SignIn
          path="/login"
          routing="path"
          forceRedirectUrl="/dashboard"
          signUpUrl="/login"
          appearance={{
            variables: {
              colorPrimary: '#A52A2A',
              colorBackground: '#FFFFFF',
              colorText: '#3D2914',
              colorInputBackground: '#FFFFFF',
              colorInputText: '#3D2914',
              borderRadius: '1rem',
              fontFamily: 'var(--font-nunito)',
            },
            elements: {
              rootBox: 'mx-auto flex w-full justify-center',
              card: 'mx-auto w-full overflow-hidden rounded-[1.4rem] border border-[#eddcb5] bg-[#fffaf3] shadow-[0_18px_50px_rgba(93,64,55,0.10)] sm:rounded-[1.6rem]',
              cardBox: 'mx-auto w-full',
              header: 'px-3 pt-2 sm:px-4 sm:pt-3 md:px-6 md:pt-4',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton:
                'min-h-10 rounded-2xl border border-matilde-yellow bg-white text-sm text-matilde-brown shadow-none hover:bg-matilde-yellow-light sm:min-h-11 sm:text-base',
              socialButtonsBlockButtonText: 'font-semibold',
              socialButtonsBlockButtonArrow: 'text-matilde-red',
              divider: 'px-3 sm:px-4 md:px-6',
              dividerLine: 'bg-matilde-yellow/70',
              dividerText: 'text-matilde-brown/60 font-medium',
              form: 'px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6',
              formFieldLabel: 'text-matilde-brown font-semibold',
              formFieldInput:
                'h-10 rounded-2xl border-matilde-yellow bg-white text-sm text-matilde-brown shadow-none sm:h-11 sm:text-base',
              formButtonPrimary:
                'h-10 rounded-2xl bg-matilde-red text-sm text-white shadow-none hover:bg-matilde-red-dark sm:h-11 sm:text-base',
              footerAction: 'hidden',
              footerActionLink: 'hidden',
              identityPreviewText: 'text-matilde-brown',
              formResendCodeLink: 'text-matilde-red hover:text-matilde-red-dark',
              otpCodeFieldInput:
                'rounded-2xl border-matilde-yellow bg-white text-matilde-brown',
              alert: 'rounded-2xl',
            },
          }}
        />
      </div>
    </main>
  )
}
