'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  
  // Don't load Google Analytics on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-T3EKNJ7EQB"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T3EKNJ7EQB');
          `,
        }}
      />
    </>
  )
}
