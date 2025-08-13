"use client"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
const navigation = [
    { name: 'Articole', href: '/#articole' },
    { name: 'Informatii pe categorii', href: '/#categorii' },
    { name: 'FAQ', href: '/#faq' },
]
import Image from 'next/image';
import Link from "next/link";

import {
    Dialog,
    DialogPanel,
    Disclosure,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react';



const Header = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <>
            {/* Header */}
            <header className="bg-white shadow-lg sticky top-0 py-4 z-20 text-dark">
                {/* Desktop Nav */}
                <div className="container mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <a href="/" className="justify-center items-center">
                        <Image
                            src="/logo.png"
                            alt="Logo psihorelatii.ro"
                            width={200}
                            height={100}
                        />
                    </a>
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
                        <nav className="flex gap-8">
                            <PopoverGroup className="hidden gap-3 lg:flex ">
                                {/* Services */}
                                <Popover className="relative">
                                    {/* <PopoverButton className="flex justify-center items-center text-sm font-semibold text-dark  hover:text-accent transition">
                                        Dienstleistungen
                                        <ChevronDownIcon className="h-5 w-5 text-accent" aria-hidden="true" />
                                    </PopoverButton> */}

                                    <PopoverPanel className="absolute left-0 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                                        <div className="p-4">

                                        </div>
                                    </PopoverPanel>
                                </Popover>
                                {/* Links */}
                                {navigation.map((subLink, j) => (
                                    <Popover key={j} >
                                        <PopoverButton className="flex justify-center items-center text-sm font-semibold text-dark">
                                            <Link className="pr-4 hover:text-accent transition"
                                                href={subLink.href}

                                            >
                                                {subLink.name}
                                            </Link>

                                        </PopoverButton>
                                    </Popover>
                                ))}
                            </PopoverGroup>
                        </nav>
                        {/* Call to Action */}
                        {/* <a
                            className="btn bg-accent text-white px-2 py-2 rounded hover:bg-opacity-90 transition"
                            href="#anfrage"
                        >
                            Call To Action
                        </a> */}
                    </div>
                </div>

                {/* Mobile NAV */}
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            {/* Logo Mobile Menu */}
                            <a href="/" className="justify-center items-center">
                                <img
                                    src="/logoweila.png"
                                    alt="Logo psihorelatii.ro"
                                    width={200}
                                    height={100}
                                />
                            </a>
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
                                    <Disclosure as="div" className="-mx-3">

                                    </Disclosure>
                                    {/* Links */}
                                    {navigation.map((subLink, j) => (
                                        <Popover key={j} >
                                            <PopoverButton className="flex justify-center items-center text-sm font-semibold text-dark">
                                                <Link
                                                    className="pr-4 hover:text-accent transition"
                                                    href={subLink.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {subLink.name}
                                                </Link>
                                            </PopoverButton>
                                        </Popover>
                                    ))}
                                </div>
                                <div className="py-6 flex justify-center" >

                                    {/* Call to Action */}

                                    {/* <a
                                        className="btn bg-accent text-white px-2 py-2 rounded hover:bg-opacity-90 transition"
                                        href="#anfrage"
                                    >
                                        Call to action
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </>
    );
};

export default Header;






