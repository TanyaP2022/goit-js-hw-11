import './css/styles.css';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchImages from './fetchImages';

const refs = {
  input: document.querySelector('input'),
  form: document.querySelector('.search-form'),
  buttonLoad: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
  alert: document.querySelector('.alert'),
};

const BASE_URL = 'https://pixabay.com/api/';

refs.form.addEventListener('submit', onFormSubmit);
refs.buttonLoad.addEventListener('click', onLoadMoreBtn);

let isAlertVisible = false;
let lightbox;
const totalPages = 500;
console.log(totalPages);

refs.buttonLoad.classList.add('invisible');

function onFormSubmit(e) {
  e.preventDefault();

  refs.gallery.innerHTML = '';
  nameSearch = refs.input.value;
  nameSearch;
  refs.buttonLoad.classList.add('invisible');

  fetchImages()
    .then(images => {
      insertMarkup(images);
      currentPage += 1;
    })
    .catch(error => console.log(error));

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}

function onLoadMoreBtn() {
  if (currentPage > totalPages) {
    refs.buttonLoad.classList.add('invisible');
    return toggleAlertPopup();
  }

  nameSearch = refs.input.value;

  fetchImages()
    .then(images => {
      insertMarkup(images);
      currentPage += 1;
    })
    .catch(error => console.log(error));
}

const createMarkup = img => `
  <div class="photo-card">
         <a href="${img.largeImageURL}" class="gallery_link">
          <img class="gallery__image" src="${img.webformatURL}" alt="${img.tags}" width="370px" loading="lazy" />
          </a>
        <div class="info">
              <p class="info-item">
              <b>Likes<br>${img.likes}</b>
              </p>
              <p class="info-item">
              <b>Views<br>${img.views}</b>
              </p>
              <p class="info-item">
              <b>Comments<br>${img.comments}</b>
              </p>
              <p class="info-item">
              <b>Downloads<br>${img.downloads}</b>
              </p>
        </div>
    </div>
`;

function generateMarkup({ arrayImages, totalHits }) {
  if (currentPage === 1) {
    Notiflix.Notify.success(`Hoooray! We found ${totalHits} images!`);
  }
  return arrayImages.reduce((acc, img) => acc + createMarkup(img), '');
}

function insertMarkup(arrayImages) {
  const result = generateMarkup(arrayImages);
  refs.gallery.insertAdjacentHTML('beforeend', result);

  lightbox.refresh();
}

function toggleAlertPopup() {
  if (isAlertVisible) {
    return;
  }
  isAlertVisible = true;
  refs.alert.classList.add('is-visible');
  setTimeout(() => {
    refs.alert.classList.remove('is-visible');
    isAlertVisible = false;
  }, 3000);
}
