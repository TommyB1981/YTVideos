$(document).ready(function(){
  if ($('[class*="yt"]').length > 0 && !window.exportMode) {
    new YTVideos({
      instance:"ytInstance",
      overlay: true,
      onAPIReady:function(){
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
  }
});
