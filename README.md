# custom-unsplash-new-tab

[![Greenkeeper badge](https://badges.greenkeeper.io/mcansh/unsplash-new-tab.svg)](https://greenkeeper.io/)

remade the unsplash new tab chrome extension. mostly to get experienced using fetch and api's.

uses the fetch api which is currently available in Chrome and Safari (10.1+)[only chrome and opera can use the extension]

## How to Install
1. There are 2 ways of installing this chrome extension

    1. you grab it from the [webstore](https://chrome.google.com/webstore/detail/custom-unsplash-instant/jakkljefkjcncpdibfmogcbdhonbiplp)

    2. or build from [source](https://github.com/mcansh/unsplash-new-tab/releases/latest)

2. Open dev tools and go to the console
    1. type `document.cookie` and copy the accessToken=yourlongencodedaccesstokenhere (yours obviously wont be that)

    2. next go back to your new tab in chrome or opera and open the dev tools there.

    3. type `document.cookie = 'accessToken=yourlongencodedaccesstokenhere'`

    4. obviously not the best set up but alas.

## Development
1. Clone/Fork the Repo

2. install node modules: `$ yarn`

3. run webpack: `$ yarn build`

4. you're now off to the races!

5. (optional) CodeKit for compiling SASS, and Jade(Pug)

### Screenshot
![Screenshot](screenshot.jpg)

![basically](http://weknowmemes.com/wp-content/uploads/2013/11/i-made-this-comic.jpg)
