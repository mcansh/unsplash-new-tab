import 'whatwg-fetch';
import * as Cookies from 'js-cookie';
import { $, $$ } from './bling';
import { authToken, applicationSecret } from './tokens';

const endpoint = 'https://api.unsplash.com';
let accessToken = window.atob(Cookies.get('accessToken') || 'bnVsbA=='); // get accessToken from cookie or else set as null (bnVsbA==)
let url; // unsplash instant collection
let photoId; // placeholder for the photo id which we'll get from the API
let code; // placeholder for the login code which we'll get from unsplash when logging in
const redirectURI = location.origin;
const oAuth = 'https://unsplash.com/oauth';
const loginURL = `${oAuth}/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes+read_collections+write_collections`; // url in which we'll use to login

const login = $('#login');
const main = $('main'); // main event / background image
const download = $('#download[download]'); // download button
const viewOnUnsplash = $('#view'); // view on unsplash link
const likePhoto = $('#like'); // like button
const profile = $('#profile'); // user's profile picture
const userName = $('#name'); // user's username
const photoLocation = $('#location'); // photo's location
const camera = $('.make.model'); // photo's camera (make and model )
const resolution = $('.res'); // photo's resolution
const downloads = $('.downloads'); // how many times a photo has been downloaded
let isLiked;

if (accessToken === '' || accessToken === undefined || accessToken === 'null') {
  login.href = loginURL;
  url = `${endpoint}/photos/random?count=1&collections=155105&client_id=${authToken}`;
} else {
  login.parentElement.remove();
  url = `${endpoint}/photos/random?count=1&collections=155105&client_id=${authToken}&access_token=${accessToken}`;
}

function logMeIn() {
  fetch(`${oAuth}/token/?client_id=${authToken}&client_secret=${applicationSecret}&redirect_uri=${redirectURI}&code=${code}&grant_type=authorization_code`, {
    method: 'POST',
  })
  .then(data => data.json())
  .then((data) => {
    accessToken = window.btoa(data.access_token);
    Cookies.set('accessToken', accessToken);
    location.href = redirectURI;
  })
  .catch((err) => {
    console.error(err);
  });
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
  } else if (!code && !accessToken) {
    console.error('no login code = no login for you');
  }
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
      console.log(data);
      $('#like span').textContent = data.likes;
    })
    .catch(err => console.error(err));
}


function likeThePhoto(event) {
  event.preventDefault();
  if (isLiked === true) {
    isLiked = false;
    // unlike the photo
    fetch(`${endpoint}/photos/${photoId}/like?access_token=${accessToken}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      likePhoto.classList.remove('liked');
      getPhotoStats();
    })
    .catch(err => console.error(err));
  } else {
    isLiked = true;
    // like the photo
    fetch(`${endpoint}/photos/${photoId}/like?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(() => {
      likePhoto.classList.add('liked');
      getPhotoStats();
    })
    .catch(err => console.error(err));
  }
}

fetch(url, {
  method: 'GET'
})
  .then(blob => blob.json())
  .then((response) => {
    const data = response[0];

    console.log(data);

    photoId = data.id;
    main.style.backgroundColor = data.color;
    main.style.backgroundImage = `url(${data.urls.regular})`;

    viewOnUnsplash.href = data.links.html;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = `https://unsplash.com/photos/${data.id}/download`;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    $('#like span').textContent = data.likes;
    if (data.exif.model !== null) {
      const make = data.exif.make;
      const model = data.exif.model;
      if (model.includes(make)) {
        camera.textContent = `Camera: ${model}`;
      } else {
        camera.textContent = `Camera: ${make} ${model}`;
      }
    } else {
      camera.remove();
    }
    if (data.liked_by_user === true) {
      isLiked = true;
      likePhoto.classList.add('liked');
    }
    resolution.textContent = `Resolution: ${data.width}x${data.height}`;
    downloads.textContent = `Downloads: ${(data.downloads).toLocaleString()}`;
    if (data.location) {
      photoLocation.textContent = data.location.title;
      photoLocation.href = `https://unsplash.com/search/${data.location.title}`;
    } else {
      photoLocation.remove();
    }
  })
  .catch(err => console.error(err));

function closePopOvers() {
  $$('.popover').forEach((popover) => {
    popover.classList.remove('is-visible');
  });
}

function showMoreMenu(event) {
  event.preventDefault();
  closePopOvers();
  $('#more + .popover').classList.toggle('is-visible');
}

$('#more').addEventListener('click', showMoreMenu);

likePhoto.addEventListener('click', likeThePhoto);

function showExif(event) {
  event.preventDefault();
  closePopOvers();
  $('#exif + .popover').classList.toggle('is-visible');
}

$('#exif').addEventListener('click', showExif);
$('main').addEventListener('click', closePopOvers);
