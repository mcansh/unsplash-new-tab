!function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,o){"use strict";o.d(t,"a",function(){return n});var n=document.querySelector.bind(document);document.querySelectorAll.bind(document);Node.prototype.on=window.on=function(e,t){this.addEventListener(e,t)},NodeList.prototype.__proto__=Array.prototype,NodeList.prototype.on=NodeList.prototype.addEventListener=function(e,t){this.forEach(function(o,n){o.on(e,t)})}},function(e,t,o){"use strict";o.d(t,"a",function(){return n}),o.d(t,"b",function(){return i});var n="551c50eda7975cf9ef9aaa4e043667f7566231fb7f09992b748630f2bfd81e8b",i="087479c2e8aed540a1ff89cbc306a2a317d21df98bcee598119c7bcbd0837290"},function(e,t,o){"use strict";function n(){location.href=G}function i(e){e.preventDefault(),o.i(v.a)(".popover").classList.toggle("is-visible")}function c(){fetch("https://unsplash.com/oauth/token/?client_id="+k.a+"&client_secret="+k.b+"&redirect_uri="+G+"&code="+A+"&grant_type=authorization_code",{method:"POST"}).then(function(e){return e.json()}).then(function(e){console.log(e.access_token),P=e.access_token,localStorage.setItem("accessToken",P),n()}).catch(function(e){console.error(e)})}function a(){fetch(g+"/photos/"+q+"/stats?access_token="+P,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(e){return e.json()}).then(function(e){o.i(v.a)("#like span").textContent=e.likes}).catch(function(e){console.error(e)})}function s(e){e.preventDefault(),fetch(g+"/photos/"+q+"/like?access_token="+P,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(){C.classList.add("liked")}),a()}function r(e){e.preventDefault(),fetch(g+"/photos/"+q+"/like?access_token="+P,{method:"DELETE",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(){C.classList.remove("liked")}),a()}function l(){var e=o.i(v.a)("#query").value;console.log(e),localStorage.setItem("searchQuery",e),location.reload()}function d(){var e=o.i(v.a)("#query");e.value=b}function u(e){e.preventDefault(),o.i(v.a)("#exif + .popover").classList.toggle("is-visible")}function f(e){e.preventDefault(),o.i(v.a)("#settings + .popover").classList.toggle("is-visible")}function h(){fetch(g+"/me/?access_token="+P,{method:"GET"}).then(function(e){return e.json()}).then(function(e){N=e.username,fetch(g+"/users/"+N+"/collections/?access_token="+P,{method:"GET"}).then(function(e){return e.json()}).then(function(e){e.forEach(function(e){console.log(e.id),z=e.id})})})}function p(){fetch(g+"/collections/538766/add/?photo_id="+q+"&access_token="+P,{method:"POST"}).then(function(){o.i(v.a)("#add").classList.add("added")})}function m(){o.i(v.a)(".popover").classList.remove("is-visible")}Object.defineProperty(t,"__esModule",{value:!0});var v=o(0),k=o(1),g="https://api.unsplash.com",_=void 0,b=localStorage.getItem("searchQuery");_=null===b?g+"/photos/random?&featured&client_id="+k.a:g+"/photos/random?query="+b+"&featured=true&client_id="+k.a;var y=o.i(v.a)("main"),E=o.i(v.a)("#download"),L=o.i(v.a)("#more"),x=o.i(v.a)("#profile"),w=o.i(v.a)("#name"),C=o.i(v.a)("#like"),j=o.i(v.a)("#location"),T=o.i(v.a)("#view"),S=o.i(v.a)("#login"),D=o.i(v.a)(".make.model"),O=o.i(v.a)(".res"),I=o.i(v.a)(".downloads"),P=localStorage.getItem("accessToken"),q=void 0,A=void 0,G="http://mcansh.local:5757",N=void 0,z=void 0,M="https://unsplash.com/oauth/authorize?client_id="+k.a+"&redirect_uri="+G+"&response_type=code&scope=public+read_user+write_likes+read_collections+write_collections";null===P||void 0===P?C.href=M:S.parentElement.remove(),"chrome-extension:"===location.protocol?(G=location.origin+"/index.html",console.log(G)):"mcansh.local"===location.hostname?(G="http://mcansh.local:5757/",console.log(G)):(G="https://mcansh.github.io/unsplash-new-tab/",console.log(G)),S.href=M,fetch(_,{method:"GET"}).then(function(e){return e.json()}).then(function(e){q=e.id,y.style.backgroundColor=e.color,y.style.backgroundImage="url(https://unsplash.com/photos/"+e.id+"/download)",T.href=e.links.html,x.style.backgroundImage="url("+e.user.profile_image.large+")",E.href=e.links.download,w.href=e.user.links.html,w.textContent=e.user.name,o.i(v.a)("#like span").textContent=e.likes,null!==e.exif.model?D.textContent="Camera: "+e.exif.model:D.remove(),O.textContent="Resolution: "+e.width+"x"+e.height,I.textContent="Downloads: "+e.downloads,null!==e.location?(j.textContent=e.user.location,j.href="https://unsplash.com/search/"+e.user.location):j.remove()}),location.search.length&&!function(){var e=window.location.search,t=decodeURIComponent(e),o=/^code=/,i=t.split("?");if(i.length){var a=i[1].split("&");a.forEach(function(e){e.match(o)&&(A=e.replace(o,""),A=A.replace("/",""))})}A?(console.log("CODE: "+A),window.code=A,c()):(console.error("no login code = no login for you"),n())}(),C.classList.contains("liked")?(C.addEventListener("click",r),C.removeEventListener("click",s)):(C.addEventListener("click",s),C.removeEventListener("click",r)),d(),o.i(v.a)("#save").addEventListener("click",l),L.addEventListener("click",i),o.i(v.a)("#settings").addEventListener("click",f),o.i(v.a)("#exif").addEventListener("click",u),h(),o.i(v.a)("#add").addEventListener("click",p),o.i(v.a)("main").addEventListener("click",m),o.i(v.a)(".button").addEventListener("click",m),document.addEventListener("keyup",function(e){13===e.keyCode&&l()})}]);
//# sourceMappingURL=bundle.js.map