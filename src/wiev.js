import onChange from 'on-change';

const RSS_FEEDBACK = document.querySelector('.feedback');
const RSS_BUTTON = document.querySelector('#rss-btn');
//const RSS_INPUT = document.querySelector('#url-input');
const FEED_CONTAINER = document.querySelector('.feeds');
const POSTS_CONTAINER = document.querySelector('.posts');

const toggleDisabled = (bool) => RSS_BUTTON.disabled = bool;


const wievFeedback = (feedbackMessage) => {
  RSS_FEEDBACK.textContent = feedbackMessage;
  // RSS_INPUT.classList.add('is-invalid');
  // toggleDisabled(true);
};

const rssFormRender = (state, feedback) => {
 console.log(feedback);
  switch (state) {
    case 'invalid':
      wievFeedback(feedback);
      break;
      case 'waiting':
        //toggleDisabled(false);
        wievFeedback(feedback);
        break;
        case 'validation':
          //toggleDisabled(true);
          wievFeedback(feedback);
          break;
case 'sending':
wievFeedback(feedback);
break;

        default:
          throw new Error('хз что происходит')
  }
}

const feedRender = (feedContent, i18n) => {
  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18n.t('feed');
  const title = document.createElement('p');
  title.textContent = feedContent.title;
  FEED_CONTAINER.setAttribute('id', feedContent.id);
  const description = document.createElement('p');
  description.textContent = feedContent.description;
  FEED_CONTAINER.append(feedTitle);
  FEED_CONTAINER.append(title);
  FEED_CONTAINER.append(description);
};

const postsRender = (posts, i18n) => {
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  const btnContent = i18n.t('posts.btn');
  const postsLink = posts.map((post) => {
    const link = `<div>
    <a href=${post.link} id=${post.id}>${post.title}</a>
    <button>${btnContent}</button>
    </div>`;
    // document.createElement('a');
    // link.setAttribute('href', post.link);
    // link.setAttribute('id', post.id);
    // link.textContent = post.title;
    return link;
  })
  POSTS_CONTAINER.innerHTML = postsLink.join('');
POSTS_CONTAINER.prepend(postsTitle);
  console.log(postsLink);
}

const observerModel = (model, i18n) => onChange(model, (path, value) => {
  //console.log('value:', value);
  const { feedbackMessage } = model.rssForm;

  switch (path) {
    case 'rssForm.state':
      rssFormRender(value, feedbackMessage);
      break;
case 'feed':
  feedRender(value, i18n);
break;
case 'posts':
  postsRender(value, i18n);
  break;

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
