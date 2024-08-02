import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';
import Notiflix from 'notiflix';

axios.defaults.headers.common['x-api-key'] =
  'live_cJLI5rsFY8n7l6rjtBXNH8qRttWrLjCPK6Rs4qPLKzBxA8Z0xvsbFiKnPGVqLlcW';

const selectors = {
  breedSelect: document.querySelector('#single'),
  catInfo: document.querySelector('.cat-info'),
  pLoader: document.querySelector('.loader'),
  pError: document.querySelector('.error'),
};

window.addEventListener('load', e => {
  fetchBreeds()
    .then(r => {
      console.log(r.data);
      const catOptions = r.data.map(cat => ({
        text: cat.name,
        value: cat.id,
      }));

      new SlimSelect({
        select: '#single',
        data: catOptions,
      });

      toggleElement(selectors.pLoader);
      toggleElement(selectors.breedSelect);
    })
    .catch(err => {
      console.log(err);
      toggleElement(selectors.pLoader);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    });
});

selectors.breedSelect.addEventListener('change', e => {
  const selectedBreedId = e.target.value;
  toggleElement(selectors.catInfo);
  toggleElement(selectors.pLoader);
  if (selectedBreedId) {
    fetchCatByBreed(selectedBreedId)
      .then(r => {
        selectors.catInfo.innerHTML = '';

        const infoCat = {
          url: r.data[0].url,
          name: r.data[0].breeds[0].name,
          description: r.data[0].breeds[0].description,
          temperament: r.data[0].breeds[0].temperament,
        };

        selectors.catInfo.innerHTML = markupCat(infoCat);
        toggleElement(selectors.pLoader);
        toggleElement(selectors.catInfo);
      })
      .catch(err => {
        console.log(err);
        toggleElement(selectors.pLoader);
        Notiflix.Notify.failure(
          'Oops! Something went wrong! Try reloading the page!'
        );
      });
  }
});

function markupCat({ url, name, description, temperament }) {
  return `<img src="${url}" alt="${name}" width="500" height="500">
    <h1>${name}</h1>
    <p>${description}</p> 
    <p><span>temperament:</span>${temperament}</p>`;
}

function toggleElement(elem) {
  elem.classList.toggle('disabled');
}
