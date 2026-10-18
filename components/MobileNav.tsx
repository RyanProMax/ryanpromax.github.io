'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from './Link';
import headerNavLinks from '@/data/headerNavLinks';
import { DEFAULT_LOCALE, Locale } from '@/locales/config';

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { locale = DEFAULT_LOCALE } = useParams();
  const pathname = usePathname();
  const language = locale as Locale;
  const links = headerNavLinks[language] || headerNavLinks[DEFAULT_LOCALE];
  const label = language === Locale.ZH ? '导航' : 'Navigation';
  return (
    <>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={22} />
      </button>
      <Dialog open={open} onClose={setOpen} className="mobile-menu-dialog">
        <div className="mobile-menu-backdrop" aria-hidden="true" />
        <DialogPanel className="mobile-menu-panel">
          <div className="mobile-menu-heading">
            <DialogTitle>{label}</DialogTitle>
            <button
              type="button"
              aria-label={language === Locale.ZH ? '关闭导航' : 'Close navigation'}
              onClick={() => setOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
          <nav aria-label={label}>
            {links.map((link) => {
              const href = `/${language}${link.href === '/' ? '' : link.href}`;
              const active =
                link.href === '/'
                  ? pathname.replace(/\/$/, '') === href
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                  <span aria-hidden="true">↗</span>
                </Link>
              );
            })}
          </nav>
        </DialogPanel>
      </Dialog>
    </>
  );
}
