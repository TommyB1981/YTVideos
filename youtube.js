// TODO: PROBLEMI DA CAPIRE/RISOLVERE
// 1. Perchè la callback onPlayerReady viene triggerata due volte per player?
// 2. Perchè la callback onPlayerStateChage non viene triggerata?

function youTubeVideos(options) {

  // Default options
  var defaultOptions = {
    overlayWrapperClass: 'ytOverlayWrapper',
    callbacks: ['StateChange'],
    overlay: false
  }

  // options setting
  if (options) options = $.extend({},defaultOptions,options);
  else var options = defaultOptions;

  // YouTube API load if not already loaded
  if (!window.yt) {
    (function() {
      var tag = document.createElement('script');
      tag.src = "https://www.YouTube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    })();
  }

  // overlay setter function
  function setOverlay() {

    // YouTube overlay setter function
    window.setYouTubeVideoOverlay = function(id){
      // Iframe getting and setting
      var iframe = $('iframe[data-youtubeID="'+id+'"]');
      var h = iframe.height();
      iframe.css({
        "position": "relative",
        "z-index": 0
      });
      // Overlay wrapper creation/getting and setting
      var wrapper = null;
      if (window.youTubeVideoHasOverlayWrapper(id)) wrapper = iframe.parents('.'+options.overlayWrapperClass);
      else wrapper = iframe.wrap('<div class="'+options.overlayWrapperClass+'"></div>');
      $(wrapper).append('<div class="overlay"></div>');
      wrapper.css({
        "position": "relative"
      });
      // Overlay wrapper creation and setting
      var overlay = $(wrapper).find('.overlay');
      overlay.css({
        "position": "absolute",
        "z-index": 1,
        "width": "100%",
        "height": h,
        "left": 0,
        "top": 0
      });
      $(overlay).on('click',function(e){
        window.youTubePlayPauseVideo(id,true);
      });
    }

    // YouTube overlay wrapper presence getter function
    window.youTubeVideoHasOverlayWrapper = function(id){
      var presence = $('iframe[data-youtubeID="'+id+'"]').parents('.'+options.overlayWrapperClass).length > 0 ? true : false;
      return presence;
    }

    // YouTube overlay presence getter function
    window.youTubeVideoHasOverlay = function(id){
      var presence = $('iframe[data-youtubeID="'+id+'"]').siblings('.overlay').length > 0 ? true : false;
      return presence;
    }

    // Play/Pause video function
    window.youTubePlayPauseVideo = function(currentID,overlay){
      $.each(window.ytvideos,function(vID,video){
        // manage play or pause on selected video
        if (currentID === vID) {
          switch (video.getPlayerState()) {
            // video is cued
            case 5:
              if (window.youTubeVideoHasOverlay(vID)) $('iframe[data-youtubeID="'+vID+'"]').siblings('.overlay').remove();
              video.playVideo();
              break;
            // video is paused
            case 2:
              if (!window.youTubeVideoHasOverlay(vID)) window.setYoutTubeVideoOverlay(vID);
              if (overlay) {
                if (window.youTubeVideoHasOverlay(vID)) $('iframe[data-youtubeID="'+vID+'"]').siblings('.overlay').remove();
                video.playVideo();
              }
              break;
          }
        }
        // otherwise checks other video to stop them if playing
        else {
          switch (video.getPlayerState()) {
            case 1:
              console.log("stop");
              if (!window.youTubeVideoHasOverlay(vID)) window.setYoutTubeVideoOverlay(vID);
              video.pauseVideo();
              break;
          }
        }
      });
    }

  }

  // YouTube API ready callback
  window.onYouTubeIframeAPIReady = function(){
    // Create YouTube API videos instances object
    window.ytvideos = {};
    // Create YouTube callbacks functions object
    window.youtubeEvents = {};
    // Set overlay funtions set
    if (options.overlay) setOverlay();
    // For every user-defined callback to trigger:
    $.each(options.callbacks,function(id,ev){
      // Fill YouTube callbacks functions object with user-defined callback functions
      window.youtubeEvents["onPlayer"+ev] = options["onPlayer"+ev];
      // If overlay is needed:
      if (options.overlay) {
        switch (ev) {
          // Create Ready and StateChange callbacks functions
          case "Ready":
            window["onPlayer"+ev] = function(event){
              window.youtubeEvents["onPlayer"+ev](event);
              window.setYouTubeVideoOverlay($(event.target.a).data('youtubeid'));
            }
          case "StateChange":
            window["onPlayer"+ev] = function(event){
              window.youtubeEvents["onPlayer"+ev](event);
              window.youTubePlayPauseVideo($(event.target.a).data('youtubeid'),true);
            }
            break;
          // Create video callbacks functions other than Ready and StateChange ones
          default:
            window["onPlayer"+ev] = function(event){
              window.youtubeEvents["onPlayer"+ev](event);
            }
            break;
        }
      }
      // If overlay not needed:
      else {
        // Create YouTube callbacks functions
        window["onPlayer"+ev] = function(event){
          window.youtubeEvents["onPlayer"+ev](event);
        }
      }
    });
    // Fill YouTube API videos instances object
    $.each($('.ytvideo'),function(vID,video){
      // Get video player wrapper ID
      var id = $(video).attr('player-id');
      // Create YouTube API video instance events object
      var events = {};
      // Fill YouTube API video instance events object
      $.each(options.callbacks,function(evID,ev){
        events['on'+ev] = window['onPlayer'+ev];
      });
      // Fill YouTube API videos instances object
      window.ytvideos[$(video).attr('data-youtubeID')] = new YT.Player(id, {
        height: $(video).attr('data-youtubeH'),
        width: $(video).attr('data-youtubeW'),
        videoId: $(video).attr('data-youtubeID'),
        events: events
      });
    });
  }

}
