import onChange from 'on-change';

const RSS_FEEDBACK = document.querySelector('.feedback');
const RSS_BUTTON = document.querySelector('#rss-btn');
// const RSS_INPUT = document.querySelector('#url-input');
const FEED_CONTAINER = document.querySelector('.feeds');
const POSTS_CONTAINER = document.querySelector('.posts');

const toggleDisabled = (bool) => RSS_BUTTON.disabled = bool;

const rssFormRender = (state, feedback) => {
  RSS_FEEDBACK.textContent = feedback;
  switch (state) {
    case 'invalid':
      RSS_FEEDBACK.setAttribute('class', 'text-danger');
      toggleDisabled(true);
      break;
    case 'waiting':
      RSS_FEEDBACK.setAttribute('class', 'text-success');
      toggleDisabled(false);
      break;
    case 'validation':

      RSS_FEEDBACK.setAttribute('class', 'text-danger');
      toggleDisabled(true);
      break;
    case 'sending':
      RSS_FEEDBACK.setAttribute('class', 'text-warning');
      toggleDisabled(true);
      break;

    default:
      throw new Error('хз что происходит');
  }
};

const feedRender = (feedContent, i18n) => {
  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18n.t('feed');
  feedTitle.setAttribute('class', 'mb-3');
  const title = document.createElement('p');
  title.textContent = feedContent.title;
  FEED_CONTAINER.setAttribute('id', feedContent.id);
  const description = document.createElement('p');
  description.textContent = feedContent.description;
  description.setAttribute('class', 'text-secondary');
  FEED_CONTAINER.append(feedTitle);
  FEED_CONTAINER.append(title);
  FEED_CONTAINER.append(description);
};

const postsRender = (posts, i18n) => {
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  const btnContent = i18n.t('posts.btn');

  const postsList = document.createElement('ul');
  postsList.setAttribute('class', 'list-group');

  const postsLink = posts.map((post) => {
    const link = `<li class="d-flex justify-content-between align-items-center my-2">
    <a href=${post.link} id=${post.id}>${post.title}</a>
    <button class="btn btn-outline-primary">${btnContent}</button>
    </li>`;
    // document.createElement('a');
    // link.setAttribute('href', post.link);
    // link.setAttribute('id', post.id);
    // link.textContent = post.title;
    return link;
  });
  postsList.innerHTML = postsLink.join('');
  POSTS_CONTAINER.append(postsTitle);
  POSTS_CONTAINER.append(postsList);
  // console.log(postsLink);
};

const appWiev = (model, i18n) => onChange(model, (path, value) => {
  // console.log(path);
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
      throw new Error('unknow path');
  }
});

export default appWiev;
