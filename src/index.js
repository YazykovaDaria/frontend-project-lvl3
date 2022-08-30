import 'bootstrap/dist/css/bootstrap.min.css';
import observerModel from './wiev';
import validateUrl from './utils/validation';

const RSS_FORM = document.getElementById('rss-form');
const RSS_INPUT = document.querySelector('#url-input');
//console.log(RSS_INPUT);
const model = {
  rssForm: {
    state: 'waiting',
    inputValue: [],
    validationMessage: '',
  },
};

const watchedModel = observerModel(model);

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
      watchedModel.rssForm.validationMessage = err.message;
      watchedModel.rssForm.state = 'invalid';
      //console.log(err.message);
    });
});

RSS_INPUT.addEventListener('input', () => {
  watchedModel.rssForm.state = 'waiting';
})
