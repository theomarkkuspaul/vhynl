let recordPaused = true;
let recordHolding = false;
let currentRotation = 0;

$(() => {
  spinRecord();
  handleRecordDrag();
  handlePlayClick();
  handlePauseClick();
});

function spinRecord () {
  // rotate record every 4.8 ms i.e. 45bpm
  const repeatSpeed = 4.8;
  setInterval(rotateRecord, repeatSpeed);
}

function rotateRecord () {
  if (recordHolding)
    return;

  if (!recordPaused) {
    currentRotation++;

    $('.record').css('transform','rotate(' + currentRotation + 'deg)');
  }
}

function handlePlayClick () {
  $('#play').click(function(e) {
    recordPaused = false;
  });
}

function handlePauseClick () {
  $('#pause').click(function(e) {
    recordPaused = true;
  });
}

function handleRecordDrag () {
  // Thank you https://bl.ocks.org/joyrexus/7207044
  let active = false;    // true if mouse is down
  let rotation = 0;      // amount of last rotation event
  let startAngle = 0;    // starting angle of rotation event
  let center = {          // center point coords of target
    x: 0,
    y: 0
  };

  document.ontouchmove = e => e.preventDefault();  // prevent scrolling

  // Runs when the web page is first opened
  const init = function() {
    const target = $('#rotate');
    target.on("mousedown", start);
    target.on("mousemove", rotate);
    return target.on("mouseup", stop);
  };

  // Convert radians to degrees
  const R2D = 180 / Math.PI;

  // Set the starting angle of the touch relative to target's center
  var start = function(e) {
    e.preventDefault();
    recordHolding = true;

    const {top, left, height, width} = this.getBoundingClientRect();
    center = {
      x: left + (width/2),
      y: top + (height/2)
    };
    const x = e.clientX - center.x;
    const y = e.clientY - center.y;
    startAngle = R2D * Math.atan2(y, x);
    return active = true;
  };

  // Rotate target
  var rotate = function(e) {
    e.preventDefault();

    const x = e.clientX - center.x;
    const y = e.clientY - center.y;
    const d = R2D * Math.atan2(y, x);
    rotation = d - startAngle;
    if (active) { return this.style.webkitTransform = `rotate(${currentRotation + rotation}deg)`; }
  };

  // Save the final angle of rotation
  var stop = function() {
    currentRotation += rotation;
    recordHolding = false;
    return active = false;
  };

  init();
}