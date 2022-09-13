// import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import _ from 'lodash';
import appWiev from './wiev';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';

const model = {
  rssForm: {
    state: 'filling',
    inputValue: '',
    feedbackMessage: '',
  },
  feed: {},
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
  posts: {
    container: document.querySelector('.posts'),
    title: document.querySelector('.post-title'),
    list: document.querySelector('.list-group'),
  },
  feedContainer: document.querySelector('.feeds'),
  modal: {
    container: document.querySelector('#modal'),
    title: document.querySelector('.modal-title'),
    description: document.querySelector('.modal-body'),
    link: document.querySelector('.full-article'),
    btn: document.querySelector('#modal-close'),
  },
};

i18next.init(locale);
const watchedModel = appWiev(model, elements, i18next);

const errorsHandler = (err, message) => {
  switch (err) {
    case 'parser error':
      model.rssForm.feedbackMessage = i18next.t('rssForm.parser');
      watchedModel.rssForm.state = 'invalid';
      break;
    case 'Network Error':
      model.rssForm.feedbackMessage = i18next.t('rssForm.uploadFail');
      model.rssForm.inputValue = [];
      watchedModel.rssForm.state = 'waiting';
      break;
    case 'ValidationError':
      model.rssForm.feedbackMessage = message;
      watchedModel.rssForm.state = 'invalid';
      break;
    default:
      throw new Error('unknow error');
  }
};

const addFeedAndPosts = (link) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = parser(xml.contents);
      const feed = { ...rssContent.feed, id: _.uniqueId('feed') };
      const posts = rssContent.posts.map((post) => ({ ...post, id: _.uniqueId('post') }));
      watchedModel.feed = feed;
      watchedModel.posts = posts;
      model.rssForm.feedbackMessage = i18next.t('rssForm.uploadSucsses');
      watchedModel.rssForm.state = 'filling';
    })
    .catch((err) => {
      errorsHandler(err.message);
    });
};

const updatePosts = () => {
  //прикрутить рекурсию, придумать как обрабатывать ошибки парсера при пустом инпуте
  getRssData(model.rssForm.inputValue)
  //('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10')

  .then((xml) => {
    //console.log(xml.contents);
    const rssContent = parser(xml.contents);
    //console.log(model.posts, rssContent.posts);
    const updatedPosts = _.differenceBy(rssContent.posts, model.posts, 'link');
    if (updatedPosts.length > 0) {
      const newPosts = updatePosts.map((post) => ({ ...post, id: _.uniqueId('post') }));
      watchedModel.posts = [...model.posts, ...newPosts];
    }
    console.log(`new: ${updatedPosts.toString()}`);
  })
}
// addFeedAndPosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=5');
// setTimeout(updatePosts, 8000);

const app = () => {
  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedModel.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    validateUrl(url, [model.rssForm.inputValue], i18next)
      .then((res) => {
        model.rssForm.feedbackMessage = i18next.t('rssForm.uploading');
        watchedModel.rssForm.state = 'sending';
        model.rssForm.inputValue = res;
        addFeedAndPosts(res);
      })
      .catch((err) => {
        errorsHandler(err.name, err.message);
      });
  });

  elements.rssForm.input.addEventListener('input', () => {
    watchedModel.rssForm.state = 'waiting';
  });

  elements.posts.list.addEventListener('click', (e) => {
    const parent = e.target.closest('li');
    const id = parent.getAttribute('id');
    const elData = model.posts.filter((post) => post.id === id);
    const [data] = elData;
    model.modal.data = data;
    watchedModel.modal.visible = true;
    // console.log(elData);
  });

  setTimeout(updatePosts, 5000);
};

export default app;
