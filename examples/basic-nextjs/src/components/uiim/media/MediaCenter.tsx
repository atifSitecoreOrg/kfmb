import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import type { Field } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { loadChildStories, type StoryCard } from '@/lib/media-center/children';

type MediaFields = {
  Heading?: Field<string>;
  Introduction?: Field<string>;
  NewsPath?: Field<string>;
  EventsPath?: Field<string>;
};

type MediaProps = ComponentProps & { fields?: MediaFields };

const NEWS_PATH = '/sitecore/content/main/main-website/Home/media-center/news';
const EVENTS_PATH = '/sitecore/content/main/main-website/Home/media-center/events';

function StoryGrid({ stories }: { stories: StoryCard[] }): JSX.Element {
  return (
    <ul className="mt-6 grid gap-5 md:grid-cols-3">
      {stories.map((story) => (
        <li key={story.id}>
          <a
            href={story.href}
            className="flex h-full flex-col rounded-2xl bg-card p-5 text-card-foreground shadow-[0_12px_40px_rgba(20,16,12,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none"
          >
            {story.date && <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{story.date}</p>}
            <h3 className="mt-2 text-xl tracking-tight">{story.title}</h3>
            {story.location && <p className="mt-2 text-sm text-muted-foreground">{story.location}</p>}
            {story.summary && <p className="mt-3 text-sm text-muted-foreground">{story.summary}</p>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export const Default = async ({ params, rendering, page, fields }: MediaProps): Promise<JSX.Element> => {
  const language =
    (page?.layout?.sitecore?.context as { language?: string } | undefined)?.language || 'en';
  const news = await loadChildStories(fields?.NewsPath?.value || NEWS_PATH, language);
  const events = await loadChildStories(fields?.EventsPath?.value || EVENTS_PATH, language);
  const [featured, ...rest] = news;
  const isEditing = page?.mode?.isEditing;

  return (
    <section className={`component bg-background px-4 py-16 text-foreground ${params.styles ?? ''}`} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto max-w-6xl">
        <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Media center</p>
        {fields?.Heading && (fields.Heading.value || isEditing) && (
          <Text tag="h1" field={fields.Heading} className="mt-3 text-4xl tracking-tight md:text-6xl" />
        )}
        {fields?.Introduction && (fields.Introduction.value || isEditing) && (
          <Text tag="p" field={fields.Introduction} className="mt-4 max-w-2xl text-lg text-muted-foreground" />
        )}
        {featured && (
          <a href={featured.href} className="mt-10 block rounded-3xl bg-primary px-8 py-10 text-primary-foreground shadow-[0_16px_50px_rgba(20,16,12,0.12)]">
            <p className="text-sm uppercase tracking-[0.16em] opacity-80">Featured story</p>
            <h2 className="mt-3 max-w-3xl text-3xl tracking-tight md:text-5xl">{featured.title}</h2>
            {featured.summary && <p className="mt-4 max-w-2xl text-lg opacity-90">{featured.summary}</p>}
          </a>
        )}
        <div className="mt-14">
          <h2 className="text-2xl tracking-tight">Latest news</h2>
          {rest.length > 0 ? <StoryGrid stories={rest} /> : <p className="mt-4 text-muted-foreground">News stories will appear here.</p>}
        </div>
        <div className="mt-14">
          <h2 className="text-2xl tracking-tight">Upcoming events</h2>
          {events.length > 0 ? <StoryGrid stories={events} /> : <p className="mt-4 text-muted-foreground">Events will appear here.</p>}
        </div>
      </div>
    </section>
  );
};
