import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getSupabaseEnv } from '@/lib/supabase/env'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, anonKey } = getSupabaseEnv()

  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: userData } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname
  const isAuthRoute = pathname === '/login' || pathname === '/signup'
  const isAppRoute = pathname.startsWith('/app')

  if (!userData.user && isAppRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (userData.user && isAuthRoute) {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // Nao bloquear navegacao do app com regra fraca de onboarding.
  // O onboarding continua disponivel em /app/onboarding.

  return response
}
