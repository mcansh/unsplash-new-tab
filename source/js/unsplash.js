import { $, $$ } from './bling';
// import 'babel-polyfill';
import { authToken, applicationSecret } from './tokens';

const endpoint = 'https://api.unsplash.com';
let url;
const searchQuery = localStorage.getItem('searchQuery');
if (searchQuery === null) {
  url = `${endpoint}/photos/random?&featured&client_id=${authToken}`;
} else {
  url = `${endpoint}/photos/random?query=${searchQuery}&featured=true&client_id=${authToken}`;
}
const main = $('main');
const download = $('#download');
const moreButton = $('#more');
const profile = $('#profile');
const userName = $('#name');
const likePhoto = $('#like');
const photoLocation = $('#location');
const viewOnUnsplash = $('#view');
const login = $('#login');
const camera = $('.make.model');
const resolution = $('.res');
const downloads = $('.downloads');
let accessToken = localStorage.getItem('accessToken');
let photoId;
let code;
let redirectURI = 'http://mcansh.local:5757';
let username;
let collectionID;
const loginURL = `https://unsplash.com/oauth/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes+read_collections+write_collections`;

if (accessToken === null || accessToken === undefined) {
  likePhoto.href = loginURL;
} else {
  login.parentElement.remove();
}

if (location.protocol === 'chrome-extension:') {
  redirectURI = `${location.origin}/index.html`;
  console.log(redirectURI);
} else if (location.hostname === 'mcansh.local') {
  redirectURI = 'http://mcansh.local:5757/';
  console.log(redirectURI);
} else {
  redirectURI = 'https://mcansh.github.io/unsplash-new-tab/';
  console.log(redirectURI);
}

function redirectMe() {
  location.href = redirectURI;
}

login.href = loginURL;

fetch(url, {
  method: 'GET',
})
  .then(blob => blob.json())
  .then((data) => {
    photoId = data.id;
    main.style.backgroundColor = data.color;
    main.style.backgroundImage = `url(https://unsplash.com/photos/${data.id}/download)`; // would use `data.links.download` but that goes over http, thus throwing errors in console, this simply does it but over https

    viewOnUnsplash.href = data.links.html;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = data.links.download;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    $('#like span').textContent = data.likes;
    if (data.exif.model !== null) {
      camera.textContent = `Camera: ${data.exif.model}`;
    } else {
      camera.remove();
    }
    resolution.textContent = `Resolution: ${data.width}x${data.height}`;
    downloads.textContent = `Downloads: ${data.downloads}`;

    if (data.location !== null) {
      photoLocation.textContent = data.user.location;
      photoLocation.href = `https://unsplash.com/search/${data.user.location}`;
    } else {
      photoLocation.remove();
    }
  });


function showMoreMenu(event) {
  event.preventDefault();
  $('.popover').classList.toggle('is-visible');
}

if (location.search.length) {
  const urlEnc = window.location.search;
  const urlDec = decodeURIComponent(urlEnc);

  const codeParam = /^code=/;
  const query = urlDec.split('?');

  if (query.length) {
    const params = query[1].split('&');
    params.forEach((param) => {
      if (param.match(codeParam)) {
        code = param.replace(codeParam, '');
        code = code.replace('/', '');
      }
    });
  }

  if (code) {
    console.log(`CODE: ${code}`);
    window.code = code;
    logMeIn();
  } else {
    console.error('no login code = no login for you');
    redirectMe();
  }
}

function logMeIn() {
  fetch(`https://unsplash.com/oauth/token/?client_id=${authToken}&client_secret=${applicationSecret}&redirect_uri=${redirectURI}&code=${code}&grant_type=authorization_code`, {
    method: 'POST',
  })
  .then(data => data.json())
  .then((data) => {
    console.log(data.access_token);
    accessToken = data.access_token;
    localStorage.setItem('accessToken', accessToken);
    redirectMe();
  })
  .catch((err) => {
    console.error(err);
  });
}

function getPhotoStats() {
  fetch(`${endpoint}/photos/${photoId}/stats?access_token=${accessToken}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(blob => blob.json())
    .then((data) => {
      $('#like span').textContent = data.likes;
    })
    .catch((err) => { console.error(err); });
}

function likeThePhoto(event) {
  event.preventDefault();
  fetch(`${endpoint}/photos/${photoId}/like?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    likePhoto.classList.add('liked');
  });

  getPhotoStats();
}

function unlikeThePhoto(event) {
  event.preventDefault();
  fetch(`${endpoint}/photos/${photoId}/like?access_token=${accessToken}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(() => {
    likePhoto.classList.remove('liked');
  });

  getPhotoStats();
}

if (likePhoto.classList.contains('liked')) {
  likePhoto.addEventListener('click', unlikeThePhoto);
  likePhoto.removeEventListener('click', likeThePhoto);
} else {
  likePhoto.addEventListener('click', likeThePhoto);
  likePhoto.removeEventListener('click', unlikeThePhoto);
}

function getQuery() {
  const search = $('#query').value;
  console.log(search);
  localStorage.setItem('searchQuery', search);
  location.reload();
}

function fillQuery() {
  const search = $('#query');
  search.value = searchQuery;
}

fillQuery();

function showExif(event) {
  event.preventDefault();
  $('#exif + .popover').classList.toggle('is-visible');
}

function showSearch(event) {
  event.preventDefault();
  $('#settings + .popover').classList.toggle('is-visible');
}

$('#save').addEventListener('click', getQuery);
moreButton.addEventListener('click', showMoreMenu);
$('#settings').addEventListener('click', showSearch);
$('#exif').addEventListener('click', showExif);


function getCollections() {
  fetch(`${endpoint}/me/?access_token=${accessToken}`, {
    method: 'GET',
  })
  .then(blob => blob.json())
  .then((me) => {
    username = me.username;

    fetch(`${endpoint}/users/${username}/collections/?access_token=${accessToken}`, {
      method: 'GET'
    })
      .then(blob => blob.json())
      .then((collections) => {
        collections.forEach((collection) => {
          console.log(collection.id);
          collectionID = collection.id;
        });
      });
  });
}

getCollections();


function addToCollection() {
  fetch(`${endpoint}/collections/538766/add/?photo_id=${photoId}&access_token=${accessToken}`, {
    method: 'POST'
  })
  .then(() => {
    $('#add').classList.add('added');
  });
}

function closePopOvers() {
  $('.popover').classList.remove('is-visible');
}

$('#add').addEventListener('click', addToCollection);

$('main').addEventListener('click', closePopOvers);
$('.button').addEventListener('click', closePopOvers);

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    getQuery();
  }
});
