import * as axios from 'axios';

const buildUrl = (link) => {
  const proxy = 'https://allorigins.hexlet.app/';
  const url = new URL(proxy);
  url.pathname = 'get';
  url.search = `disableCache=true&url=${encodeURIComponent(link)}`;
  return url;
};

const getRssData = (link) => {
  const url = buildUrl(link);
  return axios.get(url).then((response) => response.data);
};

export default getRssData;
