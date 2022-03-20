import type { FC } from "react";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { load, trackPageview } from "fathom-client";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import type { JSXMapSerializer, LinkProps } from "@prismicio/react";
import { PrismicProvider, PrismicLink } from "@prismicio/react";
import Link from "next/link";
import { Share } from "react-feather";
import Image from "next/image";
import { client, docResolver, linkResolver } from "../utils/prismic";
import "../styles/globals.css";
import "../styles/dev.css";
import CommandBar from "../components/commandbar";
import Menu from "../components/menu";

export const components: JSXMapSerializer = {
  paragraph: ({ children, key }) => (
    <p
      key={key}
      className="text-normal mb-4 text-md text-gray-900 dark:text-white"
    >
      {children}
    </p>
  ),
  strong: ({ children, key }) => (
    <strong key={key} className="font-semibold">
      {children}
    </strong>
  ),
  image: ({ key, node }) => (
    <div className="mb-4 flex overflow-hidden rounded-sm">
      <Image
        key={key}
        src={node.url}
        alt={node.alt ?? ""}
        width={480}
        height={480 * (node.dimensions.height / node.dimensions.width)}
        className="w-full"
      />
    </div>
  ),
  hyperlink: ({ children, node, key }) => (
    <PrismicLink key={key} href={docResolver(node.data)}>
      <span className="text-gray-900 underline transition-colors hover:text-gray-800 dark:text-white dark:hover:text-gray-100">
        {children}
      </span>
    </PrismicLink>
  ),
  heading1: ({ children, key }) => (
    <h1
      key={key}
      className="mt-8 mb-4 text-xl font-semibold text-gray-900 dark:text-white"
    >
      {children}
    </h1>
  ),
  heading2: ({ children, key }) => (
    <h2
      key={key}
      className="mt-8 mb-4 text-sm font-semibold text-gray-900 dark:text-white sm:text-lg"
    >
      {children}
    </h2>
  ),
  heading3: ({ children, key }) => (
    <h3
      key={key}
      className="mt-8 mb-4 text-xs font-semibold text-gray-900 dark:text-white sm:text-md"
    >
      {children}
    </h3>
  ),
  heading4: ({ children, key }) => (
    <h4
      key={key}
      className="mt-8 mb-4 text-xl font-semibold text-gray-900 dark:text-white sm:text-sm"
    >
      {children}
    </h4>
  ),
  heading5: ({ children, key }) => (
    <h5
      key={key}
      className="mt-8 mb-4 text-lg font-semibold text-gray-900 dark:text-white sm:text-xs"
    >
      {children}
    </h5>
  ),
  heading6: ({ children, key }) => (
    <h6
      key={key}
      className="mt-8 mb-4 text-md font-semibold text-gray-900 dark:text-white sm:text-xl"
    >
      {children}
    </h6>
  ),
  list: ({ children, key }) => (
    <ul key={key} className="mb-4 list-inside list-disc pl-0">
      {children}
    </ul>
  ),
  oList: ({ children, key }) => (
    <ul key={key} className="mb-4 list-inside list-decimal pl-0">
      {children}
    </ul>
  ),
  listItem: ({ children, key }) => (
    <li
      key={key}
      className="pl-8 -indent-[1.4rem] text-md text-gray-900 dark:text-white"
    >
      {children}
    </li>
  ),
  oListItem: ({ children, key }) => (
    <li
      key={key}
      className="pl-8 -indent-[1.4rem] text-md text-gray-900 dark:text-white"
    >
      {children}
    </li>
  ),
  embed: ({ node, key }) => {
    if (!node.oembed.html) {
      return undefined;
    }

    if (node.oembed.type === "video") {
      return (
        <div
          key={key}
          className="contains-video mb-4 flex aspect-video overflow-hidden rounded-sm"
          // eslint-disable-next-line react/no-danger, @typescript-eslint/naming-convention
          dangerouslySetInnerHTML={{ __html: node.oembed.html }}
        />
      );
    }

    return (
      <div
        key={key}
        className="mb-4"
        // eslint-disable-next-line react/no-danger, @typescript-eslint/naming-convention
        dangerouslySetInnerHTML={{ __html: node.oembed.html }}
      />
    );
  },
};

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { events, asPath } = useRouter();

  useEffect(() => {
    load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID ?? "", {
      includedDomains: [
        new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "").hostname,
      ],
      url: process.env.NEXT_PUBLIC_ANALYTICS_URL,
    });

    const onRouteChangeComplete = () => trackPageview();

    events.on("routeChangeComplete", onRouteChangeComplete);

    onRouteChangeComplete();

    return () => {
      events.off("routeChangeComplete", onRouteChangeComplete);
    };
  }, [events]);

  const internalLinkComponent = ({
    children,
    href,
    className = "",
    ...props
  }: LinkProps & { className?: string }) => {
    const active = asPath === href;

    return (
      <Link href={href} passHref>
        <a
          href={href}
          className={`text-md font-normal transition-all ${
            active
              ? "text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-500"
              : "text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500"
          } ${className}`}
          {...props}
        >
          {children}
        </a>
      </Link>
    );
  };

  const externalLinkComponent = ({
    children,
    href,
    className = "",
    ...props
  }: LinkProps & { className?: string }) => (
    <Link href={href}>
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline items-center gap-2 text-md font-normal text-gray-500 transition-all hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500 ${className}`}
      >
        {children}
        {typeof children === "string" && (
          <div className="text-gray-400 dark:text-gray-600">
            <Share size={16} />
          </div>
        )}
      </a>
    </Link>
  );

  return (
    <CommandBar>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />

        <meta name="application-name" content="Hayden Bleasel" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hayden Bleasel" />

        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F5F5F9" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#F5F5F9" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#F5F5F9" />
      </Head>
      <PrismicProvider
        linkResolver={linkResolver}
        internalLinkComponent={internalLinkComponent}
        externalLinkComponent={externalLinkComponent}
        client={client}
        richTextComponents={components}
      >
        <Component {...pageProps} />
      </PrismicProvider>
      <Menu />
      <Toaster
        toastOptions={{
          duration: 5000,
          position: "bottom-right",
        }}
      />
    </CommandBar>
  );
};

export default App;
