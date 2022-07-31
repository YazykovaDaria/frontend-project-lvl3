// import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { string } from 'yup';

const model = {
  rssForm: {
    state: 'filling',
    inputValue: '',
    validationError: '',
  },
};

const isValidateUrl = (url) => {
  const validValues = [model.rssForm.inputValue];
  const urlScheema = string().url().notOneOf(validValues);
  return urlScheema.isValid(url);
};

const form = document.getElementById('rss-form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let { state, inputValue, validationError } = model.rssForm;

  const formData = new FormData(e.target).get('url').trim();
  //разобраться с асинхронностью!!!
  isValidateUrl(formData)
    .then((valid) => {
      //console.log(valid);
      // if (valid) {
      //   state = 'filling';
      // } else {
      //   state = 'failed';
      //   validationError = 'Ссылка должна быть валидным URL';
      // }
      
    });
    inputValue = formData;
 console.log(state, inputValue, validationError);
  // console.log(formData);
});
