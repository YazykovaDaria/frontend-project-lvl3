/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import _ from 'lodash';
import appViev from './view';
import validateUrl from './utils/validation';
import locale from './locales/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';

const updateTime = 5000;

const errorsHandler = (err, i18n, watchedState) => {
  switch (err) {
    case 'parser error':
      watchedState.rssForm.state = 'invalid';
      watchedState.rssForm.feedbackMessage = i18n.t('rssForm.parser');
      break;
    case 'Network Error':
      watchedState.rssForm.state = 'waiting';
      watchedState.rssForm.feedbackMessage = i18n.t('rssForm.uploadFail');
      break;

    default:
      throw new Error('Unknown error');
  }
};

const addFeedAndPosts = (link, watchedState, i18n) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = parser(xml.contents);
      const feed = { ...rssContent.feed, id: _.uniqueId('feed') };
      feed.link = link;
      watchedState.feeds = [feed, ...watchedState.feeds];
      const posts = rssContent.posts.map((post) => ({ ...post, id: _.uniqueId('post'), feedLink: link }));
      watchedState.posts = [...posts, ...watchedState.posts];
      watchedState.rssForm.state = 'filling';
      watchedState.rssForm.feedbackMessage = i18n.t('rssForm.uploadSucsses');
    })
    .catch((err) => {
      errorsHandler(err.message, i18n, watchedState);
    });
};

const updatePosts = (watchedState) => {
  const update = watchedState.feeds.map((feed) => {
    const { link } = feed;
    return getRssData(link)
      .then((xml) => {
        const rssContent = parser(xml.contents);
        const updatedPosts = _.differenceBy(rssContent.posts, watchedState.posts, 'link');
        if (updatedPosts.length > 0) {
          const newPosts = updatedPosts.map((post) => ({ ...post, id: _.uniqueId('post') }));
          watchedState.posts = [...watchedState.posts, ...newPosts];
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  Promise.all(update).finally(setTimeout(() => updatePosts(watchedState), updateTime));
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

  const watchedState = appViev(model, elements, i18n);

  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    if (url === '') {
      watchedState.rssForm.state = 'invalid';
      watchedState.rssForm.feedbackMessage = i18n.t('rssForm.empty');
    } else {
      validateUrl(url, watchedState, i18n)
        .then((link) => {
          watchedState.rssForm.state = 'sending';
          watchedState.rssForm.feedbackMessage = i18n.t('rssForm.uploading');
          addFeedAndPosts(link, watchedState, i18n);
        })
        .catch((err) => {
          watchedState.rssForm.state = 'invalid';
          watchedState.rssForm.feedbackMessage = err.message;
        });
    }
  });

  elements.rssForm.input.addEventListener('input', () => {
    watchedState.rssForm.state = 'waiting';
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const { id } = e.target;
    if (!id) return;
    const elData = model.posts.filter((post) => post.id === id);
    const [data] = elData;
    watchedState.modal.data = data;
    watchedState.modal.lookedPosts.add(id);
  });

  setTimeout(() => updatePosts(watchedState, i18n), updateTime);
};

export default app;
