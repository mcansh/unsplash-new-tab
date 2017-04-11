import 'whatwg-fetch';
import { $, $$ } from './bling';
import { authToken, applicationSecret } from './tokens';
// think im going to rewrite using https://github.com/unsplash/unsplash-js

const endpoint = 'https://api.unsplash.com';
let accessToken = window.atob(localStorage.getItem('accessToken')); // get accessToken from cookie
let url = `${endpoint}/photos/random?count=1&collections=155105&client_id=${authToken}`; // unsplash instant collection
let photoId; // placeholder for the photo id which we'll get from the API
let code; // placeholder for the login code which we'll get from unsplash when logging in
const redirectURI = 'https://mcansh.github.io/unsplash-new-tab/';
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
const searchQuery = localStorage.getItem('searchQuery');
const searchUser = localStorage.getItem('searchUser');
let isLiked;
const currentUser = localStorage.getItem('currentUser');


function getCollections() {
  fetch(`${endpoint}/users/${currentUser}/collections?client_id=${authToken}&access_token=${accessToken}`, {
    method: 'GET'
  })
  .then(blob => blob.json())
  .then((data) => {
    if (data.length > 10) {
      $('#collections ul').innerHTML += '<li>check console for info</li>';
    }
    data.forEach((collection) => {
      $('#collections ul').innerHTML += `
        <li>
          <a data-collection="${collection.id}" href="#">${collection.title}</a>
        </li>
      `;
    });
    $$('#collections ul li a').forEach((collectionID) => {
      collectionID.addEventListener('click', addToCollection);
    });
  })
  .catch(err => console.error(err));
}

function getCurrentUser() {
  fetch(`${endpoint}/me?client_id=${authToken}&access_token=${accessToken}`, {
    method: 'GET'
  })
  .then(blob => blob.json())
  .then((data) => {
    localStorage.setItem('currentUser', data.username);
    getCollections();
  })
  .catch(err => console.error(err));
}

function addToCollection(event) {
  const collectionID = this.dataset.collection;
  event.preventDefault();
  fetch(`${endpoint}/collections/${collectionID}/add?photo_id=${photoId}&client_id=${authToken}&access_token=${accessToken}`, {
    method: 'POST'
  })
  .then(blob => blob.json())
  .then((data) => {
    console.log(data);
    $('#add').classList.add('added');
  })
  .catch(err => console.error(err));
}

if (accessToken === '' || accessToken === 'undefined' || accessToken === 'null') {
  login.href = loginURL;
} else {
  getCurrentUser();
  login.parentElement.remove();
  url += `&access_token=${accessToken}`;
}

if (searchQuery) {
  console.log('found a query but not a user');
  localStorage.removeItem(searchUser);
  url += `&query=${searchQuery}`;
} else if (searchUser) {
  console.log('found a user but not a query');
  url += `&username=${searchUser}`;
  localStorage.removeItem(searchQuery);
} else if (searchUser && searchQuery) {
  console.log('found both a query and user');
  url += `&query=${searchQuery}&username=${searchUser}`;
}

function logMeIn() {
  fetch(`${oAuth}/token/?client_id=${authToken}&client_secret=${applicationSecret}&redirect_uri=${redirectURI}&code=${code}&grant_type=authorization_code`, {
    method: 'POST',
  })
  .then(data => data.json())
  .then((data) => {
    console.log(data);
    accessToken = window.btoa(data.access_token);
    localStorage.setItem('accessToken', accessToken);
    location.href = location.origin;
  })
  .catch(err => console.error(err));
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
    main.style.backgroundImage = `url(${data.urls.full})`;

    viewOnUnsplash.href = data.links.html;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = `https://unsplash.com/photos/${data.id}/download`;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    $('#like span').textContent = data.likes;
    if (data.exif.model) {
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

function showMenu(event) {
  event.preventDefault();
  closePopOvers();
  this.nextElementSibling.classList.toggle('is-visible');
}

$$('.button.opener').forEach((button) => {
  button.addEventListener('click', showMenu);
});

likePhoto.addEventListener('click', likeThePhoto);
$('main').addEventListener('click', closePopOvers);

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
  if (search.value) {
    search.value = searchQuery;
  }
  if (user.value) {
    user.value = searchUser;
  }
}
fillQuery();
$('#save').addEventListener('click', getQuery);

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    getQuery();
  }
});
