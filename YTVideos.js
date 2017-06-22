function YTVideos(options) {
  this.init(options);
}

YTVideos.prototype = {
  options: {
    hratio: 0.5625,
    videoWrapperClass: "videoWrapper",
    videoWrapperActiveClass: "on",
    instance: null
  },
  setOptions: function(options,callback){
    console.log("setOptions");
    this.options = $.extend({},this.options,options);
    if (typeof callback == "function") callback();
  },
  init: function(options){
    console.log("init");
    window[this.options.instance] = this;
    this.setYouTubeIframeAPICallbacks();
    this.setOptions(options,function(){
      this.checkYouTubeIframeAPI();
    }.bind(this));
  },
  setYouTubeIframeAPICallbacks: function() {
    var instanceName = this.options.instance;
    window.onYouTubeIframeAPIReady = function(){window[instanceName].run();}
    window.onPlayerReady = function(event){window[instanceName].fitH();}
    window.onPlayerStateChange = function(event){window[instanceName].playerStateChange(event);}
  },
  checkYouTubeIframeAPI: function(){
    console.log("checkYouTubeIframeAPI");
    if (!window.yt) {
      (function() {
        var tag = document.createElement('script');
        tag.src = "https://www.YouTube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      })();
    }
    else this.run();
  },
  run: function(){
    console.log("run");
    this.injectIframes();
    if (window.dataLayer) this.setTracking();
  },
  setTracking: function(){
    console.log("setTracking");
    this.dataLayerVideoModel = {
      'event': 'uaevent',
      'eventCategory': 'video',
      'eventAction': null,
      'eventLabel': null
    }
    this.tracking = true;
  },
  injectIframes: function(){
    console.log("injectIframe");
    // Define video instances object
    window.ytvideos = {};
    // Trigger video injections...
    $.each($('.yt'),function(vID,video){
      var id = $(video).attr('id');
      this.createVideo(video,id);
    }.bind(this));
    // ...or listen to video togglers for video injections
    $.each($('.yt-toggler'),function(vID,video){
      $(video).on('click',function(){
        var id = $(video).attr('id');
        this.createVideo(video,id);
      }.bind(this));
    }.bind(this));
  },
  createVideo: function(video,id){
    console.log("createVideo");
    var idSuffix = $(video).attr('yt-suffix');
    var finalID = idSuffix ? id+idSuffix : id;
    var playerOptions = {
      height: $(video).attr('yt-h'),
      width: $(video).attr('yt-w'),
      videoId: $(video).attr('yt-id'),
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    };
    var playerVars = this.getPlayerVars($(video).attr('yt-vars'));
    if (playerVars != "") playerOptions.playerVars = playerVars;
    $(video).parents('.'+this.options.videoWrapperClass).addClass(this.options.videoWrapperActiveClass);
    window.ytvideos[$(video).attr('yt-id')] = new YT.Player(id, playerOptions);
  },
  getPlayerVars: function(vars) {
    console.log("getPlayerVars");
    if (vars != undefined) {
      var playerVars = {};
      if (vars.indexOf(',') > 0 ) {
        var varsObj = vars.split(",");
        $.each(varsObj,function(id,option){
          var optionArr = option.split("|");
          playerVars[optionArr[0]] = optionArr[1];
        });
      }
      else {
        var option = vars.split("|");
        playerVars[option[0]] = option[1];
      }
      return playerVars;
    }
    else return vars;
  },
  fitH: function(){
    console.log("fitH");
    var videos = $('iframe.yt');
    function fitVideos(){
      $.each(videos,function(vID,v){
        $(v).css('display','block');
        $(v).height($(v).width()*this.options.hratio);
      }.bind(this));
    }
    fitVideos.call(this);
    $(window).on('resize',fitVideos.call(this));
  },
  playerStateChange: function(event){
    console.log("playerStateChange");
    var id = $(event.target.a).attr('yt-id');
    switch (event.data) {
      // unstarted
      case -1:
        break;
      // ended
      case 0:
        break;
      // playing
      case 1:
        this.playPauseVideo(id);
        if (this.tracking) this.track(event,'play');
        break;
      // paused
      case 2:
        break;
      // buffering
      case 3:
        break;
      // video cued
      case 5:
        break;
    }
  },
  playPauseVideo: function(currentID,overlay){
    console.log("playPauseVideo");
    $.each(window.ytvideos,function(vID,video){
      // manage play or pause on selected video
      if (currentID === vID) {
        switch (video.getPlayerState()) {
          // video is unstarted
          case -1:
            video.playVideo();
            break;
          // video is cued
          case 5:
            video.playVideo();
            break;
        }
      }
      // otherwise checks other video to stop them if playing
      else {
        switch (video.getPlayerState()) {
          case 1:
            video.pauseVideo();
            break;
        }
      }
    });
  },
  track: function(eventObj,eventName){
    console.log("track");
    var id = $(eventObj.target.a).data('yt-id');
    var name = $(eventObj.target.a).data('yt-name');
    var data = this.dataLayerVideoModel;
    eventObj.eventLabel = id + " | " + name;
    data.eventAction = eventName;
    dataLayer.push(data);
  }
}
