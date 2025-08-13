'use client'
import Link from 'next/link';
import { useCookieConsent } from '../context/CookieConsent';

const CookieBanner = () => {
    const { cookiesAccepted, acceptCookies, rejectCookies, reopenPreferences } = useCookieConsent();

    return (
        <>
            {cookiesAccepted === undefined && (
                <div className="fixed bottom-0 w-full bg-dark text-white p-4 flex flex-col items-center text-sm z-50">
                    <p className="mb-2 text-center max-w-3xl">
                        Folosim cookie‑uri pentru a îmbunătăți experiența pe site, pentru a analiza traficul și pentru a personaliza conținutul. Mai multe detalii găsești în{' '}
                        <Link href="/politica-confidentialitate" className="underline text-accent hover:text-primary">
                            Politica de confidențialitate
                        </Link>.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={acceptCookies}
                            className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded"
                        >
                            Acceptă toate
                        </button>
                        <button
                            onClick={rejectCookies}
                            className="bg-muted hover:bg-muted/70 text-white px-4 py-2 rounded"
                        >
                            Respinge
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
                    Preferințe cookie
                </button>
            )}
        </>
    );
};

export default CookieBanner;
