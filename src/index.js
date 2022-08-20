import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchCountries } from './fetchCountries';
import axios from 'axios';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  btnSubmitEl: document.querySelector('.btn-submit'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('.load-me'),
  totalHitsEl: document.querySelector('.total-hits'),
};

let currentPage = 1;
refs.btnLoadMoreEl.classList.add('hide');
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', onSubmitForm);
refs.btnLoadMoreEl.addEventListener('click', onClickBtnLodeMore);

function onSubmitForm(event) {
  event.preventDefault();
  refs.btnLoadMoreEl.classList.add('hide');
  const searchBox = event.currentTarget.elements.searchBox.value
    .trim()
    .toUpperCase();
  clearGalleryList();
  currentPage = 1;
  convertFetchResults(searchBox, currentPage);
}
function onClickBtnLodeMore() {
  currentPage += 1;
  const searchName = refs.inputEl.value.trim().toUpperCase();
  convertFetchResults(searchName, currentPage);
}
async function convertFetchResults(searchBox, currentPage) {
  try {
    const fetchResult = await fetchPictures(searchBox, currentPage);
    if (currentPage === 1) {
      Notify.info(`Hooray! We found ${fetchResult.totalHits} images.`);
    }
    filterFetchResult(fetchResult);
  } catch (error) {
    console.log(error);
  }
}
function filterFetchResult(fetchResult) {
  if (currentPage === Math.ceil(fetchResult.totalHits / 40)) {
    insertCreatedAnimals(fetchResult.hits);
    refs.btnLoadMoreEl.classList.add('hide');
    Notify.info("We're sorry, but you've reached the end of search results.");
    smoothScrollToBottomPage();
    lightbox.refresh();
    return;
  } else if (fetchResult.total === 0) {
    refs.btnLoadMoreEl.classList.add('hide');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    insertCreatedAnimals(fetchResult.hits);
    refs.btnLoadMoreEl.classList.remove('hide');
    smoothScrollToBottomPage();
    lightbox.refresh();
    return;
  }
}
function clearGalleryList() {
  refs.galleryEl.innerHTML = '';
}

function createOneAnimal(picture) {
  return `
    <div class="photo-card">
    <div class="img-thumb">
    <a class="img-link" href="${picture.largeImageURL}">
    <img src="${picture.webformatURL}" alt="${picture.tags}" title="${picture.tags}" loading="lazy"/></a></div>
    <div class="info">
      <p class="info-item">
        <b>Likes: <br> ${picture.likes}</b></p>
      <p class="info-item">
        <b>Views: <br> ${picture.views}</b></p>
      <p class="info-item">
        <b>Comments: <br> ${picture.comments}</b></p>
      <p class="info-item">
        <b>Downloads: <br> ${picture.downloads}</b></p>
    </div>
    </div>`;
}
function createListAnimals(array) {
  return array.reduce((acc, item) => acc + createOneAnimal(item), '');
}

function insertCreatedAnimals(array) {
  const result = createListAnimals(array);
  refs.galleryEl.insertAdjacentHTML('beforeend', result);
}

function smoothScrollToBottomPage() {
  const galleryRect = refs.galleryEl.getBoundingClientRect();
  window.scrollBy({
    top: galleryRect.height,
    behavior: 'smooth',
  });
}
