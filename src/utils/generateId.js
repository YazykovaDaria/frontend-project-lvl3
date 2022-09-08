import { uniqueId } from 'lodash';

const generateId = (rssData) => {
  const posts = rssData.posts.map((post) => ({ ...post, id: uniqueId('post') }));
  const feed = { ...rssData.feed, id: uniqueId('feed') };
  return { feed, posts };
};

export default generateId;
