const footerNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Impressum', href: '/impressum' },
    { name: 'Datenschutz', href: '/datenschutz' },
]



const Footer = () => {

    return (
        <>
            {/* Footer */}
            <footer className="bg-white mb-12">
                <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                    <nav aria-label="Footer" className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
                        {footerNavigation.map((item) => (
                            <a key={item.name} href={item.href} className="text-primary hover:text-accent">
                                {item.name}
                            </a>
                        ))}
                    </nav>
                    <p className="mt-10 text-center text-sm/6 font-semibold text-dark">&copy; {new Date().getFullYear()}  Psihorelatii.ro - All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;
