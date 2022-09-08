const itemData = (item) => {
  const title = item.querySelector('title').textContent;
  const link = item.querySelector('link').textContent;
  const description = item.querySelector('description').textContent;
  return { title, link, description };
};

export default (xml) => {
  const parser = new DOMParser();
  const channel = parser.parseFromString(xml, 'text/xml');
  if (channel.querySelector('parsererror')) {
    throw new Error('parser error');
  }
  const feedItems = Array.from(channel.querySelectorAll('item'))
    .map(itemData);
  return {
    feed: {
      title: channel.querySelector('channel>title').textContent,
      description: channel.querySelector('channel>description').textContent,
    },
    posts: feedItems,
  };
};
