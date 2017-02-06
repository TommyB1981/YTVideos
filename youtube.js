function youTubeVideos() {

  // YouTube API loading if not already loaded
  if (!window.yt) {
    (function() {
      var tag = document.createElement('script');
      tag.src = "https://www.YouTube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    })();
  }

  // YouTube API ready callback
  window.onYouTubeIframeAPIReady = function(){
    window.ytvideos = {};
    $.each($('.ytvideo'),function(vID,video){
      var id = $(video).attr('id');
      window.ytvideos[$(video).attr('data-YouTubeID')] = new YT.Player(id, {
        height: $(video).attr('data-YouTubeH'),
        width: $(video).attr('data-YouTubeW'),
        videoId: $(video).attr('data-YouTubeID'),
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    });
  }

  // YouTube onPlayerReady callback
  window.onPlayerReady = function(event){
    var video = $(event.target.a);
    var id = $(video).attr('data-YouTubeID');
    window.setYoutTubeVideoOverlay(id);
  }

  // YouTube onPlayerStateChange callback
  window.onPlayerStateChange = function(event){
    var id = $(event.target.a).attr('data-youtubeID');
    if (event.data === 2) window.youTubePlayPauseVideo(id);
  }

  // YouTube overlay setter function
  window.setYoutTubeVideoOverlay = function(id){
    var wrapper = $('iframe[data-youtubeID="'+id+'"]').parent();
    $(wrapper).append('<div class="overlay"></div>');
    var overlay = $(wrapper).find('.overlay');
    $(overlay).on('click',function(e){
      window.youTubePlayPauseVideo(id,true);
    });
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
          // video is unstarted
          case -1:
            if (youTubeVideoHasOverlay(vID)) $('iframe[data-youtubeID="'+vID+'"]').siblings('.overlay').remove();
            video.playVideo();
            break;
          // video is cued
          case 5:
            if (youTubeVideoHasOverlay(vID)) $('iframe[data-youtubeID="'+vID+'"]').siblings('.overlay').remove();
            video.playVideo();
            break;
          // video is paused
          case 2:
            if (!youTubeVideoHasOverlay(vID)) window.setYoutTubeVideoOverlay(vID);
            if (overlay) {
              if (youTubeVideoHasOverlay(vID)) $('iframe[data-youtubeID="'+vID+'"]').siblings('.overlay').remove();
              video.playVideo();
            }
            break;
        }
      }
      // otherwise checks other video to stop them if playing
      else {
        switch (video.getPlayerState()) {
          case 1:
            if (!youTubeVideoHasOverlay(vID)) window.setYoutTubeVideoOverlay(vID);
            video.pauseVideo();
            break;
        }
      }
    });
  }

}
