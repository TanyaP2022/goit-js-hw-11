import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
const axios = require('axios').default;
const BASE_URL = 'https://pixabay.com/api/';
const perPages = 40;
const myAPIkey = '29404582-ff8d29a0dc81dbac31eded24e';

const fetchPictures = async (searchBox, page) => {
  const response = await axios.get(
    `${BASE_URL}?key=${myAPIkey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPages}&page=${page}`
  );
  return response.data;
};
export default fetchPictures;
