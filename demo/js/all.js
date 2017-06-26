$(document).ready(function(){
  new YTVideos({
    overlay: true,
    placeholder: {
      active: true,
      url: "img/placeholder.png",
      ext: false
    },
    hooks: [
      {
        target: 'div.video',
        ids: [
          '1Mlhnt0jMlg',
          'SCNCCuqQJvo',
          'NMSQVPkjQOU',
          'qUsQZj6h9H0'
        ]
      }
    ]
  });
});
