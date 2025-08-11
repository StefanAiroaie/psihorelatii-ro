'use client'
import Script from 'next/script';
import { useCookieConsent } from '../context/CookieConsent';


const GTM_ID = 'GTM-sssss';

const GTM = () => {
    const { cookiesAccepted } = useCookieConsent();

    return (
        <>
            {/* Consent Mode default is initialized in root layout (beforeInteractive) */}

            {/* Google Tag Manager */}
            {cookiesAccepted && (
                <Script
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${GTM_ID}');
                        `,
                    }}
                />
            )}

            {/* Heyflow Script */}
            {cookiesAccepted && (
                <Script
                    src="https://assets.prd.heyflow.com/builder/widget/latest/webview.js"
                    strategy="afterInteractive"
                />
            )}
        </>
    );
};

export default GTM;
