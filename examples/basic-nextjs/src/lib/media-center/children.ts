import client from 'src/lib/sitecore-client';

export type StoryCard = {
  id: string;
  title: string;
  summary: string;
  date: string;
  location: string;
  href: string;
};

type ChildResult = {
  id?: string;
  name?: string;
  url?: { path?: string };
  title?: { value?: string };
  summary?: { value?: string };
  articleSummary?: { value?: string };
  articleDate?: { value?: string };
  eventDate?: { value?: string };
  eventLocation?: { value?: string };
  eventSummary?: { value?: string };
};

const QUERY = `
  query MediaChildren($path: String!, $language: String!) {
    item(path: $path, language: $language) {
      children(first: 12) {
        results {
          id
          name
          url { path }
          title: field(name: "Title") { value }
          summary: field(name: "pageSummary") { value }
          articleSummary: field(name: "ArticleKeyTakeaways") { value }
          articleDate: field(name: "ArticlePublicationDate") { value }
          eventDate: field(name: "EventDate") { value }
          eventLocation: field(name: "EventLocation") { value }
          eventSummary: field(name: "EventSummary") { value }
        }
      }
    }
  }
`;

export async function loadChildStories(path: string, language = 'en'): Promise<StoryCard[]> {
  if (!path) return [];
  try {
    const data = await client.getData<{ item?: { children?: { results?: ChildResult[] } } }>(QUERY, {
      path,
      language,
    });
    return (data.item?.children?.results ?? []).map((child) => ({
      id: child.id || child.name || child.title?.value || path,
      title: child.title?.value || child.name || 'Untitled',
      summary: strip(child.eventSummary?.value || child.articleSummary?.value || child.summary?.value || ''),
      date: child.eventDate?.value || child.articleDate?.value || '',
      location: child.eventLocation?.value || '',
      href: child.url?.path || '#',
    }));
  } catch {
    return [];
  }
}

function strip(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
