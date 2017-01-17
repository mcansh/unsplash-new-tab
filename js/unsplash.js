// @codekit-prepend 'tokens.js';

const url = `https://api.unsplash.com/photos?per_page=30&order_by=latest&client_id=${authToken}`;
const random = Math.floor(Math.random() * 30) + 1;
const main = document.querySelector('main');
const download = document.querySelector('#download');
const profile = document.querySelector('#profile');
const userName = document.querySelector('#name');
const userLocation = document.querySelector('#location');

fetch(url)
  .then(blob => blob.json())
  .then(function randomImage(data) {
    main.style.backgroundImage = `url(${data[random].urls.raw})`;
    profile.style.backgroundImage = `url(${data[random].user.profile_image.large})`;
    download.href = data[random].urls.raw;
    userName.href = data[random].user.links.html;
    userName.textContent = data[random].user.name;
    if (data[random].user.location !== null) {
      userLocation.textContent = data[random].user.location;
      userLocation.href = `https://unsplash.com/search/${data[random].user.location}`;
    }
    else {
      userLocation.remove();
    }
  });
