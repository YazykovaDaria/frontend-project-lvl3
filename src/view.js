/* eslint-disable no-param-reassign */
import onChange from 'on-change';

const rssFormRender = (state, {
  feedback, btn, form, input,
}) => {
  switch (state) {
    case 'invalid':
      feedback.setAttribute('class', 'text-danger');
      // classList.add('text-danger');
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
      // feedback.classList.add('text-success');
      input.classList.remove('is-invalid');
      btn.disabled = false;
      input.focus();
      break;
    default:
      throw new Error('хз что происходит');
  }
};

const feedRender = (feeds, i18n, feedContainer) => {
 // console.log(feeds)
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
 // console.log(posts);
  container.innerHTML = '';
  // container.textContent = 'posts'
  const btnContent = i18n.t('posts.btn');
  const postsTitle = document.createElement('h2');
  postsTitle.textContent = i18n.t('posts.title');
  container.prepend(postsTitle);

  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'my-2');
    li.setAttribute('id', `${post.id}`);

    const a = document.createElement('a');
    a.href = post.link;
    a.textContent = post.title;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary');
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
// почему модалку не видно?
const modalRender = (content, {
  container, title, description, link,
}) => {
  console.log(content);
  title.textContent = content.title;
  description.textContent = 'just test';
  // content.description;
  link.href = content.link;
  container.setAttribute('style', 'display: block;');
  console.log('hi');
};

const appViev = (model, elements, i18n) => onChange(model, (path, value) => {
  const { data } = model.modal;

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
    case 'modal.visible':
      // console.log(elements.modal);
      modalRender(data, elements.modal);
      break;
    default:
      throw new Error('unknow path');
  }
});

export default appViev;
