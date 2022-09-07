/* eslint-disable no-param-reassign */
import onChange from 'on-change';

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

const feedRender = (feedContent, i18n, feedContainer) => {
  const feedTitle = document.createElement('h2');
  feedTitle.textContent = i18n.t('feed');
  feedTitle.classList.add('mb-3');
  const title = document.createElement('p');
  title.textContent = feedContent.title;
  feedContainer.setAttribute('id', feedContent.id);
  const description = document.createElement('p');
  description.textContent = feedContent.description;
  description.classList.add('text-secondary');
  feedContainer.append(feedTitle);
  feedContainer.append(title);
  feedContainer.append(description);
};

const postsRender = (posts, i18n, { container, list }) => {
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  const btnContent = i18n.t('posts.btn');

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
  list.innerHTML = postsLink.join('');
  container.append(postsTitle);
  container.append(list);
};

const appWiev = (model, elements, i18n) => onChange(model, (path, value) => {
  const { feedbackMessage } = model.rssForm;

  switch (path) {
    case 'rssForm.state':
      rssFormRender(value, feedbackMessage, elements.rssForm);
      break;
    case 'feed':
      feedRender(value, i18n, elements.feedContainer);
      break;
    case 'posts':
      postsRender(value, i18n, elements.posts);
      break;

    default:
      throw new Error('unknow path');
  }
});

export default appWiev;
