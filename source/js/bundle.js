!function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var o={};return t.m=e,t.c=o,t.i=function(e){return e},t.d=function(e,o,n){t.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(o,"a",o),o},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,o){"use strict";o.d(t,"a",function(){return n});var n=document.querySelector.bind(document);document.querySelectorAll.bind(document);Node.prototype.on=window.on=function(e,t){this.addEventListener(e,t)},NodeList.prototype.__proto__=Array.prototype,NodeList.prototype.on=NodeList.prototype.addEventListener=function(e,t){this.forEach(function(o,n){o.on(e,t)})}},function(e,t,o){"use strict";o.d(t,"a",function(){return n}),o.d(t,"b",function(){return i});var n="551c50eda7975cf9ef9aaa4e043667f7566231fb7f09992b748630f2bfd81e8b",i="087479c2e8aed540a1ff89cbc306a2a317d21df98bcee598119c7bcbd0837290"},function(e,t,o){"use strict";function n(){location.href=q}function i(){o.i(f.a)(".popover").classList.toggle("is-visible")}function c(){fetch("https://unsplash.com/oauth/token/?client_id="+m.a+"&client_secret="+m.b+"&redirect_uri="+q+"&code="+O+"&grant_type=authorization_code",{method:"POST"}).then(function(e){return e.json()}).then(function(e){S=e.access_token,localStorage.setItem("accessToken",S),n()}).catch(function(e){console.error(e)})}function a(){fetch("https://api.unsplash.com/photos/"+I+"/stats?access_token="+S,{method:"GET",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(e){return e.json()}).then(function(e){o.i(f.a)("#like span").textContent=e.likes}).catch(function(e){console.error(e)})}function s(e){e.preventDefault(),fetch("https://api.unsplash.com/photos/"+I+"/like?access_token="+S,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(){L.classList.add("liked")}),a()}function r(e){e.preventDefault(),fetch("https://api.unsplash.com/photos/"+I+"/like?access_token="+S,{method:"DELETE",headers:{Accept:"application/json","Content-Type":"application/json"}}).then(function(){L.classList.remove("liked")}),a()}function l(){var e=o.i(f.a)("#query").value;console.log(e),localStorage.setItem("searchQuery",e)}function u(){var e=o.i(f.a)("#query");e.value=g}function p(){o.i(f.a)("#exif + .popover").classList.toggle("is-visible")}function h(){o.i(f.a)("#settings + .popover").classList.toggle("is-visible")}function d(){fetch("https://api.unsplash.com/me/?access_token="+S,{method:"GET"}).then(function(e){return e.json()}).then(function(e){A=e.username,fetch("https://api.unsplash.com/users/"+A+"/collections/?access_token="+S,{method:"GET"}).then(function(e){return e.json()}).then(function(e){console.log(e)})})}Object.defineProperty(t,"__esModule",{value:!0});var f=o(0),m=o(1),v=void 0,g=localStorage.getItem("searchQuery");v=null===g?"https://api.unsplash.com/photos/random?&featured&client_id="+m.a:"https://api.unsplash.com/photos/random?query="+g+"&featured&client_id="+m.a;var k=o.i(f.a)("main"),_=o.i(f.a)("#download"),b=o.i(f.a)("#more"),y=o.i(f.a)("#profile"),E=o.i(f.a)("#name"),L=o.i(f.a)("#like"),x=o.i(f.a)("#location"),j=o.i(f.a)("#view"),w=o.i(f.a)("#login"),C=o.i(f.a)(".make.model"),T=o.i(f.a)(".res"),S=localStorage.getItem("accessToken"),I=void 0,O=void 0,q="http://mcansh.local:5757",A=void 0,P="https://unsplash.com/oauth/authorize?client_id="+m.a+"&redirect_uri="+q+"&response_type=code&scope=public+read_user+write_likes";null===S||void 0===S?L.href=P:w.parentElement.remove(),"chrome-extension:"===location.protocol?(q=location.origin+"/index.html",console.log(q)):"http://"+location.hostname=="http://mcansh.local"?(q="http://mcansh.local:5757/",console.log(q)):(q="https://mcansh.github.io/unsplash-new-tab/",console.log(q)),w.href=P,fetch(v,{method:"GET"}).then(function(e){return e.json()}).then(function(e){I=e.id,k.style.backgroundColor=e.color,k.style.backgroundImage="url(https://unsplash.com/photos/"+e.id+"/download)",j.href=e.links.html,y.style.backgroundImage="url("+e.user.profile_image.large+")",_.href=e.links.download,E.href=e.user.links.html,E.textContent=e.user.name,o.i(f.a)("#like span").textContent=e.likes,null!==e.exif.model?C.textContent="Camera: "+e.exif.model:C.remove(),T.textContent="Resolution: "+e.width+"x"+e.height,null!==e.location?(x.textContent=e.user.location,x.href="https://unsplash.com/search/"+e.user.location):x.remove()}),location.search.length&&!function(){var e=window.location.search,t=decodeURIComponent(e),o=/^code=/,i=t.split("?");if(i.length){var a=i[1].split("&");a.forEach(function(e){e.match(o)&&(O=e.replace(o,""),O=O.replace("/",""))})}O?(console.log("CODE: "+O),window.code=O,c()):(console.error("no login code = no login for you"),n())}(),L.classList.contains("liked")?(L.addEventListener("click",r),L.removeEventListener("click",s)):(L.addEventListener("click",s),L.removeEventListener("click",r)),u(),o.i(f.a)("#save").addEventListener("click",l),b.addEventListener("click",i),o.i(f.a)("#settings").addEventListener("click",h),o.i(f.a)("#exif").addEventListener("click",p),d()}]);
//# sourceMappingURL=bundle.js.map