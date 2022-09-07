// import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import appWiev from './wiev';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';
import addId from './utils/addId';


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
  data: [],
},
};

const elements = {
  rssForm: {
    form: document.getElementById('rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    btn: document.querySelector('#rss-btn'),
  },
  postsContainer: document.querySelector('.list-group'),
  feedContainer: document.querySelector('.feeds'),
};

i18next.init(locale);
const watchedModel = appWiev(model, elements, i18next);

const addFeedAndPosts = (link) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = addId(parser(xml.contents));
      watchedModel.feed = rssContent.feed;
      watchedModel.posts = rssContent.posts;
      model.rssForm.feedbackMessage = i18next.t('rssForm.uploadSucsses');
      watchedModel.rssForm.state = 'filling';
    })
    .catch((err) => {
      console.log(err);
    });
};

//addFeedAndPosts('http://lorem-rss.herokuapp.com/feed?unit=second&interval=10');

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
        // console.log(err);
      });
  });

  elements.rssForm.input.addEventListener('input', () => {
    watchedModel.rssForm.state = 'waiting';
  });
};

export default app;
