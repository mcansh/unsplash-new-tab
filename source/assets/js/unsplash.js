import { $ } from './bling';
// import 'babel-polyfill';
import { authToken, applicationSecret } from './tokens';

const endpoint = 'https://api.unsplash.com';
let url;
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
let myCollections;
const loginURL = `https://unsplash.com/oauth/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes+read_collections+write_collections`;
const searchQuery = localStorage.getItem('searchQuery');
const searchUser = localStorage.getItem('searchUser');

if (searchQuery === null && searchUser === null) {
  console.log('neither a query or user was found');
  url = `${endpoint}/photos/random?featured=true&client_id=${authToken}&access_token=${accessToken}`;
} else if (searchQuery !== null && searchUser === null) {
  console.log('found a query but not a user');
  url = `${endpoint}/photos/random?featured=true&query=${searchQuery}&client_id=${authToken}&access_token=${accessToken}`;
} else if (searchUser !== null && searchQuery === null) {
  console.log('found a user but not a query');
  url = `${endpoint}/photos/random?featured=true&username=${searchUser}&client_id=${authToken}&access_token=${accessToken}`;
} else if (searchUser !== null && searchQuery !== null) {
  console.log('found both a query and user');
  url = `${endpoint}/photos/random?featured=true&username=${searchUser}&query=${searchQuery}&client_id=${authToken}&access_token=${accessToken}`;
} else {
  console.error('🤔');
}

if (accessToken === null || accessToken === undefined || accessToken === 'null' || accessToken === 'undefined') {
  likePhoto.href = loginURL;
} else {
  login.parentElement.remove();
}

if (location.protocol === 'chrome-extension:') {
  redirectURI = `${location.origin}/index.html`;
} else if (location.hostname === 'mcansh.local') {
  redirectURI = 'http://mcansh.local:5757/';
} else {
  redirectURI = 'https://mcansh.github.io/unsplash-new-tab/';
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

    if (data.liked_by_user === true) {
      likePhoto.classList.add('liked');
    }

    resolution.textContent = `Resolution: ${data.width}x${data.height}`;
    downloads.textContent = `Downloads: ${(data.downloads).toLocaleString()}`;

    if (data.location !== null) {
      photoLocation.textContent = data.user.location;
      photoLocation.href = `https://unsplash.com/search/${data.user.location}`;
    } else {
      photoLocation.remove();
    }
  });


function showMoreMenu(event) {
  event.preventDefault();
  $('#more + .popover').classList.toggle('is-visible');
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
  const user = $('#user').value;
  console.log(searchUser);
  console.log(search);
  localStorage.setItem('searchQuery', search);
  localStorage.setItem('searchUser', user);
  location.reload();
}

function fillQuery() {
  const search = $('#query');
  const user = $('#user');
  user.value = searchUser;
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
        window.myCollections = collections.map((collection, i) => {
          return collection.id;
        });
        $('#add + .popover ul').innerHTML = myCollections.map((collection, i) => {
          return `
            <li>
              <a href="#">${collection.id}</a>
            </li>
          `;
        }).join('');
      });
  });
}

getCollections();

function showCollections() {
  $('#add + .popover').classList.toggle('is-visible');
}


function addToCollection() {
  fetch(`${endpoint}/collections/${collectionID}/add/?photo_id=${photoId}&access_token=${accessToken}`, {
    method: 'POST'
  })
  .then(() => {
    $('#add').classList.add('added');
  });
}

function closePopOvers() {
  $('.popover').classList.remove('is-visible');
}

$('#add').addEventListener('click', showCollections);

$('main').addEventListener('click', closePopOvers);
$('.button').addEventListener('click', closePopOvers);

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    getQuery();
  }
});
