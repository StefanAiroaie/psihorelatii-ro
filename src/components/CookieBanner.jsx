'use client'
import Link from 'next/link';
import { useCookieConsent } from '../context/CookieConsent';

const CookieBanner = () => {
    const { cookiesAccepted, acceptCookies, rejectCookies, reopenPreferences } = useCookieConsent();

    return (
        <>
            <a
                href="/#kontakt"
                className={`fixed ${cookiesAccepted === undefined ? 'bottom-42' : 'bottom-6'} right-4 z-60 px-4 py-3 text-sm font-semibold btn text-white bg-primary rounded-xl shadow-lg hover:bg-primary/90 transition-all`}
            >
                Jetzt kontaktieren
            </a>

            {cookiesAccepted === undefined && (
                <div className="fixed bottom-0 w-full bg-dark text-white p-4 flex flex-col items-center text-sm z-50">
                    <p className="mb-2 text-center max-w-3xl">
                        Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern, den Datenverkehr zu analysieren und personalisierte Inhalte bereitzustellen.
                        Weitere Informationen finden Sie in unserer{' '}
                        <Link href="/datenschutz" className="underline text-accent hover:text-primary">
                            Datenschutzerklärung
                        </Link>.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={acceptCookies}
                            className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded"
                        >
                            Alle akzeptieren
                        </button>
                        <button
                            onClick={rejectCookies}
                            className="bg-muted hover:bg-muted/70 text-white px-4 py-2 rounded"
                        >
                            Ablehnen
                        </button>
                    </div>
                </div>
            )}
            {cookiesAccepted !== undefined && (
                <button
                    onClick={reopenPreferences}
                    className="fixed bottom-4 right-4 z-50 px-3 py-2 text-xs font-medium rounded-md bg-gray-800 text-white hover:bg-gray-700"
                    aria-label="Cookie-Einstellungen"
                >
                    Cookie-Einstellungen
                </button>
            )}
        </>
    );
};

export default CookieBanner;
