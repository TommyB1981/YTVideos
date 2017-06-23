$(document).ready(function(){
  if ($('[class*="yt"]').length > 0) {
    new YTVideos({
      placeholder: {
        active: true,
        url: "img/placeholder.png",
        ext: false
      }
    });
  }
});
