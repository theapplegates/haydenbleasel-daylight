import { PrismicRichText } from '@prismicio/react';
import type {
  GroupField,
  ImageFieldImage,
  KeyTextField,
  PrismicDocumentWithUID,
  RichTextField,
} from '@prismicio/types';
import type { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import Activity from '../components/activity';
import Layout from '../components/layout';
import { getPage } from '../utils/prismic';
import { social } from '../utils/social';

export type HomeProps = {
  data: {
    title: KeyTextField;
    description: KeyTextField;
    name: KeyTextField;
    role: KeyTextField;
    photo: ImageFieldImage;
    sections: GroupField<{
      title: KeyTextField;
      content: RichTextField;
    }>;
  };
};

const Home: FC<HomeProps> = ({ data }) => (
  <Layout title={data.title} description={data.description} noSticky noTitle>
    <div className="flex flex-col gap-8">
      {data.photo.url && (
        <div className="flex animate-enter opacity-0">
          <div className="relative">
            <div className="inline-flex overflow-hidden rounded-full">
              <Image
                src={data.photo.url}
                width={64}
                height={64}
                layout="fixed"
                priority
                quality={100}
                alt=""
              />
            </div>
            <Activity />
          </div>
        </div>
      )}
      <div className="animate-enter opacity-0 animation-delay-100">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {data.name}
        </h1>
        <p className="text-md font-normal text-gray-500 dark:text-gray-400">
          {data.role}
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-6 sm:gap-12">
      {data.sections.map((section, index) => (
        <div
          key={index}
          className="flex animate-enter flex-col gap-4 opacity-0"
          style={{ animationDelay: `${(index + 2) * 100}ms` }}
        >
          {section.title && (
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              {section.title}
            </p>
          )}
          <PrismicRichText field={section.content} />
        </div>
      ))}
    </div>
    <div className="-ml-3 flex flex-wrap">
      {social.map((platform, index) => (
        <Link href={platform.url} key={platform.id} passHref>
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            className="animate-enter opacity-0"
            style={{
              animationDelay: `${(data.sections.length + 2 + index) * 100}ms`,
            }}
          >
            <span
              className={`flex p-4 transition-transform hover:-translate-y-1 ${
                platform.invertDark ? 'dark:brightness-0 dark:invert' : ''
              }`}
            >
              <Image
                src={`/social/${platform.id}.svg`}
                width={18}
                height={18}
                layout="fixed"
                quality={100}
                alt={platform.name}
              />
            </span>
          </a>
        </Link>
      ))}
    </div>
  </Layout>
);

export const getStaticProps: GetStaticProps = async () => {
  const { data } = (await getPage('home')) as PrismicDocumentWithUID;

  return {
    props: {
      data,
    },
  };
};

export default Home;
