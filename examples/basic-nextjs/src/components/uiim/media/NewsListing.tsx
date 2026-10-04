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

const NEWS_PATH = '/sitecore/content/main/main-website/Home/media-center/news';

export const Default = async ({ params, rendering, page, fields }: ListingProps): Promise<JSX.Element> => {
  const language =
    (page?.layout?.sitecore?.context as { language?: string } | undefined)?.language || 'en';
  const stories = await loadChildStories(fields?.SourcePath?.value || NEWS_PATH, language);
  const isEditing = page?.mode?.isEditing;
  return (
    <section className={`component px-4 py-16 text-[var(--brand-fg,#333)] ${params.styles ?? ''}`} style={{ backgroundColor: 'var(--brand-muted, #f4efe4)' }} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto max-w-6xl">
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text tag="h2" field={fields.Heading} className="text-center text-4xl font-bold uppercase tracking-wide" style={{ fontFamily: 'var(--brand-heading-font, inherit)', color: 'var(--brand-primary, #09509d)' }} />
        )}
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id}>
              <a href={story.href} className="block border-2 bg-white p-6 transition-transform duration-200 ease-out active:scale-[0.98] motion-reduce:transition-none" style={{ borderColor: 'var(--brand-accent, #ff8c00)' }}>
                {story.date && <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{story.date}</p>}
                <h2 className="mt-2 text-2xl tracking-tight">{story.title}</h2>
                {story.summary && <p className="mt-3 text-muted-foreground">{story.summary}</p>}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
