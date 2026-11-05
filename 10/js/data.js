import { getRandomInteger, getRandomArrayElement } from './util.js';

const PHOTOS_COUNT = 25;

const MIN_LIKES = 15;
const MAX_LIKES = 200;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 30;

const MIN_AVATAR = 1;
const MAX_AVATAR = 6;

const DESCRIPTIONS = [
  'Красивое фото',
  'Отличный день',
  'Момент из жизни',
  'Прекрасный вечер',
  'Незабываемый момент'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Максим',
  'София',
  'Кирилл',
  'Алиса',
  'Михаил',
  'Виктория',
  'Егор',
  'Полина'
];


const getRandomMessage = () => {
  const firstMessage = getRandomArrayElement(MESSAGES);

  if (Math.random() < 0.5) {
    return firstMessage;
  }

  let secondMessage = getRandomArrayElement(MESSAGES);

  while (secondMessage === firstMessage) {
    secondMessage = getRandomArrayElement(MESSAGES);
  }

  return `${firstMessage} ${secondMessage}`;
};

let commentId = 1;

const createComment = () => ({
  id: commentId++,
  avatar: `img/avatar-${getRandomInteger(MIN_AVATAR, MAX_AVATAR)}.svg`,
  message: getRandomMessage(),
  name: getRandomArrayElement(NAMES)
});

const createComments = () => {
  const comments = [];
  const commentsCount = getRandomInteger(MIN_COMMENTS, MAX_COMMENTS);

  for (let i = 0; i < commentsCount; i++) {
    comments.push(createComment());
  }

  return comments;
};

const createPhoto = (id) => ({
  id: id,
  url: `photos/${id}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: createComments()
});

const photos = [];

for (let i = 1; i <= PHOTOS_COUNT; i++) {
  photos.push(createPhoto(i));
}

export { photos };
