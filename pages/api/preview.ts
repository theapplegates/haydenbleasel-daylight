import { setPreviewData, redirectToPreviewURL } from '@prismicio/next';
import type { NextApiHandler } from 'next';
import { linkResolver, getClient } from '../../utils/prismic';

const handler: NextApiHandler = async (req, res) => {
  const client = getClient({ req });
  setPreviewData({ req, res });
  await redirectToPreviewURL({ req, res, client, linkResolver });
};

export default handler;
