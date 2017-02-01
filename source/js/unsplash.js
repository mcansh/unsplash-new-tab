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
let photoId;

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
}

likePhoto.addEventListener('click', likeThePhoto);
