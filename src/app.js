// import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import appWiev from './wiev';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';
import generateId from './utils/generateId';

const model = {
  rssForm: {
    state: 'filling',
    inputValue: [],
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

const addFeedAndPosts = (link) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = generateId(parser(xml.contents));
      watchedModel.feed = rssContent.feed;
      watchedModel.posts = rssContent.posts;
      model.rssForm.feedbackMessage = i18next.t('rssForm.uploadSucsses');
      watchedModel.rssForm.state = 'filling';
    })
    .catch((err) => {
      //console.log(`error: ${err.message}`);
      const { message } = err;
      if (message === 'parser error') {
        model.rssForm.feedbackMessage = i18next.t('rssForm.parser');
        watchedModel.rssForm.state = 'waiting';
      } else if (message === 'Network Error') {
        model.rssForm.feedbackMessage = i18next.t('rssForm.uploadFail');
        model.rssForm.inputValue = [];
        watchedModel.rssForm.state = 'waiting';
      }
    });
};

addFeedAndPosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10');

const app = () => {
  elements.rssForm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedModel.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    validateUrl(url, model.rssForm.inputValue, i18next)
      .then((res) => {
        model.rssForm.feedbackMessage = i18next.t('rssForm.uploading');
        watchedModel.rssForm.state = 'sending';
        model.rssForm.inputValue = [res];
        addFeedAndPosts(res);
      })
      .catch((err) => {
        model.rssForm.feedbackMessage = err.message;
        watchedModel.rssForm.state = 'invalid';
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
    //console.log(elData);
  })
};

export default app;
