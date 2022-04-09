import * as prismic from '@prismicio/client';
import type { LinkResolverFunction } from '@prismicio/helpers';
import { enableAutoPreviews } from '@prismicio/next';
import type {
  FilledLinkToWebField,
  FilledLinkToDocumentField,
  LinkField,
} from '@prismicio/types';
import type { PreviewData } from 'next';

export const linkResolver: LinkResolverFunction = (document) => {
  if (!document.uid) {
    return '/';
  }

  const routes: Record<string, string> = {
    home: '/',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'case-study': `/blog/${document.uid}`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'work-post': `/blog/${document.uid}`,
  };

  return routes[document.type] || `/${document.uid}`;
};

export const docResolver = (link: LinkField): string => {
  if (link.link_type === 'Document') {
    return linkResolver(link as FilledLinkToDocumentField);
  }

  if (link.link_type === 'Any') {
    return '';
  }

  return (link as FilledLinkToWebField).url;
};

export const getClient = (config?: {
  previewData?: PreviewData | undefined;
  req?: prismic.HttpRequestLike | undefined;
}): prismic.Client => {
  const client = prismic.createClient(
    process.env.NEXT_PUBLIC_PRISMIC_ENDPOINT ?? 'loading',
    {
      fetch,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN ?? '',
    }
  );

  enableAutoPreviews({
    client,
    previewData: config?.previewData,
    req: config?.req,
  });

  return client;
};

export const getPage = async (
  uid: string,
  previewData?: PreviewData
): Promise<unknown> => {
  try {
    const page = await getClient({ previewData }).getByUID(uid, uid);

    return page;
  } catch (error) {
    return null;
  }
};

export const getTemplate = async (
  uid: string,
  type: string,
  previewData?: PreviewData
): Promise<unknown> => {
  try {
    const page = await getClient({ previewData }).getByUID(type, uid);

    return page;
  } catch (error) {
    return null;
  }
};

export const getPages = async (
  type: string,
  previewData?: PreviewData
): Promise<unknown> => {
  try {
    const pages = await getClient({ previewData }).getAllByType(type);

    return pages;
  } catch (error) {
    return null;
  }
};
