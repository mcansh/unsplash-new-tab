import { $ } from './bling';
// import 'babel-polyfill';
import { authToken, applicationSecret } from './tokens';

let url;
const searchQuery = localStorage.getItem('searchQuery');
if (searchQuery === null) {
  url = `https://api.unsplash.com/photos/random?&featured&client_id=${authToken}`;
} else {
  url = `https://api.unsplash.com/photos/random?query=${searchQuery}&featured&client_id=${authToken}`;
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
let accessToken = localStorage.getItem('accessToken');
let photoId;
let code;
let redirectURI;
const loginURL = `https://unsplash.com/oauth/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes`;

if (accessToken === null || accessToken === undefined) {
  likePhoto.href = loginURL;
}

if (location.protocol === 'chrome-extension:') {
  redirectURI = `${location.origin}/index.html`;
  console.log(redirectURI);
} else if (`http://${location.hostname}` === 'http://mcansh.local') {
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
    main.style.backgroundImage = `url(https://unsplash.com/photos/${data.id}/download)`; // would use `data.links.download` but that goes over http, thus throwing errors in console, this simply remakes that but over https

    viewOnUnsplash.href = data.links.html;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = data.links.download;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    $('#like span').textContent = data.likes;

    if (data.location !== null) {
      photoLocation.textContent = data.user.location;
      photoLocation.href = `https://unsplash.com/search/${data.user.location}`;
    } else {
      photoLocation.remove();
    }
  });


function showMoreMenu() {
  $('.popover').classList.toggle('is-visible');
}

moreButton.addEventListener('click', showMoreMenu);

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

// function showMe() {
//   fetch(`https://api.unsplash.com/me/?access_token=${accessToken}`, {
//     method: 'GET'
//   })
//     .then(blob => blob.json())
//     .then((data) => { console.log(data); });
// }

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
  fetch(`https://api.unsplash.com/photos/${photoId}/stats?access_token=${accessToken}`, {
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
  fetch(`https://api.unsplash.com/photos/${photoId}/like?access_token=${accessToken}`, {
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
  fetch(`https://api.unsplash.com/photos/${photoId}/like?access_token=${accessToken}`, {
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
} else {
  likePhoto.addEventListener('click', likeThePhoto);
}

function getQuery(event) {
  const search = $('#query').value;
  console.log(search);
  localStorage.setItem('searchQuery', search);
  showSettings();
  event.preventDefault();
}

$('#save').addEventListener('click', getQuery);

function fillQuery() {
  const search = $('#query');
  search.value = searchQuery;
}

fillQuery();

function closeModal(e) {
  if (document.querySelector('#modal').classList.contains('active')) {
    if (e.keyCode === 27) {
      $('#modal').classList.toggle('active');
      $('body').classList.toggle('blur');
    }
  }
}

function showSettings() {
  $('#modal').classList.toggle('active');
  $('body').classList.toggle('blur');
}

$('#settings').addEventListener('click', showSettings);
// $('#modal').addEventListener('click', showSettings);
$('#close').addEventListener('click', showSettings);


document.addEventListener('keyup', closeModal);
