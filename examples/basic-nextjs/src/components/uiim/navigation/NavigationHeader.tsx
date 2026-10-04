'use client';

import React, { JSX, useState, useEffect } from 'react';
import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text,
} from '@sitecore-content-sdk/nextjs';
import Link from 'next/link';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';
import { TypeaheadSearchBox } from '@/lib/search-ui/TypeaheadSearchBox';

interface NavigationLinkFields {
  id: string;
  linkText: { jsonValue: Field<string> };
  linkUrl: { jsonValue: LinkField };
}

interface NavigationHeaderDatasource {
  brandLogo: { jsonValue: ImageField };
  ctaLabel: { jsonValue: Field<string> };
  ctaLink: { jsonValue: LinkField };
  // Optional header search slot — renders a typeahead in the nav row when
  // SearchIndex is filled on the datasource. Empty = no search box.
  searchIndex?: { jsonValue: Field<string> };
  titleMapping?: { jsonValue: Field<string> };
  linkMapping?: { jsonValue: Field<string> };
  resultsPage?: { jsonValue: LinkField };
  maxSuggestions?: { jsonValue: Field<string> };
  children: {
    results: NavigationLinkFields[];
  };
}

interface NavigationHeaderFields {
  data: {
    datasource: NavigationHeaderDatasource;
  };
}

type NavigationHeaderProps = ComponentProps & {
  fields: NavigationHeaderFields;
};

const NavigationHeaderDefaultComponent = (): JSX.Element => (
  <div className="component navigation-header">
    <div className="component-content">
      <span className="is-empty-hint">NavigationHeader</span>
    </div>
  </div>
);

const Logo = ({
  className,
  brandLogo,
  imageClassName,
}: {
  className?: string;
  brandLogo?: ImageField;
  imageClassName?: string;
}) => {
  const hasImage = brandLogo?.value?.src;
  return (
    <Link
      href="/"
      className={cn('flex items-center text-xl font-bold tracking-tight', className)}
      style={{ color: 'var(--brand-header-fg, inherit)' }}
    >
      {hasImage ? (
        <ContentSdkImage
          field={brandLogo}
          className={cn('h-8 w-auto object-contain sm:h-10', imageClassName)}
        />
      ) : (
        <>
          <span style={{ color: 'var(--brand-primary)' }}>Brand</span>Logo
        </>
      )}
    </Link>
  );
};

const NavLinks = ({
  className,
  items,
}: {
  className?: string;
  items: NavigationLinkFields[];
}) => (
  <nav className={cn('hidden md:flex items-center gap-6', className)}>
    {items.map((item) => (
      <ContentSdkLink
        key={item.id}
        field={item.linkUrl?.jsonValue}
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: 'var(--brand-header-fg, inherit)' }}
      >
        {item.linkText?.jsonValue?.value && (
          <Text field={item.linkText?.jsonValue} />
        )}
      </ContentSdkLink>
    ))}
  </nav>
);

const MobileMenu = ({
  items,
  open,
  onClose,
}: {
  items: NavigationLinkFields[];
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;
  return (
    <div
      className="md:hidden border-t"
      style={{ borderColor: 'var(--brand-border, #e5e7eb)' }}
    >
      <div className="px-4 py-4 flex flex-col gap-4">
        {items.map((item) => (
          <ContentSdkLink
            key={item.id}
            field={item.linkUrl?.jsonValue}
            className="text-sm font-medium"
            style={{ color: 'var(--brand-header-fg, inherit)' }}
            onClick={onClose}
          >
            {item.linkText?.jsonValue?.value && (
              <Text field={item.linkText?.jsonValue} />
            )}
          </ContentSdkLink>
        ))}
      </div>
    </div>
  );
};

const CtaButton = ({
  className,
  label,
  link,
  isEditing,
}: {
  className?: string;
  label?: Field<string>;
  link?: LinkField;
  isEditing?: boolean;
}) => {
  if (!link?.value?.href && !isEditing) return null;

  const ctaClassName = cn(
    'hidden md:inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90',
    className
  );
  const ctaStyle = {
    backgroundColor: 'var(--brand-primary)',
    color: 'var(--brand-primary-foreground)',
  };

  if (!link) {
    return (
      <span className={ctaClassName} style={ctaStyle}>
        {label?.value && <Text field={label} />}
      </span>
    );
  }

  return (
    <ContentSdkLink field={link} className={ctaClassName} style={ctaStyle}>
      {label?.value && <Text field={label} />}
    </ContentSdkLink>
  );
};

// The in-row search slot: glass pill sized for the nav bar, only when the
// datasource carries a search index. Hidden on mobile (the bar is too tight).
const HeaderSearch = ({
  datasource,
  page,
  rendering,
}: Pick<ComponentProps, 'page' | 'rendering'> & {
  datasource: NavigationHeaderDatasource;
}) => {
  if (!datasource.searchIndex?.jsonValue?.value) return null;
  return (
    <div className="hidden md:block">
      <TypeaheadSearchBox
        compact
        onDark
        fields={{
          SearchIndex: datasource.searchIndex?.jsonValue,
          TitleMapping: datasource.titleMapping?.jsonValue,
          LinkMapping: datasource.linkMapping?.jsonValue,
          ResultsPage: datasource.resultsPage?.jsonValue,
          MaxSuggestions: datasource.maxSuggestions?.jsonValue,
        }}
        page={page}
        rendering={rendering}
        className="w-44 lg:w-64"
      />
    </div>
  );
};

const MenuButton = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button
    className="md:hidden p-2"
    onClick={onClick}
    aria-label="Toggle menu"
    style={{ color: 'var(--brand-header-fg, inherit)' }}
  >
    {open ? (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ) : (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    )}
  </button>
);

export const Default = ({ fields, params, page, rendering }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [menuOpen, setMenuOpen] = useState(false);

  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = datasource.children?.results || [];
  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className="w-full border-b"
        style={{
          backgroundColor: 'var(--brand-header-bg, #ffffff)',
          borderColor: '#e6e6e6',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo brandLogo={brandLogo} />
          <NavLinks items={links} />
          <div className="flex items-center gap-3">
            <HeaderSearch datasource={datasource} page={page} rendering={rendering} />
            <CtaButton
              label={datasource.ctaLabel?.jsonValue}
              link={datasource.ctaLink?.jsonValue}
              isEditing={isEditing}
            />
            <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};

export const Transparent = ({ fields, params, page }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const datasource = fields?.data?.datasource;

  useEffect(() => {
    if (!datasource) return;
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [datasource]);

  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = datasource.children?.results || [];
  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
          scrolled ? 'border-b shadow-sm' : ''
        )}
        style={{
          backgroundColor: scrolled
            ? 'var(--brand-header-bg, #ffffff)'
            : 'transparent',
          borderColor: scrolled
            ? 'var(--brand-border, #e5e7eb)'
            : 'transparent',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo
            brandLogo={brandLogo}
            className={cn(
              'transition-colors duration-300',
              !scrolled && 'drop-shadow-sm'
            )}
          />
          <NavLinks
            items={links}
            className={cn(
              'transition-colors duration-300',
              !scrolled && '[&_a]:!text-white [&_a]:drop-shadow-sm'
            )}
          />
          <div className="flex items-center gap-2">
            <CtaButton
              label={datasource.ctaLabel?.jsonValue}
              link={datasource.ctaLink?.jsonValue}
              isEditing={isEditing}
            />
            <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};

const KFMB_LOGO = 'https://www.kuwaitflourmills.com/Frontend/KFMBC_New/images/logo.svg';

const KFMB_SOCIAL = [
  { label: 'Instagram', href: 'https://instagram.com/kfmkuwait', path: 'M8 4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4zm8.2 2.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 8.2A3.8 3.8 0 1 0 12 15.8 3.8 3.8 0 0 0 12 8.2z' },
  { label: 'Facebook', href: 'https://www.facebook.com/kfmkuwait', path: 'M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1z' },
  { label: 'X', href: 'https://twitter.com/kfmkuwait', path: 'M5 5l5.2 6.8L5.4 19H7.6l3.6-4.6L14.6 19H19l-5.5-7.2L18.4 5H16.2l-3.2 4.2L9.6 5H5z' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kfmkuwait', path: 'M14 4c.4 2.2 1.8 3.8 4 4.2v2.4c-1.4 0-2.7-.4-4-1.2v5.4a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .8.1v2.6a3 3 0 1 0 2.2 2.9V4H14z' },
  { label: 'YouTube', href: 'https://www.youtube.com/kfmkuwait', path: 'M4 8.2A2.2 2.2 0 0 1 6.2 6h11.6A2.2 2.2 0 0 1 20 8.2v7.6A2.2 2.2 0 0 1 17.8 18H6.2A2.2 2.2 0 0 1 4 15.8V8.2zm6 1.2v5.2l4.6-2.6L10 9.4z' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/kuwait-flour-mills-bakeries-company/', path: 'M6 9H8.5V18H6V9zM7.2 5A1.4 1.4 0 1 1 7.2 7.8 1.4 1.4 0 0 1 7.2 5zM11 9h2.4v1.2h.1c.3-.6 1.2-1.3 2.5-1.3 2.6 0 3.1 1.7 3.1 3.9V18H16.6v-4.4c0-1 0-2.4-1.5-2.4s-1.7 1.1-1.7 2.3V18H11V9z' },
];

function KfmbNavLink({ item }: { item: NavigationLinkFields }): JSX.Element {
  return (
    <ContentSdkLink
      field={item.linkUrl?.jsonValue}
      className="group text-[12px] font-bold uppercase tracking-[1px]"
      style={{ color: 'var(--brand-secondary)', fontFamily: 'var(--brand-heading-font)' }}
    >
      {item.linkText?.jsonValue?.value && <Text field={item.linkText.jsonValue} />}
      <span className="mt-[5px] block h-[3px] w-0 bg-[var(--brand-accent)] transition-all duration-300 group-hover:w-full" />
    </ContentSdkLink>
  );
}

/* Kfmb variant — centered emblem, utility row, menu split around the logo */
export const Kfmb = ({ fields, params, page }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [menuOpen, setMenuOpen] = useState(false);
  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const links = [...(datasource.children?.results || [])].sort((left, right) => {
    const rank = (label: string) => {
      const value = label.toLowerCase();
      const order = ['about', 'factor', 'media', 'cooking', 'career', 'contact'];
      const index = order.findIndex((entry) => value.includes(entry));
      return index === -1 ? order.length : index;
    };
    return rank(left.linkText?.jsonValue?.value || '') - rank(right.linkText?.jsonValue?.value || '');
  });
  const leftLinks = links.slice(0, 2);
  const rightLinks = links.slice(2);
  const brandLogo = datasource.brandLogo?.jsonValue;
  const hasLogo = Boolean(brandLogo?.value?.src);

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header className="relative w-full bg-white">
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="hidden items-center justify-between pt-4 lg:flex">
            <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: 'var(--brand-secondary)' }}>
              <a href="/Home" className="hover:opacity-70">Home</a>
              <a
                href="https://sales.kfmb.com.kw"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center rounded-full border-2 px-4 text-[11px] normal-case text-white"
                style={{ backgroundColor: 'var(--brand-secondary)', borderColor: 'var(--brand-accent)' }}
              >
                KFMB Online Store
              </a>
              <a href="https://www.kuwaitflourmills.com/Home" className="max-w-[11rem] leading-tight hover:opacity-70">
                Right To Access Information
              </a>
            </div>
            <div className="flex items-center gap-2">
              {KFMB_SOCIAL.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-[25px] w-[25px] items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{
                    backgroundColor: 'var(--brand-secondary)',
                    boxShadow: '0 0 0 3px color-mix(in srgb, var(--brand-accent) 50%, transparent)',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d={item.path} />
                  </svg>
                </a>
              ))}
              {(datasource.ctaLink?.jsonValue?.value?.href || isEditing) && (
                <ContentSdkLink
                  field={datasource.ctaLink?.jsonValue}
                  className="ml-2 inline-flex items-center gap-1 text-[12px] font-bold"
                  style={{ color: 'var(--brand-secondary)', background: 'none' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19" />
                  </svg>
                  {datasource.ctaLabel?.jsonValue?.value ? <Text field={datasource.ctaLabel.jsonValue} /> : 'Login'}
                </ContentSdkLink>
              )}
              <a href="https://www.kuwaitflourmills.com/ar/Home" lang="ar" className="ml-1 text-[15px] font-black" style={{ color: 'var(--brand-secondary)' }}>
                عربي
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center py-3 lg:min-h-[4.75rem] lg:py-2">
            <div className="relative z-10 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
              {hasLogo ? (
                <Logo brandLogo={brandLogo} imageClassName="h-[92px] w-auto sm:h-[110px]" className="shrink-0" />
              ) : (
                <a href="/Home">
                  <img src={KFMB_LOGO} alt="Kuwait Flour Mills & Bakeries" className="h-[92px] w-auto sm:h-[110px]" />
                </a>
              )}
            </div>
            <nav className="hidden w-full grid-cols-[1fr_9.5rem_1fr] items-center lg:grid">
              <div className="flex items-center justify-end gap-5 pr-3">
                {leftLinks.map((item) => (
                  <KfmbNavLink key={item.id} item={item} />
                ))}
              </div>
              <span aria-hidden />
              <div className="flex items-center justify-start gap-5 pl-3">
                {rightLinks.map((item) => (
                  <KfmbNavLink key={item.id} item={item} />
                ))}
              </div>
            </nav>
            <div className="absolute right-0 top-3 lg:hidden">
              <MenuButton open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
            </div>
          </div>
        </div>
        <MobileMenu items={links} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>
    </div>
  );
};

export const Minimal = ({ fields, params }: NavigationHeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;

  const datasource = fields?.data?.datasource;
  if (!datasource) return <NavigationHeaderDefaultComponent />;

  const brandLogo = datasource.brandLogo?.jsonValue;

  return (
    <div className={cn('component navigation-header', styles)} id={RenderingIdentifier}>
      <header
        className="w-full"
        style={{
          backgroundColor: 'var(--brand-header-bg, #ffffff)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 sm:px-6">
          <Logo brandLogo={brandLogo} />
        </div>
      </header>
    </div>
  );
};
