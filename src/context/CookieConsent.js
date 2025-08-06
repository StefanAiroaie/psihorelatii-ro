'use client'
import { createContext, useContext, useEffect, useState } from 'react';

const CookieConsentContext = createContext();

export const CookieConsentProvider = ({ children }) => {
    const [cookiesAccepted, setCookiesAccepted] = useState(undefined);

    useEffect(() => {
        const storedConsent = localStorage.getItem('cookiesAccepted');
        if (storedConsent === 'true') {
            setCookiesAccepted(true);
        } else if (storedConsent === 'false') {
            setCookiesAccepted(false);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem('cookiesAccepted', 'true');
        setCookiesAccepted(true);
    };

    const rejectCookies = () => {
        localStorage.setItem('cookiesAccepted', 'false');
        setCookiesAccepted(false);
    };

    return (
        <CookieConsentContext.Provider value={{ cookiesAccepted, acceptCookies, rejectCookies }}>
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => useContext(CookieConsentContext);
