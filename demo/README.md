# *YTVideos* plugin demos

## Table of contents

+ [Basic usage](#basic-usage) demo
+ [Event callbacks catching](#event-callbacks-cathing) demo
+ [Programmatical hooks injection](programmatical-hooks-injection) demo
+ [Overlay](#overlay) demo
+ [Single placeholder](#single-placeholder) demo
+ [Multiple placeholders](#multiple-placeholders) demo

## Basic usage

### HTML

```html
  <body>
    <div class="yt" id="1Mlhnt0jMlg" yt-id="1Mlhnt0jMlg" yt-w="100%"></div>
    <div class="yt" id="SCNCCuqQJvo" yt-id="SCNCCuqQJvo" yt-w="100%"></div>
  </body>
```

### Javascript

```js
  new YTVideos();
```

## Event callbacks catching

### HTML

```html
  <body>
    <div class="yt" id="1Mlhnt0jMlg" yt-id="1Mlhnt0jMlg" yt-w="100%"></div>
    <div class="yt" id="SCNCCuqQJvo" yt-id="SCNCCuqQJvo" yt-w="100%"></div>
  </body>
```

### Javascript

```js
  new YTVideos({
    onYouTubeIframeAPIReady:function(){
      console.log("YouTube Iframe API is ready");
      console.log("--------------------");
    },
    onPlayerReady:function(event){
      var videoid = $(event.target.a).attr('yt-id');
      console.log('YouTube video player object of video '+$(event.target.a).attr('yt-id')+' is:');
      console.log(window.ytvideos[$(event.target.a).attr('yt-id')]);
      console.log("--------------------");
    },
    onPlayerStateChange:function(event){
      var videoid = $(event.target.a).attr('yt-id');
      console.log('Video '+videoid+' state change is '+event.data);
      console.log("--------------------");
    }
  });
```

## Programmatical hooks injection

### HTML

```html
  <body>
    <div class="video"></div>
  </body>
```

### Javascript

```js
  new YTVideos({
    hooks: [
      {
        target: 'div.video',
        ids: [
          '1Mlhnt0jMlg',
          'SCNCCuqQJvo',
          'NMSQVPkjQOU',
          'qUsQZj6h9H0'
        ],
        options: {
          vars: 'autoplay|1'
        }
      }
    ]
  });
```

## Overlay

### HTML

```html
  <div class="video">
    <div class="yt" id="1Mlhnt0jMlg" yt-id="1Mlhnt0jMlg" yt-w="100%"></div>
    <div class="yt" id="SCNCCuqQJvo" yt-id="SCNCCuqQJvo" yt-w="100%"></div>
  </div>
```

### Javascript

```js
  new YTVideos({
    overlay:true
  });
```

## Single placeholder

### HTML

```html
  <div class="video">
    <div class="yt" id="1Mlhnt0jMlg" yt-id="1Mlhnt0jMlg" yt-w="100%"></div>
    <div class="yt" id="SCNCCuqQJvo" yt-id="SCNCCuqQJvo" yt-w="100%"></div>
  </div>
```

### Javascript

```js
  new YTVideos({
    placeholder: {
      active: true,
      url: "img/placeholder.png",
      ext: false
    }
  });
```

## Multiple placeholders

### HTML

```html
  <div class="video">
    <div class="yt" id="1Mlhnt0jMlg" yt-id="1Mlhnt0jMlg" yt-w="100%"></div>
    <div class="yt" id="SCNCCuqQJvo" yt-id="SCNCCuqQJvo" yt-w="100%"></div>
  </div>
```

### Javascript

```js
  new YTVideos({
    placeholder: {
      active: true,
      url: "img/placeholder",
      ext: "png"
    }
  });
```
