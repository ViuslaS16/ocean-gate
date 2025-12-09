'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, FileText, AlertTriangle, Settings, LayoutDashboard } from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Stock', path: '/stock', icon: Package },
        { name: 'Invoices', path: '/invoices', icon: FileText },
        { name: 'DOA', path: '/doa', icon: AlertTriangle },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-lg border-b border-cyan-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-ocean-600 bg-clip-text text-transparent">
                                Ocean Gate International
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`
                                        flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200
                                        ${isActive(link.path)
                                            ? 'bg-gradient-to-r from-cyan-500 to-ocean-500 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'
                                        }
                                    `}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button className="text-gray-700 hover:text-cyan-600 p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden border-t border-cyan-100 bg-white/95 backdrop-blur-sm">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                href={link.path}
                                className={`
                                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
                                    ${isActive(link.path)
                                        ? 'bg-gradient-to-r from-cyan-500 to-ocean-500 text-white'
                                        : 'text-gray-700 hover:bg-cyan-50 hover:text-cyan-600'
                                    }
                                `}
                            >
                                <Icon size={18} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
