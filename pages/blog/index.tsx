import type { GetStaticProps } from 'next';
import type { FC } from 'react';
import type {
  KeyTextField,
  PrismicDocumentWithUID,
  SliceZone,
} from '@prismicio/types';

import { PrismicLink } from '@prismicio/react';
import { format, parseISO } from 'date-fns';
import { useEffect, Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { getPages } from '../../utils/prismic';
import type { Post } from '../../types/post';
import { getDevPosts } from '../../utils/dev';
import Layout from '../../components/layout';
import Search from '../../components/search';
// import { getMediumPosts } from "../../utils/medium";

type BlogProps = {
  posts: (Post & { type: string })[];
};

const PostLink: FC<BlogProps['posts'][number]> = (
  { id, title, date, link },
  index
) => (
  <Fragment key={id}>
    {Boolean(index) && (
      <hr className="my-2 border-t border-gray-100 dark:border-gray-800" />
    )}
    <div className="fill-anchor">
      <PrismicLink href={link}>
        <div className="flex justify-between gap-8">
          <p className="flex-1 text-md text-gray-900 dark:text-white">
            {title}
          </p>
          <p className="flex-0 w-24 text-right text-sm text-gray-500 dark:text-gray-400">
            {format(parseISO(date), 'MMM dd, yyyy')}
          </p>
        </div>
      </PrismicLink>
    </div>
  </Fragment>
);

const sortAlphabetically = (stringA: string, stringB: string) =>
  stringB > stringA ? -1 : 1;

const Blog: FC<BlogProps> = ({ posts }) => {
  const [results, setResults] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('All');

  useEffect(() => {
    const filterPosts = async (term: string) => {
      const Fuse = (
        await import(
          /* webpackChunkName: "fuse" */
          'fuse.js'
        )
      ).default;
      const fuse = new Fuse(posts, {
        keys: ['title', 'date', 'content'],
      });

      const searchResults = fuse.search(term);

      setResults(searchResults.map(({ item }) => item.id));
    };

    if (!search) {
      setResults([]);
      return;
    }

    filterPosts(search).catch((error) => {
      const message =
        error instanceof Error ? error.message : (error as string);

      toast.error(message);
    });
  }, [posts, search]);

  const tabs = new Set<string>();
  posts.forEach((post) => tabs.add(post.type));
  tabs.add('All');

  const filterBySearchAndType = (post: BlogProps['posts'][number]) => {
    const isActiveType = activeTab === 'All' ? true : post.type === activeTab;
    const isSearchMatch = results.length ? results.includes(post.id) : true;

    return isSearchMatch && isActiveType;
  };

  return (
    <Layout title="Blog" description="Posts about code, work and life.">
      <div className="grid gap-8">
        <div className="grid gap-2">
          <div className="space-between flex items-center gap-8">
            <div className="flex flex-1 gap-4">
              {Array.from(tabs)
                .sort(sortAlphabetically)
                .map((tab) => (
                  <div
                    onClick={() => setActiveTab(tab)}
                    onKeyDown={(event) => {
                      if (event.code === 'Space') {
                        event.preventDefault();
                        event.stopPropagation();
                        setActiveTab(tab);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    key={tab}
                  >
                    <span
                      className={`relative whitespace-nowrap text-sm ${
                        tab === activeTab
                          ? 'text-gray-900 after:absolute after:-bottom-[14.5px] after:block after:h-[1px] after:w-full after:bg-gray-900 after:content-[""] dark:text-white dark:after:bg-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {tab}
                    </span>
                  </div>
                ))}
            </div>
            <Search value={search} onChange={setSearch} />
          </div>
          <hr className="border-t border-gray-100 dark:border-gray-800" />
        </div>

        <div>
          {posts
            .filter(filterBySearchAndType)
            .sort((postA: Post, postB: Post) =>
              parseISO(postA.date) > parseISO(postB.date) ? -1 : 1
            )
            .map(PostLink)}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // const mediumPosts = await getMediumPosts();
  const devPosts = await getDevPosts();
  const caseStudies = (await getPages('case-study')) as PrismicDocumentWithUID<{
    title: KeyTextField;
    description: KeyTextField;
    slices: SliceZone;
  }>[];

  const posts: BlogProps['posts'] = [
    // ...mediumPosts,
    ...devPosts.map((post) => ({
      ...post,
      type: 'Code',
    })),
    ...caseStudies.map((caseStudy) => ({
      id: caseStudy.uid,
      title: caseStudy.data.description ?? '',
      date: caseStudy.first_publication_date,
      link: `/blog/work/${caseStudy.uid}`,
      type: 'Work',
    })),
  ];

  return {
    props: {
      posts,
    },
  };
};

export default Blog;
