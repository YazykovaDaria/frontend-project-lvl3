import onChange from 'on-change';

const RSS_FEEDBACK = document.querySelector('.feedback');
const RSS_BUTTON = document.querySelector('#rss-btn');
const RSS_INPUT = document.querySelector('#url-input');

const toggleDisabled = (bool) => RSS_BUTTON.disabled = bool;
//(bool ? RSS_BUTTON.setAttribute('disabled', true) : RSS_BUTTON.removeAttribute('disabled', false));

const wievInvalidRss = (validationMessage) => {
  RSS_FEEDBACK.textContent = validationMessage;
  RSS_INPUT.classList.add('is-invalid');
  toggleDisabled(true);
};

const observerModel = (model, i18n) => onChange(model, (path, value) => {
  //console.log('value:', value);
  const { validationMessage } = model.rssForm;
  switch (path) {
    case 'rssForm.state':
      if (value === 'invalid') wievInvalidRss(validationMessage);
      else if (value === 'waiting') toggleDisabled(false);

    default:
      return 'hi';
  }
  // console.log('Object changed:', ++index);
  // console.log('this:', this);
  // console.log('path:', path);
  //console.log('value:', value);
  // console.log('previousValue:', previousValue);
  // console.log('applyData:', applyData);
});

export default observerModel;
