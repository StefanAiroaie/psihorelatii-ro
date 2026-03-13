'use client';

import Script from 'next/script';
import { useCookieConsent } from '@/context/CookieConsent';

export default function AdsenseScript() {
  const { cookiesAccepted } = useCookieConsent();

  if (!cookiesAccepted) {
    return null;
  }

  return (
    <Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2362578685287844"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      async
    />
  );
}
