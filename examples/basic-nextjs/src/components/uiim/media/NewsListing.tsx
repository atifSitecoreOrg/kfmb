import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { loadChildStories } from '@/lib/media-center/children';

type ListingFields = {
  Heading?: Field<string>;
  Introduction?: Field<string>;
  SourcePath?: Field<string>;
};

type ListingProps = ComponentProps & { fields?: ListingFields };

const NEWS_PATH = '/sitecore/content/main/main-website/Home/media-center/news';

export const Default = async ({ params, rendering, page, fields }: ListingProps): Promise<JSX.Element> => {
  const language =
    (page?.layout?.sitecore?.context as { language?: string } | undefined)?.language || 'en';
  const stories = await loadChildStories(fields?.SourcePath?.value || NEWS_PATH, language);
  const isEditing = page?.mode?.isEditing;
  return (
    <section className={`component px-4 py-16 text-[var(--brand-fg,#333)] ${params.styles ?? ''}`} style={{ backgroundColor: 'var(--brand-muted, #f4efe4)' }} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto max-w-6xl text-center">
        {fields?.Introduction && (fields.Introduction.value || isEditing) && (
          <Text tag="p" field={fields.Introduction} className="font-[family-name:var(--brand-script-font,cursive)] text-5xl leading-none md:text-6xl" style={{ color: 'var(--brand-accent, #ff8c00)' }} />
        )}
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text tag="h2" field={fields.Heading} className="mt-1 text-3xl font-bold uppercase tracking-[0.14em] sm:text-4xl" style={{ fontFamily: 'var(--brand-heading-font, inherit)', color: 'var(--brand-primary, #09509d)' }} />
        )}
        <ul className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.href} className="block border-2 bg-white p-5 transition-transform duration-200 ease-out active:scale-[0.98] motion-reduce:transition-none" style={{ borderColor: 'var(--brand-accent, #ff8c00)' }}>
                {story.date && <p className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--brand-primary, #09509d)' }}>{story.date}</p>}
                <h3 className="mt-2 text-xl font-bold uppercase tracking-wide" style={{ color: 'var(--brand-primary, #09509d)' }}>{story.title}</h3>
                {story.summary && <p className="mt-3 text-sm leading-6" style={{ color: 'var(--brand-fg, #333)' }}>{story.summary}</p>}
              </a>
            </li>
          ))}
        </ul>
        <a href="/media-center/news" className="mt-8 inline-flex items-center justify-center px-8 py-2.5 text-sm font-semibold text-white rounded-[var(--brand-button-radius,9999px)]" style={{ backgroundColor: 'var(--brand-accent, #ff8c00)' }}>
          Read more
        </a>
      </div>
    </section>
  );
};

export const Kfmb = Default;
