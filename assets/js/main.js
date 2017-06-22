$(document).ready(function(){
  if ($('[class*="yt"]').length > 0 && !window.exportMode) {
    new YTVideos({
      instance:"ytInstance"
    });
  }
});
