# *YTVideos* plugin
*YTVideos* is a jQuery plugin/wrapper for the YouTube Iframe API (YTIAPI from now on) to easy manage YouTube videos interaction in your web page.  
*YTVideos* works overwriting its "*hooks*" HTML tags with their corresponding iframes tags.  
"*Hooks*" tags are just div tags with some attributes by which *YTVideos* will compile the iframes tags attributes.  
This is called the "**iframes injection phase**".  
*YTVideos* "*hooks*" can be directly inserted in the HTML of the web page and also programmatically injected into the DOM with javascript through the appropriate *YTVideos*'s' option.  

#### Dependencies
jQuery 1.7+.

#### Resizeend.js
YTVideo uses [Resizeend](https://github.com/nielse63/jquery.resizeend) jQuery plugin which is already incorpored in *YTVideos*.js.

## Table of contents
+ [Usage](#usage)
  + [Javascript configuration](#javascript-configuration)
  + [HTML configuration](#html-configuration)
+ [Options](#options)
+ [Events callbacks](#events-callbacks)
+ [Demos](https://github.com/TommyB1981/YTVideos/blob/master/demo/README.md)

## Usage [^][top]

*YTVideos* can works:  
1. With a combination of [HTML configuration](#html-configuration) + [Javascript configuration](#javascript-configuration)
2. Just with the [Javascript configuration](#javascript-configuration) setting the `hooks` option
3. With a combination of 1 and 2 configurations

### Javascript configuration [^][top]
1. Instatiate *YTVideos* (mandatory):

```js
  new YTVideos(options);
```

2. Set the `options` object (optional).

## Options [^][top]
All options are optionals and has to be set through the `options` object.

#### `hratio`
Type: `float`  
Default: `0.5625`  
> Sets the iframe height ratio. The ratio is relative to its width. This options is meant to calibrate the iframe tag's height to eliminate, as more as posssible, the upper and lower black strips that the YouTube player generates, whose increase as the video height ratio is more distant to the original video height ratio.  
  To get the iframe tag's height *YTVideos* will mulitiply its width for `hratio`.  
  This height ratio will be applied even on the window resize event listener to maintain iframe tag's dimensions responsivness.

#### `instance`  
Type: `string`  
Default: `ytInstance`  
> When instatiated *YTVideos* instance is attached to the `window` object with the variable name given in the default `instance` option.  
  Change this option to change the *YTVideos* instance's name as you wish.

#### `resizeDelay`
Type: `integer` (milliseconds)  
Default: `50`  
> The delay of `resizeEnd` event.

#### `videoWrapperClass`
Type: `string`  
Default: `videoWrapper`  
> The class of the HTML element with which YTVideo wraps the `hook` tag and the consequently overwritten iframe tag.  
Compiled HTML example:

```html
<div class="videoWrapper">
  <!-- hook tag or iframe tag here -->
</div>
```

#### `videoWrapperActiveClass`
Type: `string`  
Default: `on`  
> The class *YTVideos* adds to the video wrapper's tag (see above) once the `hook` has been overwritten by the iframe tag because a new YT.Player object has been created.  
  This is just an utility class, it should be used, for example, to trigger transitions or animations.  
  See [YT.Player objects creation][ytplayerobj] from YTIAPI documentation to deepen the argument if you want (not necessary).  

#### `placeholder`
Type: `object`  
Default:  

```js
  placeholder: {
    active: false,
    url: null,
    ext: false
  }
```

> The configuration object to run *YTVideos* in the *placeholder-mode*.  
  *YTVideos* allows for two configurations:
> 1. Same placeholder image for all videos (*single-mode*)
> 2. One specific placeholder's image for each video (*multiple-mode*).  

**object keys:**  

#### `active`
Type: `boolean`  
Default: `false`  
> If set to `true` runs *YTVideos* in *placeholder-mode*.

#### `url`
Type: `string`  
Default: `null`  
> In the *single-mode* configuration specify the full placeholder image's path with filename and file extension included.  
  In the *multiple-mode* *YTVideos* will append the video `yt-id` attribute value as a suffix to the placeholder image's file name, concatenating the file extension passed through the `ext` option (see below).  
  Cause of these premises just specify the common part of all placeholder images's path.

#### `ext`
Type: `string`  
Default: `null`  
> Set this option only in the *multiple-mode* to specify the placeholder image's file extension.

*single-mode* configuration example:
```js
  placeholder: {
    active: true,
    url: "images/placeholder.png"
  }
```

*multiple-mode* configuration example:

```js
  placeholder: {
    active: true,
    url: "images/placeholder_",
    ext: "png"
  }
```

*multiple-mode* placeholder images's final path example: `placeholder_123sdjhd51.png`

#### `placeholderClass`
Type: `string`  
Default: `"placeholder"`  
> The class *YTVideos* adds to the placeholder image's tag when run in the *placeholder-mode* (see above).  
Compiled* HTML with placeholder image's tag example:

```html
  <div class="videoWrapper">
    <div class="yt" yt-w="100%" yt-id="jdhdh4j5n" id="jdhdh4j5n">
      <img src="img/placeholder.png" class="placeholder">
    </div>
  </div>
```

> *The example code has been cleaned from all the inline styles that *YTVideos* applies to the HTML nodes.

#### `tracking` (*to define only if Google Analytics is used on the page*)
Type: `boolean`  
Default: `false`  
> If set to `true` *YTVideos* will run in *tracking-mode* and at the "*playing*" state change of a [YT.player object][ytplayerobj], *YTVideos* will push a new object in the Google Analytics `dataLayer` array using the following object model:

```js
  {
    'event': 'uaevent',
    'eventCategory': 'video',
    'eventAction': null,
    'eventLabel': null
  }
```

> `eventAction` key will be filled with the current [YT.Player][ytplayerobj] player [state][ytplayerstates] if it is present in the  `trackStates` array option (see below).  
  `eventlabel` key will be filled with `yt-track` attribute value, if present, of the video's `hook` tag, otherwise with the `yt-id` attribute value.

#### `trackStates`
Type: `array of strings`  
Default: `["playing"]`  
> The array of the [YT.Player][ytplayerobj] states that must be tracked.  
  See [Reproduction states][ytplayerstates] from the YTIAPI documentation for the full list of player states the YTIAPI provides for.

#### `overlay`
Type: `boolean`  
Default: `false`  
> If set to `true` *YTVideos* will run in the *overlay-mode*, wrapping the video iframe tag in an overlay div tag with attachted to it a click event listener which triggers the video reproduction. This div allows the page scrolling on mobile touch devices through the drag event on the iframes areas.  
  Here a compiled HTML example in the *overlay-mode*:

```html
  <div class="videoWrapper on">
    <div class="overlay"></div>
    <!-- Iframe tag here -->
  </div>
```

> *The example code has been cleaned from the inline styles that *YTVideos* applies to the HTML nodes.

#### `hooks`
Type: `array of objects`  
Default: `null`  
> If defined *YTVideos* will run in the *hooks-mode* allowing a collection of "*hooks*" tags to be injected in the page DOM before the [*iframes injection phase*][top], even those directly inserted in the page's HTML code (see [HTML configuration](#html-configuration)).  
This option is meant to allow programmatical injection of *YTVideos* `hooks` in the page.

**Object composition:**  

#### `target`  
Type: `string`  
> A css selector's like string to define the page DOM's node in which to inject *YTVideos* `hooks`.

#### `ids`  
Type: `array of strings`  
> An array list of YouTube's videos ids which will be used to generate the *YTVideos* `hooks`'s HTML markup to inject in the page.

#### `options`  
Type: `object`  
> A key-value pairs object in which the key will be the *YTVideos* `hook`'s attribute to add to it.
  Every `hook`'s attribute will be prefixed with "*yt-*" prefix.
  The key value will be the attribute's value.  

Example of *hooks-mode* configuration with options:

```js
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
```

> To understand the "*autoplay|1*" thing se [yt-vars](#yt-vars).

## Events callbacks [^][top]
> YTIAPI triggers some callbacks functions which resides under the `window` scope when the corresponding YTIAPI event is triggered.  
  These callbacks funtions names are derived from this pattern: `onPlayer[Eventname]` where "*EventName*" is the name of the [event][ytplayerstates] triggered by YTIAPI.  
  *YTVideos* allows to catch these callback functions by passing their name as a property of the `options` object with the callback function as its value.  
  All the callbacks passed to the `options` object (except the `onYouTubeIframeAPIReady` one) get the YTIAPI `event` object as the only parameter and have their `this` keyword binded the *YTVideos* instance.  
  Example of a YTIAPI callback's catching:

```js  
  new YTVideos({
    onYouTubeIframeAPIReady:function(){
      // statements here
    },
    onPlayerReady:function(event){
      // statements here
    },
    onPlayerStateChange:function(event){
      // statements here
    }
  });
```

### HTML configuration [^][top]
> Directly insert in the web page HTML code *YTVideos* "*hooks*" tags.  
  *YTVideos* "*hooks*" tags must be formatted this way:

```html
  <div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE" id="YOUTUBEVIDEOIDCODE"></div>
```

> `YOUTUBEVIDEOIDCODE` must be a valid YouTube video id.

#### `yt-id` and `id` attributes (mandatory):  
> `yt-id` and `id` attributes are used to estabilish an association between the `hook` tag (through `yt-id` attribute) and the DOM element which must be overwritten with the iframe tag (defined through the `id` attribute).  
There are two ways the *YTVideo* [*iframe injection phase*][top] can works:  
> - The *basic approach*
> - The *suffix approach*  
> In the *basic approach* `yt-id` and `id` attributes's values match, allowing the `hook` tag to be overwritten by the corresponding iframe tag.    
> For the *suffix approach* see below at [`yt-suffix`](#yt-suffix) attribute.

#### `yt-w` attribute (mandatory):  
> Define it as "100%" in a responsive context, otherwise another valid value's unit for a non-responsive context.

#### `yt-track` attribute (optional):  
> Define this attribute only if *YTVideos* in running in [tracking mode](#traking).

#### `yt-suffix` (optional)  
> Set this attribute to make the [*iframe injection phase*](#top) works with the alternative *suffix approach*.  
  This attribute defines a suffix that will be suffixed to `yt-id`'s value to get a final id value through which overwrite with the corresponding iframe tag a DOM element other than the `hook` tag,  passing in to this last tag the final id value through the `id` attribute.  
  Example of `yt-suffix` approach:

```html
  <ul>
    <li>
      <!-- Suffix approach hook -->
      <div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE" yt-suffix="_someSuffix"></div>
    </li>
    <!-- Basic approach hooks -->
    <li><div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE"></div></li>
    <li><div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE"></div></li>
    <li><div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE"></div></li>
    <li><div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE"></div></li>
  </ul>
  <div class="someWrapperInThePage">
    <div id="YOUTUBEVIDEOIDCODE_someSuffix"></div>
  </div>
```

#### `yt-vars` (optional)  
> Through this attribute is possible to set all available parameters to the iframe tag that *YTVideos* is going to overwrite to the "*hooks*" tags during the [*iframe injection phase*][top].  
  Parameters must be set using this syntax: `parameter1|value1,parameter2|value2`.  
  Every parameter/value must be separated by the `|` separator and every parameter/value couple must be separated with a `,`.  

Example: `yt-vars="autoplay|1"`.  

>  See here for the full list of [available parameters](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=it#Parameters) from YTIAPI documentation.

[ytplayerobj]: https://developers.google.com/youtube/iframe_api_reference?hl=it#Example_Video_Player_Constructors
[top]: #table-of-contents
[ytplayerstates]: https://developers.google.com/youtube/iframe_api_reference?hl=it#Playback_status
