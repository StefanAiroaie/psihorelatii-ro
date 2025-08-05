"use client"
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react';
const navigation = [
    { name: 'Relații de cuplu', href: '/relatii' },
    { name: 'Psihologie practică', href: '/psihologie' },
    { name: 'Dezvoltare personală', href: '/dezvoltare' },
    { name: 'Gestionarea emoțiilor', href: '/emotii' },
    { name: 'Sănătate mintală', href: '/sanatate' },
]
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
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
            <header className="absolute inset-x-0 top-0 z-50">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="/" className="-m-1.5 p-1.5">
                            <span className="sr-only">Machbar Sozialfonds e. V.</span>
                            <img
                                alt="Logo von Machbar Sozialfonds e. V."
                                src="/logo.png"
                                className="h-8 w-auto"
                            />
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-primary">
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        <a href="/#" className="text-sm/6 font-semibold text-primary btn btn-accent">
                            Afla mai multe
                        </a>
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-primary/10">
                        <div className="flex items-center justify-between">
                            <a href="/" className="-m-1.5 p-1.5">
                                <span className="sr-only">Machbar Sozialfonds e. V.</span>
                                <img
                                    alt="Logo von Machbar Sozialfonds e. V."
                                    src="/logo.png"
                                    className="h-8 w-auto"
                                />
                            </a>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>


                        {/* mobile nav */}
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <Disclosure as="div" className="-mx-3">

                                    </Disclosure>
                                    {/* Links */}
                                    {navigation?.map((subLink, j) => (
                                        <Popover key={j} >
                                            <PopoverButton className="flex justify-center items-center text-sm font-semibold text-dark">
                                                <a
                                                    className="pr-4 hover:text-accent transition"
                                                    href={subLink.href}
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {subLink.name}
                                                </a>
                                            </PopoverButton>
                                        </Popover>
                                    ))}
                                </div>
                                <div className="py-6 flex justify-center" >
                                    {/* call to action */}
                                    <a
                                        onClick={() => setMobileMenuOpen(false)}
                                        href="/#"
                                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-primary hover:bg-gray-50 btn btn-accent"
                                    >
                                        Afla mai multe
                                    </a>
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
