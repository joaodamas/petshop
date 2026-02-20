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

  if (userData.user && isAppRoute) {
    const { data: member } = await supabase
      .from('petshop_members')
      .select('petshops(name)')
      .eq('user_id', userData.user.id)
      .limit(1)
      .maybeSingle()

    const shopName = (member as any)?.petshops?.name as string | undefined
    const onboardingNeeded = !shopName || shopName === 'Meu Petshop'

    if (onboardingNeeded && pathname !== '/app/onboarding') {
      return NextResponse.redirect(new URL('/app/onboarding', request.url))
    }

    if (!onboardingNeeded && pathname === '/app/onboarding') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }
  }

  return response
}
