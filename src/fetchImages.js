import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const perPages = 40;
const key = '29404582-ff8d29a0dc81dbac31eded24e';
let nameSearch = refs.input.value;

async function fetchImages() {
  try {
    const response = await axios.get(
      `${BASE_URL}?=${key}&q=${nameSearch}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPages}&page=${page}`
    );
    const arrayImages = await response.data.hits;

    if (arrayImages.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (arrayImages.length !== 0) {
      refs.buttonLoad.classList.remove('invisible');
    }
    return { arrayImages, totalHits: response.data.totalHits };
  } catch (error) {
    console.log(error);
  }
}

export default fetchImages;
