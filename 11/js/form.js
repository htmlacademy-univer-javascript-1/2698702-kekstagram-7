import { isEscapeKey } from './util.js';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('.img-upload__cancel');
const uploadSubmitButton = uploadForm.querySelector('.img-upload__submit');
const hashtagField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');

let messageElement = null;
let isSending = false;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__item--invalid',
  successClass: 'img-upload__item--valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__error',
});

const getHashtags = (value) => value.trim().split(/\s+/).filter(Boolean);

const validateHashtagsCount = (value) =>
  getHashtags(value).length <= MAX_HASHTAGS;

const validateHashtagsFormat = (value) =>
  getHashtags(value).every((hashtag) =>
    new RegExp(`^#[a-zа-яё0-9]{1,${MAX_HASHTAG_LENGTH - 1}}$`, 'i').test(hashtag)
  );

const validateHashtagsUnique = (value) => {
  const hashtags = getHashtags(value).map((hashtag) => hashtag.toLowerCase());

  return hashtags.length === new Set(hashtags).size;
};

pristine.addValidator(
  hashtagField,
  validateHashtagsCount,
  'Нельзя указать больше пяти хэштегов'
);

pristine.addValidator(
  hashtagField,
  validateHashtagsFormat,
  'Хэштег должен начинаться с # и содержать только буквы и цифры. Максимум 20 символов'
);

pristine.addValidator(
  hashtagField,
  validateHashtagsUnique,
  'Хэштеги не должны повторяться'
);

pristine.addValidator(
  commentField,
  (value) => value.length <= MAX_COMMENT_LENGTH,
  'Комментарий не должен превышать 140 символов'
);

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();
  uploadInput.value = '';
  pristine.reset();
};

const removeMessage = () => {
  if (messageElement) {
    messageElement.remove();
    messageElement = null;
  }
};

const showMessage = (templateId) => {
  removeMessage();

  const template = document.querySelector(`#${templateId}`);
  messageElement = template.content.firstElementChild.cloneNode(true);

  document.body.append(messageElement);

  const messageButton = messageElement.querySelector('button');

  messageButton.addEventListener('click', removeMessage);
  messageElement.addEventListener('click', (evt) => {
    if (evt.target === messageElement) {
      removeMessage();
    }
  });
};

const onUploadInputChange = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const onUploadCancelClick = (evt) => {
  evt.preventDefault();

  if (!isSending) {
    closeUploadForm();
  }
};

const onDocumentKeydown = (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  if (messageElement) {
    removeMessage();
    evt.stopImmediatePropagation();
    return;
  }

  if (
    !isSending &&
    !uploadOverlay.classList.contains('hidden') &&
    document.activeElement !== hashtagField &&
    document.activeElement !== commentField
  ) {
    closeUploadForm();
  }
};

const onUploadFormSubmit = async (evt) => {
  evt.preventDefault();

  if (isSending || !pristine.validate()) {
    return;
  }

  isSending = true;
  uploadSubmitButton.disabled = true;

  const loadingTemplate = document.querySelector('#messages');
  const loadingMessage = loadingTemplate.content.firstElementChild.cloneNode(true);

  document.body.append(loadingMessage);

  try {
    const response = await fetch(uploadForm.action, {
      method: 'POST',
      body: new FormData(uploadForm),
    });

    if (!response.ok) {
      throw new Error('Ошибка отправки изображения');
    }

    closeUploadForm();
    showMessage('success');
  } catch (err) {
    showMessage('error');
  } finally {
    loadingMessage.remove();
    isSending = false;
    uploadSubmitButton.disabled = false;
  }
};

uploadInput.addEventListener('change', onUploadInputChange);
uploadCancel.addEventListener('click', onUploadCancelClick);
document.addEventListener('keydown', onDocumentKeydown);
uploadForm.addEventListener('submit', onUploadFormSubmit);
