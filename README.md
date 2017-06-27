# *YTVideos* plugin #
*YTVideos* is is a jQuery plugin/wrapper for YouTube Iframe API (YTIAPI from now on) to easy manage YouTube videos interaction in your web page.  
*YTVideos* works overwriting in the DOM its "*hooks*" tags with their corresponding iframes tags.  
"*Hooks*" tags are just div tags with some attributes by which *YTVideos* will compile the iframes tags attributes.  
This is called the "*iframes injection phase*".  
*YTVideos* "*hooks*" can be directly inserted in the HTML of the page and also programmatically injected in the DOM with javascript through *YTVideos*'s' options.  

#### Dependencies ####
YTVideo uses [Resizeend](https://github.com/nielse63/jquery.resizeend) jQuery plugin which is already incorpored in *YTVideos*.js.

## Table of contents ##
+ [Usage](#usage)
  + [Javascript configuration](#javascript)
  + [HTML configuration](#html)
+ [Options](#options)
+ [Events callbacks](#events)
+ [Demos](#demos)

### Usage ###

*YTVideos* can works:  
1. With a combination of [HTML configuration](#html) + [Javascript configuration](#javascript)
2. Just with the [Javascript configuration](#javascript) but only setting the `hooks` option
3. With a combination of 1 and 2

#### Javascript configuration ####
1. Instatiate *YTVideos* (mandatory):

```js
  new YTVideos(options);
```

2. Set the `options` object (optional).

##### Options #####
All options are optionals and has to be set through the `options` object.

**hratio**  
Type: `float`  
Default: `0.5625`  
> Sets the iframe height ratio compared to its width. This options is meant to calibrate the iframe tag's height to eliminate, as more as posssible, the upper and lower black strips that the YouTube player shows whose increase as the video height ratio in more distant to the original video height ratio.  
  To get the iframe tag's height *YTVideos* will mulitiply its width for `hratio`.  
  This height ratio will be applied even to the window resize event listener to maintain iframe tag dimensions responsivness.

**instance**  
Type: `string`  
Default: `ytInstance`  
When instatiated *YTVideos* instance is attached to the `window` object with the variable name given in the default `instance` option.  
Change this option to change the *YTVideos* instance's name as you wish.

**resizeDelay**  
Type: `integer` (milliseconds)  
Default: `50`  
The delay of `resizeEnd` event.

**videoWrapperClass**
Type: `string`  
Default: `videoWrapper`  
The class of the HTML element with which YTVideo wraps the `hook` or the overwritten iframe tag.  
Compiled HTML example:

      <div class="videoWrapper">
        <!-- hook or iframe tag here -->
      <\/div>

**videoWrapperActiveClass**
Type: `string`  
Default: `on`  
The class *YTVideos* adds to the video wrapper (see above) once the `hook` has been overwritten by the iframe tag because a new YT.Player object has been created.  
This is just an utility class, it should be used, for example, to trigger transitions or animations.  
See [YT.Player objects creation](https://developers.google.com/youtube/iframe_api_reference?hl=it#Example_Video_Player_Constructors) from YTIAPI documentation to deepen the argument if you want, but it's not necessary.  

**placeholder**  
Type: `object`  
Default:  

    placeholder: {
      active: false,
      url: null,
      ext: false
    }

The configuration object to run *YTVideos* in the placeholder mode.  
TVideos* allows for two configurations:
1. Same placeholder image for all videos (`single mode`)
2. the second to use one specific placeholder image for each video (`multiple mode`).  

object keys:  

`active`  
Type: `boolean`  
Default: `false`  
If set to `true` run *YTVideos* in PLACEHOLDER-MODE.

`url`  
Type: `string`  
Default: `null`  
In the `single mode` configuration specify the full placeholder image's path with filename and file extension included.  
In the `multiple mode` *YTVideos* will append the video `yt-id` attribute value as a suffix to the placeholder image's file name, concatenating the file extension passed through the `ext` option (see below).  
Cause of these premises just specify the common part of all placeholder images's path.

`ext`  
Type: `string`  
Default: `null`  
Set this option only in the `multiple mode` to specify the placeholder image's file extension.

`single mode` configuration example:

    placeholder: {
      active: true,
      url: "images/placeholder.png"
    }

`Single mode` [demo](placeholder-one.html)  

`multiple mode` configuration example:

    placeholder: {
      active: true,
      url: "images/placeholder_",
      ext: "png"
    }

`multiple mode` placeholder images's final path example: *placeholder_123sdjhd51.png*.  
`multiple mode` [demo](placeholder-all.html)

**placeholderClass**
Type: `string`  
Default: `"placeholder"`  
The class *YTVideos* adds to the placeholder image's tag when run in the placeholder mode (see above).  
Compiled* HTML with placeholder image's tag example:

    <div class="videoWrapper">
      <div class="yt">
        <img src="img/placeholder.png" class="placeholder">
      <\/div>
    <\/div>

*The example code has been cleaned from all the inline styles that *YTVideos* applies to the HTML nodes.

**tracking** (*to define only if Google Analytics is used on the page*)  
Type: `boolean`  
Default: `false`  
If set to `true` *YTVideos* will run in TRACKING-MODE and at the "*playing*" state change of a YT.player object, *YTVideos* will push a new `dataLayer` object in the Google Analytics `dataLayer` array using the following object model:

    {
      'event': 'uaevent',
      'eventCategory': 'video',
      'eventAction': null,
      'eventLabel': null
    }

`eventAction` key will be filled with the current YT.Player player state if it is present in the `trackStates` array option (see below).  
`eventlabel` key will be filled with `yt-track` attribute value, if present, of the video's `hook` tag, otherwise with the `yt-id` attribute value.

**trackStates**  
Type: `array of strings`  
Default: `["playing"]`  
The array of the YT.Player states that must be tracked.  
See [Reproduction states](https://developers.google.com/youtube/iframe_api_reference?hl=it#Playback_status) from the YTIAPI documentation for the full list of player states the YTIAPI provides for.

**overlay**  
Type: `boolean`  
Default: `false`  
If set to `true` *YTVideos* will run in the OVERLAY-MODE, wrapping the video iframe tag in an overlay div tag with attachted to it a click event listener which triggers the video reproduction. This div allows the page scrolling on mobile touch devices, allowing the page scrolling by drag action even on the iframes areas.  
Here a compiled HTML example with in the OVERLAY-MODE*:

    <div class="videoWrapper on">
      <div class="overlay"></div>
        <!-- Iframe tag here -->
      <\/div>
    <\/div>

*The example code has been cleaned from the inline styles that *YTVideos* applies to the HTML nodes.

**hooks**  
Type: `array of objects`  
Default: `null`  
If defined *YTVideos* will run in the HOOKS-MODE allowing a collection of "*hooks*" tags to be injected in the page DOM before the iframes injection phase with the corresponding iframe tags, even those directly inserted in the page's HTML code (see [HTML configuration](#html)).  
This option is meant to allow programmatical injection of *YTVideos* `hooks` in the page.

Object composition:  

`target`  
Type: `string`  
A css selector's like string to define the page DOM's node in which to inject *YTVideos* `hooks`.

`ids`  
Type: `array of strings`  
An array list of YouTube's videos ids which will be used to generate the *YTVideos* `hooks`'s' HTML markup to inject in the page.

`options`  
Type: `object`  
A key-value pairs object in which the key will be the *YTVideos* `hook`'s' attribute to add to it (which will be prefixed with "*yt-*"), while the value will be the attribute's value.  
Example of `inject` mode configuration with options:

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

##### Events callbacks #####
YTIAPI triggers some callbacks functions under the `window` scope when the corresponding YTIAPI event is triggered.  
These callbacks funtions names are derived from this pattern: `onPlayer[Eventname]` where "*EventName*" is the name of the event triggered by YTIAPI.  
*YTVideos* allows to catch these callback functions by passing their name as a property of the `options` object with the callback function as its value.  
All the callbacks passed to the `options` object (except the `onYouTubeIframeAPIReady` one) get the YTIAPI `event` object as the only parameter and have their `this` keyword binded the *YTVideos* instance `this` reference.  
Example of a YTIAPI's callback catching:

    new YTVideos({
      onYouTubeIframeAPIReady:function(){
        <!-- do stuff here -->
      },
      onPlayerReady:function(event){
        <!-- do stuff here -->
      },
      onPlayerStateChange:function(event){
        <!-- do stuff here -->
      }
    });

Here a YTIAPI's callbacks catching [demo](demo/callbacks.html).

#### HTML configuration ####
Directly insert in the page's HTML code *YTVideos* "*hooks*" tag to to run *YTVideos* instance behaviour.  
*YTVideos* "*hooks*" must be formatted this way:

    <div class="yt" yt-w="100%" yt-id="[YOUTUBEVIDEOIDCODE]" id="[YOUTUBEVIDEOIDCODE]"></div>

`YOUTUBEVIDEOIDCODE` must be a valid YoutTube video id.

**The `hook` tag attributes in depth:**

`yt-id` and `id` attributes (mandatory):  
`yt-id` and `id` attributes are used to estabilish an association between the `hook` tag (by `yt-id` attribute) and the DOM element which must be overwritten with the iframe tag (defined by the `id` attribute).  
  There are two ways the YTVideo "*iframe injection phase*" can works:
  1. The *basic approach*
  2. The *suffix approach*  

In the *basic approach* `yt-id` and `id` attributes's values match, allowing the `hook` tag to be overwritten by the corresponding iframe tag.    
For the *suffix approach* see below at `yt-suffix` attribute.

`yt-w` attribute (mandatory):  
Define it as "100%" in a responsive context, otherwise another valid value's unit for a non-responsive context.

`yt-track` attribute (optional):  
Define this attribute in only if *YTVideos* in running in tracking mode

`yt-suffix`  
Set this attribute to make the "*iframe injection phase*" works with the alternative *suffix approach*.  
This attribute defines a suffix that will be suffixed to `yt-id`'s value to get a final id value through which overwrite with the corresponding iframe tag a DOM element other than the `hook` tag,  passing in to it the final id value through the `id` attribute.  
Example of `yt-suffix` approach:

    <ul>
      <li><div class="yt" yt-w="100%" yt-id="YOUTUBEVIDEOIDCODE" yt-suffix=""></div></li>
    </ul>
    <div class="someWrappeInPage">
      <div id="YOUTUBEVIDEOIDCODE"></div>
    </div>

`yt-vars`  
Through this attribute is possible to set all available parameters to the iframe tag that *YTVideos* is going to instantiate during the *iframe injection phase*.  
Parameters must be set using this syntax: `parameter1|value1,parameter2|value2`.  
Every parameter/value must be separated by the `|` separator and every parameter/value couple must be separated with a `,`.  
Example: `yt-vars="autoplay|1"`.  
See here for the full list of [available parameters](https://developers.google.com/youtube/player_parameters?playerVersion=HTML5&hl=it#Parameters) from YTIAPI documentation.

---

### Demos ###

+ [Basic usage](demo/base.html) demo
+ [Event callbacks cathing](demo/callbacks.html) demo
+ [Programmatical hooks injection](demo/hooks.html) demo
+ [Programmatical hooks injection](demo/hooks-options.html) demo with options
+ [Overlay](demo/overlay.html) demo
+ [Single placeholder](demo/placeholder-one.html) demo
+ [Multiple placeholders](demo/placeholder-all.html) demo
