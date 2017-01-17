// @codekit-prepend 'tokens.js';

const url = `https://api.unsplash.com/photos?per_page=30&order_by=latest&client_id=${authToken}`;
const random = Math.floor(Math.random() * 30) + 1;
const main = document.querySelector('main');
const download = document.querySelector('#download');

fetch(url)
  .then(blob => blob.json())
  .then(function randomImage(data) {
    main.style.backgroundImage = `url(${data[random].urls.regular})`;
    download.href = data[random].urls.raw;
  });
