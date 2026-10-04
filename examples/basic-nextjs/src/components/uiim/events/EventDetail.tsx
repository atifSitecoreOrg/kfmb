import type { JSX } from 'react';
import type { ComponentProps } from 'lib/component-props';
import {
  DateField,
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Text,
} from '@sitecore-content-sdk/nextjs';

type EventRouteFields = {
  Title?: Field<string>;
  EventDate?: Field<string>;
  EventLocation?: Field<string>;
  EventImage?: ImageField;
  EventSummary?: Field<string>;
  EventContent?: Field<string>;
};

export const Default = ({ params, rendering, page }: ComponentProps): JSX.Element => {
  const fields = (page?.layout?.sitecore?.route?.fields ?? {}) as EventRouteFields;
  const isEditing = page?.mode?.isEditing;
  if (!fields.Title && !fields.EventContent && !isEditing) {
    return (
      <section className="component px-4 py-16">
        <div className="component-content">
          <span className="is-empty-hint">EventDetail</span>
        </div>
      </section>
    );
  }

  return (
    <article className={`component bg-background px-4 py-16 text-foreground ${params.styles ?? ''}`} id={params.RenderingIdentifier || rendering.uid}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {(fields.EventImage?.value?.src || isEditing) && fields.EventImage && (
          <ContentSdkImage field={fields.EventImage} className="aspect-[4/3] w-full rounded-3xl object-cover shadow-[0_16px_50px_rgba(20,16,12,0.1)]" />
        )}
        <div>
          <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">Event</p>
          {(fields.Title?.value || isEditing) && fields.Title && (
            <Text tag="h1" field={fields.Title} className="mt-3 text-4xl tracking-tight md:text-6xl" />
          )}
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {(fields.EventDate?.value || isEditing) && fields.EventDate && (
              <DateField
                field={fields.EventDate}
                tag="time"
                render={(date) =>
                  new Date(String(date)).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                }
              />
            )}
            {(fields.EventLocation?.value || isEditing) && fields.EventLocation && (
              <Text tag="span" field={fields.EventLocation} />
            )}
          </div>
          {(fields.EventSummary?.value || isEditing) && fields.EventSummary && (
            <Text tag="p" field={fields.EventSummary} className="mt-6 text-lg text-muted-foreground" />
          )}
          {(fields.EventContent?.value || isEditing) && fields.EventContent && (
            <ContentSdkRichText field={fields.EventContent} className="prose mt-6 max-w-none" />
          )}
        </div>
      </div>
    </article>
  );
};
