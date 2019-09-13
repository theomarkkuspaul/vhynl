$(() => {
  // Hold Event 
  $('.record').on('mousedown touchstart', function(e) {
    $(this).css({animationPlayState: 'paused'})
  }).bind('mouseup mouseleave touchend', function() {
    $(this).css({animationPlayState: 'running'})
  });

});
