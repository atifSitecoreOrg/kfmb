'use client';

import React, { JSX, useState } from 'react';
import {
  Field,
  RichText as ContentSdkRichText,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { cn } from '@/lib/utils';

interface NewsletterSignupFields {
  Title: Field<string>;
  Description: Field<string>;
  PlaceholderText: Field<string>;
  ButtonText: Field<string>;
  SuccessMessage: Field<string>;
}

type NewsletterSignupProps = ComponentProps & {
  fields: NewsletterSignupFields;
};

const NewsletterSignupDefaultComponent = (): JSX.Element => (
  <div className="component newsletter-signup">
    <div className="component-content">
      <span className="is-empty-hint">NewsletterSignup</span>
    </div>
  </div>
);

const FormRow = ({
  fields,
  isEditing,
  submitted,
  onSubmit,
  inputClassName,
  buttonClassName,
  buttonStyle,
}: {
  fields: NewsletterSignupFields;
  isEditing?: boolean;
  submitted: boolean;
  onSubmit: () => void;
  inputClassName?: string;
  buttonClassName?: string;
  buttonStyle?: React.CSSProperties;
}) => {
  if (submitted && fields.SuccessMessage?.value) {
    return (
      <p
        className="text-sm font-medium font-[var(--brand-body-font,inherit)]"
        style={{ color: 'var(--brand-primary)' }}
      >
        {fields.SuccessMessage.value}
      </p>
    );
  }

  return (
    <div className="flex w-full max-w-md gap-2">
      <input
        type="email"
        placeholder={fields.PlaceholderText?.value || 'Enter your email'}
        className={cn(
          'flex-1 rounded-[var(--brand-button-radius,0.375rem)] border px-4 py-2.5 text-sm font-[var(--brand-body-font,inherit)]',
          inputClassName
        )}
        style={{
          borderColor: 'var(--brand-border, #e5e7eb)',
          color: 'var(--brand-fg, #111111)',
          backgroundColor: 'var(--brand-bg, #ffffff)',
          ...(!inputClassName ? {} : {}),
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        className={cn(
          'shrink-0 rounded-[var(--brand-button-radius,0.375rem)] px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 font-[var(--brand-body-font,inherit)]',
          buttonClassName
        )}
        style={buttonStyle || {
          backgroundColor: 'var(--brand-primary)',
          color: 'var(--brand-primary-foreground)',
        }}
      >
        {(isEditing && fields.ButtonText) ? (
          <Text field={fields.ButtonText} />
        ) : (
          fields.ButtonText?.value || 'Subscribe'
        )}
      </button>
    </div>
  );
};

/* ────────────────────────────────────────────
   Default — centered layout
   ──────────────────────────────────────────── */
export const Default = ({ fields, params, page }: NewsletterSignupProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [submitted, setSubmitted] = useState(false);
  if (!fields) return <NewsletterSignupDefaultComponent />;

  return (
    <div className={cn('component newsletter-signup', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-16"
        style={{ backgroundColor: 'var(--brand-bg, #ffffff)' }}
      >
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          {(fields.Title?.value || isEditing) && (
            <Text
              field={fields.Title}
              tag="h2"
              className="text-2xl font-bold font-[var(--brand-heading-font,inherit)]"
              style={{ color: 'var(--brand-fg, #111111)' }}
            />
          )}
          {(fields.Description?.value || isEditing) && (
            <ContentSdkRichText
              field={fields.Description}
              className="mt-3 text-sm opacity-70 font-[var(--brand-body-font,inherit)]"
              style={{ color: 'var(--brand-fg, #111111)' }}
            />
          )}
          <div className="mt-6">
            <FormRow
              fields={fields}
              isEditing={isEditing}
              submitted={submitted}
              onSubmit={() => setSubmitted(true)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Banner — full-width --brand-primary background
   ──────────────────────────────────────────── */
export const Banner = ({ fields, params, page }: NewsletterSignupProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [submitted, setSubmitted] = useState(false);
  if (!fields) return <NewsletterSignupDefaultComponent />;

  return (
    <div className={cn('component newsletter-signup', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-12 md:py-16"
        style={{
          backgroundColor: 'var(--brand-primary)',
          color: 'var(--brand-primary-foreground)',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 sm:flex-row sm:justify-between sm:px-6">
          <div className="flex-1">
            {(fields.Title?.value || isEditing) && (
              <Text
                field={fields.Title}
                tag="h2"
                className="text-2xl font-bold font-[var(--brand-heading-font,inherit)]"
              />
            )}
            {(fields.Description?.value || isEditing) && (
              <ContentSdkRichText
                field={fields.Description}
                className="mt-2 text-sm opacity-90 font-[var(--brand-body-font,inherit)]"
              />
            )}
          </div>
          <FormRow
            fields={fields}
            isEditing={isEditing}
            submitted={submitted}
            onSubmit={() => setSubmitted(true)}
            inputClassName="border-white/30 bg-white/10 text-white placeholder:text-white/60"
            buttonStyle={{
              backgroundColor: 'var(--brand-primary-foreground)',
              color: 'var(--brand-primary)',
            }}
          />
        </div>
      </section>
    </div>
  );
};

/* ────────────────────────────────────────────
   Compact — just input + button, no heading
   ──────────────────────────────────────────── */
/* Kfmb variant — footer newsletter column: NEWSLETTER heading, email field, orange OK */
export const Kfmb = ({ fields, params, page }: NewsletterSignupProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [submitted, setSubmitted] = useState(false);
  if (!fields) return <NewsletterSignupDefaultComponent />;

  return (
    <div className={cn('component newsletter-signup', styles)} id={RenderingIdentifier}>
      <section className="w-full px-4 py-10" style={{ backgroundColor: 'var(--brand-footer-bg)', color: 'var(--brand-footer-fg)' }}>
        <div className="mx-auto max-w-sm">
          {(fields.Title?.value || isEditing) && (
            <Text
              field={fields.Title}
              tag="h2"
              className="text-sm font-bold uppercase tracking-[0.18em]"
              style={{ fontFamily: 'var(--brand-heading-font)' }}
            />
          )}
          <div className="mt-4">
            <FormRow
              fields={fields}
              isEditing={isEditing}
              submitted={submitted}
              onSubmit={() => setSubmitted(true)}
              inputClassName="border-white/40 bg-white text-[var(--brand-fg)]"
              buttonClassName="rounded-[var(--brand-button-radius,9999px)] px-5"
              buttonStyle={{ backgroundColor: 'var(--brand-accent)', color: 'var(--brand-accent-foreground)' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export const Compact = ({ fields, params, page }: NewsletterSignupProps): JSX.Element => {
  const { styles, RenderingIdentifier } = params;
  const isEditing = page?.mode?.isEditing;
  const [submitted, setSubmitted] = useState(false);
  if (!fields) return <NewsletterSignupDefaultComponent />;

  return (
    <div className={cn('component newsletter-signup', styles)} id={RenderingIdentifier}>
      <section
        className="w-full px-4 py-6"
        style={{ backgroundColor: 'var(--brand-muted, #f5f5f5)' }}
      >
        <div className="mx-auto flex max-w-md items-center justify-center">
          <FormRow
            fields={fields}
            isEditing={isEditing}
            submitted={submitted}
            onSubmit={() => setSubmitted(true)}
          />
        </div>
      </section>
    </div>
  );
};
