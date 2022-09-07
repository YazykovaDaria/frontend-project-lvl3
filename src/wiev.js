/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const FEED_CONTAINER = document.querySelector('.feeds');
const POSTS_CONTAINER = document.querySelector('.posts');

const rssFormRender = (state, feedbackMessage, {
  feedback, btn, form, input,
}) => {
  feedback.textContent = feedbackMessage;
  switch (state) {
    case 'invalid':
      feedback.classList.add('text-danger');
      btn.disabled = true;
      input.classList.add('is-invalid');
      break;
    case 'waiting':
      feedback.classList.add('text-danger');
      btn.disabled = false;
      break;
    case 'validation':
    case 'sending':
      feedback.classList.add('text-danger');
      btn.disabled = true;
      break;
    // case 'sending':
    //   feedback.classList.add('text-danger');
    //   btn.disabled = true;
    //   break;
    case 'filling':
      form.reset();
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      btn.disabled = false;
      input.focus();
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

const appWiev = (model, elements, i18n) => onChange(model, (path, value) => {
  // console.log(elements);
  const { feedbackMessage } = model.rssForm;

  switch (path) {
    case 'rssForm.state':
      rssFormRender(value, feedbackMessage, elements.rssForm);
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
