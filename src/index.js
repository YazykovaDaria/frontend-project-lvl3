import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import observerModel from './wiev';
import validateUrl from './utils/validation';
import locale from './utils/locales';

const RSS_FORM = document.getElementById('rss-form');
const RSS_INPUT = document.querySelector('#url-input');

const model = {
  rssForm: {
    state: 'waiting',
    inputValue: [],
    validationMessage: '',
  },
};

i18next.init(locale);



//console.log(i18next.t('invalidUrl'));
// i18next.init(messages)
// .then((i) => console.log(i.t('invalidUrl')))
//i18n.then((i) => console.log(i))

const watchedModel = observerModel(model, i18next);

RSS_FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  watchedModel.rssForm.state = 'validation';
  const url = new FormData(e.target).get('url').trim();

  validateUrl(url, model.rssForm.inputValue)
    .then((res) => {
      watchedModel.rssForm.inputValue = [res];
      //watchedModel.rssForm.validationMessage = 'RSS успешно загружен'
      //console.log(res);
    })
    .catch((err) => {
      // watchedModel.rssForm.validationMessage = err.message;
      watchedModel.rssForm.state = 'invalid';
      console.log(err);
    });
});

RSS_INPUT.addEventListener('input', () => {
  watchedModel.rssForm.state = 'waiting';
})
