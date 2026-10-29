import { openBigPicture } from './big-picture.js';

const picturesList = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createPicture = (photo) => {
  const picture = pictureTemplate.cloneNode(true);

  const image = picture.querySelector('.picture__img');
  const likes = picture.querySelector('.picture__likes');
  const comments = picture.querySelector('.picture__comments');

  image.src = photo.url;
  image.alt = photo.description;
  likes.textContent = photo.likes;
  comments.textContent = photo.comments.length;

  picture.addEventListener('click', () => {
    openBigPicture(photo);
  });

  return picture;
};

const renderPictures = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const picture = createPicture(photo);
    fragment.appendChild(picture);
  });

  picturesList.appendChild(fragment);
};

export {renderPictures};
