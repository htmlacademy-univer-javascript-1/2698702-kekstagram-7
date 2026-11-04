import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialCaption = bigPicture.querySelector('.social__caption');
const socialComments = bigPicture.querySelector('.social__comments');
const commentCount = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

let currentComments = [];
let renderedCommentsCount = 0;

const renderComments = (comments) => {
  comments.forEach(({ avatar, name, message }) => {
    const comment = document.createElement('li');
    comment.classList.add('social__comment');

    const avatarImage = document.createElement('img');
    avatarImage.classList.add('social__picture');
    avatarImage.src = avatar;
    avatarImage.alt = name;
    avatarImage.width = 35;
    avatarImage.height = 35;

    const commentText = document.createElement('p');
    commentText.classList.add('social__text');
    commentText.textContent = message;

    comment.append(avatarImage);
    comment.append(commentText);
    socialComments.append(comment);
  });
};

const renderCommentsPortion = () => {
  const nextComments = currentComments.slice(
    renderedCommentsCount,
    renderedCommentsCount + COMMENTS_PER_PORTION
  );

  renderComments(nextComments);

  renderedCommentsCount += nextComments.length;

  commentCount.textContent = `${renderedCommentsCount} из ${currentComments.length} комментариев`;

  if (renderedCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const openBigPicture = (photo) => {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;
  likesCount.textContent = photo.likes;
  commentsCount.textContent = photo.comments.length;
  socialCaption.textContent = photo.description;

  socialComments.innerHTML = '';
  currentComments = photo.comments;
  renderedCommentsCount = 0;

  commentCount.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderCommentsPortion();
};

const onCloseButtonClick = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

closeButton.addEventListener('click', onCloseButtonClick);

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    onCloseButtonClick();
  }
};

document.addEventListener('keydown', onDocumentKeydown);

commentsLoader.addEventListener('click', renderCommentsPortion);

export { openBigPicture };
