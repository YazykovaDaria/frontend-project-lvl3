// import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import observerModel from './wiev';
import validateUrl from './utils/validation';
import locale from './utils/locales';
import getRssData from './utils/getRssData';
import parser from './utils/parserRss';
import addId from './utils/addId';

const RSS_FORM = document.getElementById('rss-form');
const RSS_INPUT = document.querySelector('#url-input');

const model = {
  rssForm: {
    state: 'waiting',
    inputValue: [],
    validationMessage: '',
  },
  feedContent: {},
};

i18next.init(locale);
const watchedModel = observerModel(model, i18next);
//console.log(i18next.t('rssForm.sucsses'));
const addRss = (link) => {
  getRssData(link)
    .then((xml) => {
      const rssContent = addId(parser(xml.contents));
      watchedModel.feedContent = rssContent;
      watchedModel.validationMessage = i18next.t('rssForm.sucsses');
      console.log(model);
    })
    .catch((err) => {
      console.log(err);
    });
};

const app = () => {
  RSS_FORM.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedModel.rssForm.state = 'validation';
    const url = new FormData(e.target).get('url').trim();

    validateUrl(url, model.rssForm.inputValue, i18next)
      .then((res) => {
        watchedModel.rssForm.inputValue = [res];
        addRss(res);
        // .then((data) => console.log(data))
        // console.log(rssData);
      // watchedModel.rssForm.validationMessage = 'RSS успешно загружен'
      // console.log(res);
      })
      .catch((err) => {
        watchedModel.rssForm.validationMessage = err.message;
        watchedModel.rssForm.state = 'invalid';
        console.log(err);
      });
  });

  RSS_INPUT.addEventListener('input', () => {
    watchedModel.rssForm.state = 'waiting';
  });
};

export default app;
