/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import _ from 'lodash';
import appViev from './view';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';

const updateTime = 5000;

const errorsHandler = (err, i18n, watcher) => {
  switch (err) {
    case 'parser error':
      watcher.rssForm.state = 'invalid';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.parser');
      break;
    case 'Network Error':
      watcher.rssForm.state = 'waiting';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploadFail');
      break;
    // case 'ValidationError':
    //   watcher.rssForm.state = 'invalid';
    //   watcher.rssForm.feedbackMessage = message;
    //   break;
    default:
      throw new Error('unknow error');
  }
};

const addFeedAndPosts = (link, watcher, i18n) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = parser(xml.contents);
      const feed = { ...rssContent.feed, id: _.uniqueId('feed') };
      feed.link = link;
      watcher.feeds = [feed, ...watcher.feeds];
      const posts = rssContent.posts.map((post) => ({ ...post, id: _.uniqueId('post'), feedLink: link }));
      watcher.posts = [...posts, ...watcher.posts];
      watcher.rssForm.state = 'filling';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploadSucsses');
    })
    .catch((err) => {
      errorsHandler(err.message, i18n, watcher);
    });
};

const updatePosts = (watcher) => {
  const update = watcher.feeds.map((feed) => {
    const { link } = feed;
    return getRssData(link)
      .then((xml) => {
        const rssContent = parser(xml.contents);
        const updatedPosts = _.differenceBy(rssContent.posts, watcher.posts, 'link');
        if (updatedPosts.length > 0) {
          const newPosts = updatedPosts.map((post) => ({ ...post, id: _.uniqueId('post') }));
          watcher.posts = [...watcher.posts, ...newPosts];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  Promise.all(update).finally(setTimeout(() => updatePosts(watcher), updateTime));
};

const app = () => {
  const model = {
    rssForm: {
      state: 'filling',
      feedbackMessage: '',
    },
    feeds: [],
    posts: [],
    modal: {
      lookedPosts: new Set(),
      data: {},
    },
  };

  const elements = {
    rssForm: {
      form: document.getElementById('rss-form'),
      input: document.querySelector('#url-input'),
      feedback: document.querySelector('.feedback'),
      btn: document.querySelector('#rss-btn'),
    },
    feedContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: {
      title: document.querySelector('.modal-title'),
      description: document.querySelector('.modal-body'),
      link: document.querySelector('.full-article'),
    },
  };

  const i18n = i18next.createInstance();
  i18n.init(locale);

  const watcher = appViev(model, elements, i18n);

  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watcher.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    if (url === '') {
      watcher.rssForm.state = 'invalid';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.empty');
    } else {
      validateUrl(url, watcher, i18n)
        .then((link) => {
          watcher.rssForm.state = 'sending';
          watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploading');
          addFeedAndPosts(link, watcher, i18n);
        })
        .catch((err) => {
          watcher.rssForm.state = 'invalid';
          watcher.rssForm.feedbackMessage = err.message;
        });
    }
  });

  elements.rssForm.input.addEventListener('input', () => {
    watcher.rssForm.state = 'waiting';
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const { id } = e.target;
    if (!id) return;
    const elData = model.posts.filter((post) => post.id === id);
    const [data] = elData;
    watcher.modal.data = data;
    watcher.modal.lookedPosts.add(id);
  });

  setTimeout(() => updatePosts(watcher, i18n), updateTime);
};

export default app;
