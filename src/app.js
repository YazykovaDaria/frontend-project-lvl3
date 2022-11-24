/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import _ from 'lodash';
import appViev from './view';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';

const errorsHandler = (err, i18n, watcher) => {
  console.log(err);
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
      // watcher.rssForm.state = 'invalid';
      // watcher.rssForm.feedbackMessage = err.message;
      errorsHandler(err.message, i18n, watcher);
    });
};

const updatePosts = (link) => {
  // прикрутить рекурсию, придумать как обрабатывать ошибки парсера при пустом инпуте
  // getRssData(link)

  // ('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10')

  // .then((xml) => {
  // console.log(xml.contents);
  const rssContent = parser(xml.contents);
  // console.log(rssContent);
  // const updatedPosts = _.differenceBy(rssContent.posts, watcher.posts, 'link');
  // if (updatedPosts.length > 0) {
  //   const newPosts = updatePosts.map((post) => ({ ...post, id: _.uniqueId('post') }));
  //   watcher.posts = [...watcher.posts, ...newPosts];
  // }
  // console.log(`new: ${updatedPosts.toString()}`);
  // });
};

const app = () => {
  // updatePosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10');

  // setTimeout(() => {
  //   updatePosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10');
  // }, 20000)

  const model = {
    rssForm: {
      state: 'filling',
      feedbackMessage: '',
    },
    feeds: [],
    posts: [],
    modal: {
      visible: false,
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
      container: document.querySelector('#modal'),
      title: document.querySelector('.modal-title'),
      description: document.querySelector('.modal-body'),
      link: document.querySelector('.full-article'),
      btn: document.querySelector('#modal-close'),
    },
  };

  const i18n = i18next.createInstance();
  i18n.init(locale);

  const watcher = appViev(model, elements, i18n);

  //  addFeedAndPosts('https://ru.hexlet.io/lessons.rss', watcher, i18n);
  //   addFeedAndPosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10', watcher, i18n);

  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watcher.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

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
  });

  elements.rssForm.input.addEventListener('input', () => {
    watcher.rssForm.state = 'waiting';
  });

  // elements.posts.list.addEventListener('click', (e) => {
  //   const parent = e.target.closest('li');
  //   const id = parent.getAttribute('id');
  //   const elData = model.posts.filter((post) => post.id === id);
  //   const [data] = elData;
  //   watcher.modal.data = data;
  //   watcher.modal.visible = true;
  //   // console.log(elData);
  // });

  // setTimeout(updatePosts, 5000);
};

export default app;
