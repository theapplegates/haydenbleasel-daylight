import { notFound } from 'next/navigation';
import { allBlogs } from 'contentlayer/generated';
import type { ReactNode } from 'react';

import type { ArticleJsonLdProps } from 'next-seo';
import { ArticleJsonLd } from 'next-seo';
import Image from 'next/image';
import TableOfContents from './tableOfContents';
import { Mdx } from '@/components/mdx';
import { getTableOfContents } from '@/lib/tableOfContents';
import BackLink from '@/components/backLink';

type DocPageProps = {
  params?: {
    slug?: string;
  };
};

export const generateStaticParams = (): DocPageProps['params'][] =>
  allBlogs.map((doc) => ({
    slug: doc.slug,
  }));

const DocPage = async ({ params }: DocPageProps): Promise<ReactNode> => {
  const currentPath = params?.slug;
  const doc = allBlogs.find(({ slugAsParams }) => slugAsParams === currentPath);

  if (!doc) {
    notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);
  const images: string[] = [];

  if (doc.image) {
    const imageUrl = new URL(doc.image, process.env.NEXT_PUBLIC_SITE_URL).href;
    images.push(imageUrl);
  }

  return (
    <main className="relative">
      <h1>{doc.title}</h1>
      <p className="mt-4 text-xl">{doc.description}</p>
      {doc.image && (
        <Image
          src={doc.image}
          width={640}
          height={640}
          alt=""
          className="overflow-hidden rounded"
        />
      )}
      <Mdx code={doc.body.code} />
      <TableOfContents toc={toc} />
      <BackLink href="/blog" />
      <ArticleJsonLd
        useAppDir
        url={doc.slug}
        title={doc.title}
        images={images}
        datePublished={doc.date}
        authorName="Hayden Bleasel"
        description={doc.description}
      />
    </main>
  );
};

export default DocPage;
