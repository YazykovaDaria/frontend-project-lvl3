/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import _ from 'lodash';

const rssFormRender = (state, {
  feedback, btn, form, input,
}) => {
  switch (state) {
    case 'invalid':
      feedback.setAttribute('class', 'text-danger');
      btn.disabled = true;
      input.classList.add('is-invalid');
      break;
    case 'waiting':
      feedback.setAttribute('class', 'text-danger');
      btn.disabled = false;
      break;
    case 'validation':
    case 'sending':
      feedback.setAttribute('class', 'text-danger');
      btn.disabled = true;
      break;
    case 'filling':
      form.reset();
      feedback.setAttribute('class', 'text-success');
      input.classList.remove('is-invalid');
      btn.disabled = false;
      input.focus();
      break;
    default:
      throw new Error(`Unknown state - ${state}`);
  }
};

const feedRender = (feeds, i18n, feedContainer) => {
  feedContainer.innerHTML = '';
  const feedsTitle = document.createElement('h2');
  feedsTitle.textContent = i18n.t('feed');
  feedsTitle.classList.add('mb-3');
  feedContainer.append(feedsTitle);

  feeds.forEach(({ title, id, description }) => {
    const feedTitle = document.createElement('p');
    feedTitle.textContent = title;
    feedContainer.setAttribute('id', id);
    const feedDescription = document.createElement('p');
    feedDescription.textContent = description;
    feedDescription.classList.add('text-secondary');
    feedContainer.append(title);
    feedContainer.append(feedDescription);
  });
};

const postsRender = (posts, i18n, container) => {
  container.innerHTML = '';
  const btnContent = i18n.t('posts.btn');
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  container.prepend(postsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'my-2');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.href = post.link;
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('id', `${post.id}`);
    button.textContent = btnContent;
    li.prepend(a);
    li.append(button);
    ul.append(li);
  });

  container.append(ul);
};

const showFeedback = (message, element) => {
  element.textContent = message;
};

const modalRender = (content, {
  title, description, link,
}) => {
  title.textContent = content.title;
  description.textContent = content.description;
  link.href = content.link;
};

const markedVisitedPost = (postId) => {
  const button = document.getElementById(postId);
  const a = button.parentNode.children[0];
  a.classList.replace('fw-bold', 'fw-normal');
};

const appViev = (model, elements, i18n) => onChange(model, (path, value) => {
  const lastPostId = _.last(Array.from(model.modal.lookedPosts));

  switch (path) {
    case 'rssForm.state':
      rssFormRender(value, elements.rssForm);
      break;
    case 'rssForm.feedbackMessage':
      showFeedback(value, elements.rssForm.feedback);
      break;
    case 'feeds':
      feedRender(value, i18n, elements.feedContainer);
      break;
    case 'posts':
      postsRender(value, i18n, elements.postsContainer);
      break;
    case 'modal.data':
      modalRender(value, elements.modal);
      break;
    case 'modal.lookedPosts':
      markedVisitedPost(lastPostId);
      break;
    default:
      throw new Error(`Unknown path - ${path}`);
  }
});

export default appViev;
