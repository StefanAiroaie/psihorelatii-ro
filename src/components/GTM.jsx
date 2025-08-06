'use client'
import Script from 'next/script';
import { useCookieConsent } from '../context/CookieConsent';


const GTM_ID = 'GTM-sssss';

const GTM = () => {
    const { cookiesAccepted, acceptCookies } = useCookieConsent();

    return (
        <>
            {/* Consent Mode setup */}
            <Script id="consent-init" strategy="beforeInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                        'ad_storage': '${cookiesAccepted ? 'granted' : 'denied'}',
                        'analytics_storage': '${cookiesAccepted ? 'granted' : 'denied'}',
                        'ad_user_data': '${cookiesAccepted ? 'granted' : 'denied'}',
                        'ad_personalization': '${cookiesAccepted ? 'granted' : 'denied'}'
                    });
                `}
            </Script>

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

            {/* Cookie Consent Banner */}
            {!cookiesAccepted && (
                <div className="fixed bottom-4 left-4 right-4 z-50 bg-white shadow-lg border border-gray-300 p-4 rounded-md max-w-md mx-auto text-center text-sm text-gray-800">
                    <p className="mb-2">Um das Anfrage- bzw. Kontaktformular anzuzeigen, benötigen wir Ihre Zustimmung zu Cookies.</p>
                    <button
                        onClick={() => {
                            acceptCookies();
                            window.gtag && window.gtag('consent', 'update', {
                                ad_storage: 'granted',
                                analytics_storage: 'granted',
                                ad_user_data: 'granted',
                                ad_personalization: 'granted'
                            });
                            window.dataLayer = window.dataLayer || [];
                            window.dataLayer.push({ event: 'cookie_consent_accepted' });
                        }}
                        className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded"
                    >
                        Cookies akzeptieren
                    </button>
                </div>
            )}
        </>
    );
};

export default GTM;
