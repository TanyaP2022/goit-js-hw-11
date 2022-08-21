import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchPictures from './fetchPictures';

const refs = {
  formEl: document.querySelector('.search-form'),
  inputEl: document.querySelector('input'),
  btnSubmitEl: document.querySelector('button'),
  galleryEl: document.querySelector('.gallery'),
  btnLoadMoreEl: document.querySelector('.load-more'),
  totalHitsEl: document.querySelector('.total-hits'),
};

refs.btnLoadMoreEl.classList.add('hide');
const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
let currentPage = 1;

refs.formEl.addEventListener('submit', onSubmitForm);
refs.btnLoadMoreEl.addEventListener('click', onClickBtnLodeMore);

function createOneAnimal(picture) {
  return `
    <div class="photo-card">
    <div class="img-thumb">
    <a class="img-link" href="${picture.largeImageURL}">
    <img src="${picture.webformatURL}" alt="${picture.tags}" title="${picture.tags}" loading="lazy"/></a></div>
    <div class="info">
      <p class="info-item">
        <b>Likes: <span class="info-span"> ${picture.likes}</span></b></p>
      <p class="info-item">
        <b>Views: <span class="info-span"> ${picture.views}</span></b></p>
      <p class="info-item">
        <b>Comments: <span class="info-span"> ${picture.comments}</span></b></p>
      <p class="info-item">
        <b>Downloads: <span class="info-span"> ${picture.downloads}</span></b></p>
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
    top: 0,
    behavior: 'smooth',
  });
}

function onSubmitForm(event) {
  event.preventDefault();
  refs.btnLoadMoreEl.classList.add('hide');

  const searchName = event.currentTarget.elements.searchQuery.value

    .trim()
    .toUpperCase();
  clearGalleryList();
  convertFetchResults(searchName);
  resetPage();
}
function onClickBtnLodeMore() {
  currentPage += 1;
  const searchName = refs.inputEl.value.trim().toUpperCase();
  convertFetchResults(searchName, currentPage);
}
async function convertFetchResults(searchQuery, currentPage) {
  try {
    const fetchResult = await fetchPictures(searchQuery, currentPage);
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
function resetPage() {
  page = 1;
}
