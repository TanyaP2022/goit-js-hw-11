import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const perPages = 40;
const key = '29404582-ff8d29a0dc81dbac31eded24e';
let currentPage = 1;

const fetchPictures = async (searchQuery, page) => {
  const response = await axios.get(
    `${BASE_URL}?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPages}&page=${currentPage}`
  );
  return response.data;
};
export default fetchPictures;
