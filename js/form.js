import { isEscapeKey } from './util.js';

const MAX_HASHTAGS = 5;
const MAX_HASHTAG_LENGTH = 20;
const MAX_COMMENT_LENGTH = 140;

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

const uploadForm = document.querySelector('.img-upload__form');
const uploadInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('.img-upload__cancel');
const hashtagField = uploadForm.querySelector('.text__hashtags');
const commentField = uploadForm.querySelector('.text__description');

const scaleSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleBigger = uploadForm.querySelector('.scale__control--bigger');
const scaleValue = uploadForm.querySelector('.scale__control--value');
const previewImage = uploadForm.querySelector('.img-upload__preview img');

const effectsList = uploadForm.querySelector('.effects__list');
const effectLevel = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');

let currentScale = SCALE_MAX;

const effects = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    filter: '',
  },
  chrome: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'grayscale',
  },
  sepia: {
    min: 0,
    max: 1,
    step: 0.1,
    filter: 'sepia',
  },
  marvin: {
    min: 0,
    max: 100,
    step: 1,
    filter: 'invert',
    unit: '%',
  },
  phobos: {
    min: 0,
    max: 3,
    step: 0.1,
    filter: 'blur',
    unit: 'px',
  },
  heat: {
    min: 1,
    max: 3,
    step: 0.1,
    filter: 'brightness',
  },
};

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

const updateScale = () => {
  scaleValue.value = `${currentScale}%`;
  previewImage.style.transform = `scale(${currentScale / 100})`;
};

const onScaleSmallerClick = () => {
  currentScale = Math.max(SCALE_MIN, currentScale - SCALE_STEP);
  updateScale();
};

const onScaleBiggerClick = () => {
  currentScale = Math.min(SCALE_MAX, currentScale + SCALE_STEP);
  updateScale();
};

const updateEffect = (value) => {
  const selectedEffect = uploadForm.querySelector('.effects__radio:checked').value;
  const effect = effects[selectedEffect];

  if (selectedEffect === 'none') {
    previewImage.style.removeProperty('filter');
    effectLevel.classList.add('hidden');
    effectLevelValue.value = '';
    return;
  }

  effectLevel.classList.remove('hidden');

  const filterValue = effect.unit
    ? `${value}${effect.unit}`
    : value;

  previewImage.style.filter = `${effect.filter}(${filterValue})`;
  effectLevelValue.value = value;
};

const onSliderUpdate = () => {
  const value = effectLevelSlider.noUiSlider.get();
  updateEffect(Number(value));
};

noUiSlider.create(effectLevelSlider, {
  start: 100,
  range: {
    min: 0,
    max: 100,
  },
  step: 1,
  connect: 'lower',
});

effectLevelSlider.noUiSlider.on('update', onSliderUpdate);

const onEffectChange = (evt) => {
  const selectedEffect = evt.target.value;
  const effect = effects[selectedEffect];

  if (selectedEffect === 'none') {
    updateEffect(0);
    return;
  }

  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: effect.min,
      max: effect.max,
    },
    step: effect.step,
  });

  const middleValue = (effect.min + effect.max) / 2;
  effectLevelSlider.noUiSlider.set(middleValue);
};

const resetEffect = () => {
  const noneEffect = uploadForm.querySelector('#effect-none');

  noneEffect.checked = true;
  updateEffect(0);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadForm.reset();
  uploadInput.value = '';
  pristine.reset();

  currentScale = SCALE_MAX;
  updateScale();
  resetEffect();
};

const onUploadInputChange = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const onUploadCancelClick = (evt) => {
  evt.preventDefault();
  closeUploadForm();
};

const onDocumentKeydown = (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  if (
    !uploadOverlay.classList.contains('hidden') &&
    document.activeElement !== hashtagField &&
    document.activeElement !== commentField
  ) {
    closeUploadForm();
  }
};

const onUploadFormSubmit = (evt) => {
  if (!pristine.validate()) {
    evt.preventDefault();
  }
};

scaleSmaller.addEventListener('click', onScaleSmallerClick);
scaleBigger.addEventListener('click', onScaleBiggerClick);

effectsList.addEventListener('change', onEffectChange);

uploadInput.addEventListener('change', onUploadInputChange);
uploadCancel.addEventListener('click', onUploadCancelClick);
document.addEventListener('keydown', onDocumentKeydown);
uploadForm.addEventListener('submit', onUploadFormSubmit);

updateScale();
resetEffect();
