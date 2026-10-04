import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { loadChildStories } from '@/lib/media-center/children';

type ListingFields = {
  Heading?: Field<string>;
  SourcePath?: Field<string>;
};

type ListingProps = ComponentProps & { fields?: ListingFields };

const EVENTS_PATH = '/sitecore/content/main/main-website/Home/media-center/events';

export const Default = async ({ params, rendering, page, fields }: ListingProps): Promise<JSX.Element> => {
  const language =
    (page?.layout?.sitecore?.context as { language?: string } | undefined)?.language || 'en';
  const stories = await loadChildStories(fields?.SourcePath?.value || EVENTS_PATH, language);
  const isEditing = page?.mode?.isEditing;
  return (
    <section className={`component bg-background px-4 py-16 text-foreground ${params.styles ?? ''}`} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto max-w-6xl">
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text tag="h1" field={fields.Heading} className="text-4xl tracking-tight md:text-5xl" />
        )}
        <ul className="mt-8 grid gap-5">
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.href} className="grid gap-3 rounded-2xl bg-card p-6 shadow-[0_12px_40px_rgba(20,16,12,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none md:grid-cols-[180px_minmax(0,1fr)]">
                <div>
                  {story.date && <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{story.date}</p>}
                  {story.location && <p className="mt-2 text-sm">{story.location}</p>}
                </div>
                <div>
                  <h2 className="text-2xl tracking-tight">{story.title}</h2>
                  {story.summary && <p className="mt-3 text-muted-foreground">{story.summary}</p>}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export const Kfmb = async ({ params, rendering, page, fields }: ListingProps): Promise<JSX.Element> => {
  const language =
    (page?.layout?.sitecore?.context as { language?: string } | undefined)?.language || 'en';
  const stories = await loadChildStories(fields?.SourcePath?.value || EVENTS_PATH, language);
  const isEditing = page?.mode?.isEditing;
  return (
    <section
      className={`component px-4 py-16 ${params.styles ?? ''}`}
      style={{ backgroundColor: 'var(--brand-bg)' }}
      id={params.RenderingIdentifier || rendering.uid}
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-[family-name:var(--brand-script-font,cursive)] text-6xl leading-none" style={{ color: 'var(--brand-highlight)' }}>
          Events
        </p>
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text
            tag="h1"
            field={fields.Heading}
            className="-mt-2 text-3xl font-bold uppercase tracking-[0.14em]"
            style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}
          />
        )}
        <ul className="mt-10 space-y-4 text-left">
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.href} className="block border bg-white px-6 py-5" style={{ borderColor: 'var(--brand-border)' }}>
                {story.date && <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--brand-accent)' }}>{story.date}</p>}
                <h2 className="mt-2 text-xl font-bold uppercase tracking-wide" style={{ color: 'var(--brand-primary)', fontFamily: 'var(--brand-heading-font)' }}>{story.title}</h2>
                {story.location && <p className="mt-2 text-sm" style={{ color: 'var(--brand-muted-foreground)' }}>{story.location}</p>}
                {story.summary && <p className="mt-3 text-sm leading-6" style={{ color: 'var(--brand-fg)' }}>{story.summary}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
