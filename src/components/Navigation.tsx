"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Remove authentication cookie
    document.cookie = "authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/", label: "New Receipt", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <Image
                src="/images/logo.png"
                alt="Sonehra Wellness Logo"
                width={90}
                height={90}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-3xl font-bold text-primary">Sonehra Wellness</h1>
              <p className="text-sm text-muted-foreground">Fee Management Portal</p>
            </div>
            <div className="sm:hidden">
              <h1 className="text-xl font-bold text-primary">Sonehra Wellness</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-all
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <Button
              variant="destructive"
              className="w-full justify-start mt-4"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
