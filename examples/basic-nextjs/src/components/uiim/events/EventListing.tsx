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
