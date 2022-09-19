/* eslint-disable no-param-reassign */
import i18next from 'i18next';
import _ from 'lodash';
import appViev from './view';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';

//переделать, сейчас надо пробрасывать model через addFeedandPosts
const errorsHandler = (err, i18n, watcher, message, model) => {
 console.log(err);
  switch (err) {
    case 'parser error':
      watcher.rssForm.state = 'invalid';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.parser');
      break;
    case 'Network Error':
      watcher.rssForm.state = 'waiting';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploadFail');
      model.rssForm.inputValues.pop();
      break;
    case 'ValidationError':
      watcher.rssForm.state = 'invalid';
      watcher.rssForm.feedbackMessage = message;
      break;
    default:
      throw new Error('unknow error');
  }
};

const addFeedAndPosts = (link, watcher, i18n) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = parser(xml.contents);
      const feed = { ...rssContent.feed, id: _.uniqueId('feed') };
      //watcher.feeds.push(feed)
      watcher.feeds = [feed, ...watcher.feeds];

      const posts = rssContent.posts.map((post) => ({ ...post, id: _.uniqueId('post'), feedLink: link }));
      watcher.posts = [...posts, ...watcher.posts];
      //.push(posts);
      watcher.rssForm.state = 'filling';
      watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploadSucsses');
    })
    .catch((err) => {
      errorsHandler(err.message, i18n, watcher);
    });
};

const updatePosts = () => {
  // прикрутить рекурсию, придумать как обрабатывать ошибки парсера при пустом инпуте
  getRssData(watcher.rssForm.inputValues)
  // ('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10')

    .then((xml) => {
    // console.log(xml.contents);
      const rssContent = parser(xml.contents);
      // console.log(watcher.posts, rssContent.posts);
      const updatedPosts = _.differenceBy(rssContent.posts, watcher.posts, 'link');
      if (updatedPosts.length > 0) {
        const newPosts = updatePosts.map((post) => ({ ...post, id: _.uniqueId('post') }));
        watcher.posts = [...watcher.posts, ...newPosts];
      }
      console.log(`new: ${updatedPosts.toString()}`);
    });
};

const app = () => {
  const model = {
    rssForm: {
      state: 'filling',
      inputValues: [],
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

 addFeedAndPosts('https://ru.hexlet.io/lessons.rss', watcher, i18n);
  addFeedAndPosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10', watcher, i18n);


  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watcher.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    validateUrl(url, watcher.rssForm.inputValues, i18n)
      .then((link) => {
        watcher.rssForm.state = 'sending';
        watcher.rssForm.feedbackMessage = i18n.t('rssForm.uploading');
        model.rssForm.inputValues.push(link);
       addFeedAndPosts(link, watcher, i18n);
      })
      .catch((err) => {
        errorsHandler(err.name, i18n, watcher, err.message, model);
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
