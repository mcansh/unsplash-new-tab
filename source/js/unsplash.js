// @codekit-prepend 'tokens.js';

const url = `https://api.unsplash.com/photos/random?&featured&client_id=${authToken}`;
const main = document.querySelector('main');
const download = document.querySelector('#download');
const moreButton = document.querySelector('#more');
const profile = document.querySelector('#profile');
const userName = document.querySelector('#name');
const likePhoto = document.querySelector('#like');
const photoLocation = document.querySelector('#location');
const viewOnUnsplash = document.querySelector('#view');
const login = document.querySelector('#login');
const redirectURI = 'http://mcansh.local:5757';
let photoId;
let code;

fetch(url)
  .then(blob => blob.json())
  .then((data) => {
    main.style.backgroundColor = data.color;
    main.style.backgroundImage = `url(${data.urls.full})`;

    photoId = data.id;
    viewOnUnsplash.href = data.links.html;
    profile.style.backgroundImage = `url(${data.user.profile_image.large})`;
    download.href = data.links.download;
    userName.href = data.user.links.html;
    userName.textContent = data.user.name;
    document.querySelector('#like span').textContent = data.likes;

    if (data.location !== null) {
      photoLocation.textContent = data.user.location;
      photoLocation.href = `https://unsplash.com/search/${data.user.location}`;
    } else {
      photoLocation.remove();
    }
  });


function showMore() {
  document.querySelector('.popover').classList.toggle('is-visible');
}

function hideMore() {
  document.querySelector('.popover').classList.remove('is-visible');
}


moreButton.addEventListener('click', showMore);
main.addEventListener('click', hideMore);


function likeThePhoto(event) {
  event.preventDefault();
  likePhoto.href = `https://unsplash.com/photos/${photoId}/like`;
  this.classList.toggle('liked');
}

likePhoto.addEventListener('click', likeThePhoto);

login.href = `https://unsplash.com/oauth/authorize?client_id=${authToken}&redirect_uri=${redirectURI}&response_type=code&scope=public+read_user+write_likes`;

if (document.location.search.length) {
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
  } else {
    console.error(`you're not logged in!`);
  }
}

function logMeIn() {
  fetch('https://unsplash.com/oauth/token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Origin: `${redirectURI}`,
      Host: 'api.unsplash.com'
    },
    body: JSON.stringify({
      client_id: `${authToken}`,
      client_secret: `${applicationSecret}`,
      redirect_uri: `${redirectURI}`,
      code: `${code}`,
      grant_type: 'authorization_code'
    })
  })
  .then((res) => {
    console.log(res.json());
  })
  // .then((resJson) => {
  //   console.log(resJson);
  // });

  if (Response.ok) {
    fetch('https://api.unsplash.com/me')
      .then(blob => blob.json())
      .then((data) => { console.log(data); });
  }
}
