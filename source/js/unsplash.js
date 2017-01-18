// @codekit-prepend 'tokens.js';

const url = `https://api.unsplash.com/photos/random?client_id=${authToken}`;
const main = document.querySelector('main');
const download = document.querySelector('#download');
const profile = document.querySelector('#profile');
const userName = document.querySelector('#name');
const userLocation = document.querySelector('#location');

fetch(url)
  .then(blob => blob.json())
  .then(function randomImage(data) {
    main.style.backgroundImage = `url(${data.urls.raw})`;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = data.urls.raw;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    if (data.user.location !== null) {
      userLocation.textContent = data.user.location;
      userLocation.href = `https://unsplash.com/search/${data.user.location}`;
    } else {
      userLocation.remove();
    }
  });
