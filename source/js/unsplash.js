import { $ } from './bling';
// import 'babel-polyfill';
import { authToken, applicationSecret } from './tokens';

const url = `https://api.unsplash.com/photos/random?&query=desks&featured&client_id=${authToken}`;
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
let redirectURI = `http://${window.location.hostname}`;
const loginURL = `https://unsplash.com/oauth/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes`;

if (accessToken === null || accessToken === undefined) {
  likePhoto.href = loginURL;
}

if (redirectURI === 'http://mcansh.local') {
  redirectURI = 'http://mcansh.local:5757/';
} else {
  redirectURI = 'https://mcansh.github.io/unsplash-new-tab/';
}

function redirectMe() {
  window.location.href = redirectURI;
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

function hideMoreMenu() {
  $('.popover').classList.remove('is-visible');
}


moreButton.addEventListener('click', showMoreMenu);
main.addEventListener('click', hideMoreMenu);

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
