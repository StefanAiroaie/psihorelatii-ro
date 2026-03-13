"use client"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { CATEGORY_NAV, SITE_NAME } from '@/lib/siteConfig';

const navigation = [
    { name: 'Categorii', href: '/#categorii' },
    { name: 'Despre noi', href: '/despre-noi' },
    { name: 'Contact', href: '/contact' },
];

const Header = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 py-4 z-20 text-dark">
                {/* Desktop Nav */}
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="justify-center items-center">
                        <Image
                            src="/logo.png"
                            alt={`Logo - ${SITE_NAME}`}
                            width={250} height={150}  // 3× pentru ecrane dense
                            sizes="150px"
                            quality={45}
                            className='p-4'
                        />
                    </Link>
                    {/* Burger Menu Icon */}
                    <div className="flex lg:hidden justify-end">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon className="w-10 h-10" aria-hidden="true" />
                        </button>
                    </div>
                    {/* Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-dark">
                            {navigation.map((subLink) => (
                                <Link key={subLink.name} className="hover:text-accent transition" href={subLink.href}>
                                    {subLink.name}
                                </Link>
                            ))}
                            {CATEGORY_NAV.map((item) => (
                                <Link key={item.slug} className="hover:text-accent transition" href={`/${item.slug}`}>
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Mobile NAV */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="absolute inset-0 bg-black/30" onClick={() => setMobileMenuOpen(false)} />
                        <div className="absolute inset-y-0 right-0 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            {/* Logo Mobile Menu */}
                            <Link href="/" className="justify-center items-center" onClick={() => setMobileMenuOpen(false)}>
                                <Image
                                    src="/logo.png"
                                    alt={`Logo - ${SITE_NAME}`}
                                    width={450} height={225}  // 3× pentru ecrane dense
                                    sizes="150px"
                                    quality={45}
                                    className='p-4'
                                />
                            </Link>
                            {/* Close Button*/}
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        {/* Nav */}
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((subLink) => (
                                        <Link
                                            key={subLink.name}
                                            className="block py-2 text-sm font-semibold text-dark hover:text-accent transition"
                                            href={subLink.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {subLink.name}
                                        </Link>
                                    ))}
                                    {CATEGORY_NAV.map((item) => (
                                        <Link
                                            key={item.slug}
                                            className="block py-2 text-sm font-semibold text-dark hover:text-accent transition"
                                            href={`/${item.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;




