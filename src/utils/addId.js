import { uniqueId } from 'lodash';

const addId = (rssData) => {
  const posts = rssData.posts.map((post) => ({ ...post, id: uniqueId('post') }));
  const feed = { ...rssData.feed, id: uniqueId('feed') };
  return { feed, posts };
};

export default addId;
