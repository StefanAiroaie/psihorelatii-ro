'use client'
import { createContext, useContext, useEffect, useState } from 'react';

// Consent configuration
const CONSENT_VERSION = '1.0';
const CONSENT_MAX_AGE_DAYS = 365; // re-prompt anual

const LS_KEYS = {
    accepted: 'cookiesAccepted',
    version: 'cookiesVersion',
    ts: 'cookiesTimestamp'
};
const safeStorage = {
    get: (k) => {
        try { return window?.localStorage?.getItem(k) ?? null; } catch { return null; }
    },
    set: (k, v) => {
        try { window?.localStorage?.setItem(k, v); } catch { }
    },
    remove: (k) => {
        try { window?.localStorage?.removeItem(k); } catch { }
    }
};

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
    const [cookiesAccepted, setCookiesAccepted] = useState(undefined);

    // Citește decizia (cu versionare + expirare)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const storedConsent = safeStorage.get(LS_KEYS.accepted);
        const storedVersion = safeStorage.get(LS_KEYS.version);
        const storedTs = safeStorage.get(LS_KEYS.ts);

        const isExpired = () => {
            if (!storedTs) return true;
            const then = Number(storedTs);
            const days = (Date.now() - then) / (1000 * 60 * 60 * 24);
            return days > CONSENT_MAX_AGE_DAYS;
        };

        if (!storedConsent || storedVersion !== CONSENT_VERSION || isExpired()) {
            setCookiesAccepted(undefined); // reafișează bannerul
            return;
        }
        setCookiesAccepted(storedConsent === 'true');
    }, []);

    // Propagă schimbarea consimțământului (Consent Mode v2 + dataLayer)
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (cookiesAccepted === undefined) return;
        const state = cookiesAccepted ? 'granted' : 'denied';

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'cookie_consent_updated', cookiesAccepted });
        document.dispatchEvent(new CustomEvent('cookieconsent:updated', { detail: { accepted: cookiesAccepted } }));

        if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: state,
                analytics_storage: state,
                ad_user_data: state,
                ad_personalization: state
            });
        }
    }, [cookiesAccepted]);

    const updateStorage = (accepted) => {
        if (typeof window === 'undefined') return;
        safeStorage.set(LS_KEYS.accepted, accepted ? 'true' : 'false');
        safeStorage.set(LS_KEYS.version, CONSENT_VERSION);
        safeStorage.set(LS_KEYS.ts, String(Date.now()));
    };

    const acceptCookies = () => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
            });
        }
        updateStorage(true);
        setCookiesAccepted(true);
    };

    const rejectCookies = () => {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
            });
        }
        updateStorage(false);
        setCookiesAccepted(false);
    };

    const reopenPreferences = () => {
        safeStorage.remove(LS_KEYS.accepted);
        safeStorage.remove(LS_KEYS.version);
        safeStorage.remove(LS_KEYS.ts);
        setCookiesAccepted(undefined);
    };

    return (
        <CookieConsentContext.Provider
            value={{ cookiesAccepted, acceptCookies, rejectCookies, reopenPreferences }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => useContext(CookieConsentContext);