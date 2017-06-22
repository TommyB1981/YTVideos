function YTVideos(options) {
  this.init(options);
}

YTVideos.prototype = {

  // DEFAULT OPTIONS
  options: {
    hratio: 0.5625,
    videoWrapperClass: "videoWrapper",
    videoWrapperActiveClass: "on",
    instance: null,
    tracking: false,
    overlay: false,
    onAPIReady: Function(),
    onPlayerReady: Function(),
    onPlayerStateChange: Function()
  },

  // METHODS
  init: function(options){
    // console.log("init");
    this.setOptions(options,function(){
      window[this.options.instance] = this;
      this.checkYouTubeIframeAPI();
    }.bind(this));
  },
  checkYouTubeIframeAPI: function(){
    // console.log("checkYouTubeIframeAPI");
    this.setYouTubeIframeAPICallbacks();
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
    // console.log("run");
    this.injectIframes();
    if (window.dataLayer && this.options.tracking) this.setTracking();
  },
  setOptions: function(options,callback){
    // console.log("setOptions");
    this.options = $.extend({},this.options,options);
    if (typeof callback == "function") callback();
  },
  setTracking: function(){
    // console.log("setTracking");
    this.dataLayerVideoModel = {
      'event': 'uaevent',
      'eventCategory': 'video',
      'eventAction': null,
      'eventLabel': null
    }
    this.tracking = true;
  },
  setYouTubeIframeAPICallbacks: function() {
    // console.log("setYouTubeIframeAPICallbacks");
    var instanceName = this.options.instance;
    window.onYouTubeIframeAPIReady = function(){
      window[instanceName].run();
      window[instanceName].triggerEvent('APIReady');
    }
    window.onPlayerReady = function(event){
      window[instanceName].fitH();
      if (window[instanceName].options.overlay) window[instanceName].setOverlay($(event.target.a).attr('yt-id'));
      window[instanceName].triggerEvent('PlayerReady',event);
    }
    window.onPlayerStateChange = function(event){
      window[instanceName].playerStateChange(event);
      window[instanceName].triggerEvent('PlayerStateChange',event);
    }
  },
  setOverlay: function(id){
    console.log("setOverlay");
    var iframe = $('iframe[yt-id="'+id+'"]');
    iframe.css({
      position: "relative",
      "z-index": 0
    });
    var wrapper = iframe.parent();
    wrapper.css('position','relative');
    $(wrapper).append('<div class="overlay"></div>');
    var overlay = $(wrapper).find('.overlay');
    overlay.css({
      position: "absolute",
      "z-index": 1,
      width: "100%",
      height: "100%",
      left: 0,
      right: 0
    });
    $(overlay).on('click',function(e){
      this.playPauseVideo(id,true);
    });
  },
  triggerEvent: function(eventName,event){
    // console.log("triggerEvent");
    this.options['on'+eventName].call(this,event);
  },
  injectIframes: function(){
    // console.log("injectIframe");
    window.ytvideos = {};
    $.each($('.yt'),function(vID,video){
      var id = $(video).attr('id');
      this.createVideo(video,id);
    }.bind(this));
    $.each($('.yt-toggler'),function(vID,video){
      $(video).on('click',function(){
        var id = $(video).attr('id');
        this.createVideo(video,id);
      }.bind(this));
    }.bind(this));
  },
  createVideo: function(video,id){
    // console.log("createVideo");
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
    // console.log("getPlayerVars");
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
    // console.log("fitH");
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
    // console.log("playerStateChange");
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
    // console.log("playPauseVideo");
    $.each(window.ytvideos,function(vID,video){
      // manage play or pause on selected video
      if (currentID === vID) {
        switch (video.getPlayerState()) {
          // unstarted
          case -1:
            if (this.hasOverlay(vID)) this.removeOverlay(vID);
            video.playVideo();
            break;
          // paused
          case 2:
            if (!this.hasOverlay(vID)) this.setOverlay(vID);
            if (overlay) {
              if (this.hasOverlay(vID)) this.removeOverlay(vID);
              video.playVideo();
            }
            break;
          // video is cued
          case 5:
            if (this.hasOverlay(vID)) this.removeOverlay(vID);
            video.playVideo();
            break;
        }
      }
      // otherwise checks other video to stop them if playing
      else {
        switch (video.getPlayerState()) {
          case 1:
            if (!this.hasOverlay(vID)) this.setOverlay(vID);
            video.pauseVideo();
            break;
        }
      }
    });
  },
  track: function(eventObj,eventName){
    // console.log("track");
    var id = $(eventObj.target.a).data('yt-id');
    var name = $(eventObj.target.a).data('yt-name');
    var data = this.dataLayerVideoModel;
    eventObj.eventLabel = id + " | " + name;
    data.eventAction = eventName;
    dataLayer.push(data);
  },
  hasOverlay: function(id){
    console.log("hasOverlay");
    var presence = $('iframe[yt-id="'+id+'"]').siblings('.overlay').length > 0 ? true : false;
    return presence;
  },
  removeOverlay: function(id){
    console.log("removeOverlay");
    $('iframe[yt-id="'+id+'"]').siblings('.overlay').remove();
  }

}
