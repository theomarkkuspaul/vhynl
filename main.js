let recordPaused = true;
let recordHolding = false;
let currentRotation = 0;
let foo;


let timerInterval;

const DELAY = 50;

const song = new Howl({
  src: ['tune.mp3']
});

// Each 360 degree rotation represents aorund 0.85 - 1.5 seconds of song time
$(() => {
  spinRecord();
  // handleRecordDrag();
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

    if (!song.playing())
      song.play();

    timerInterval = setInterval(function() {
      const songPlayTime = typeof(song.seek()) === 'object' ? 0 : song.seek();
      let minutes = 0, seconds = Math.floor(songPlayTime);

      while (seconds >= 60) {
        minutes += 1;
        seconds -= 60;
      }

      if (minutes < 10)
        minutes = "0" + minutes;

      if (seconds < 10)
        seconds = "0" + seconds;

      const time = `${minutes}:${seconds}`;

      $('.timer').html(time);
    }, DELAY)

    // toggle control button to prompt pause
    $(this).hide();
    $('#pause').show();
  });
}

function handlePauseClick () {
  $('#pause').click(function(e) {
    recordPaused = true;

    if (song.playing())
      song.pause();

    clearTimeout(timerInterval);

    // toggle control button to prompt play
    $(this).hide();
    $('#play').show();
  });
}

function handleRecordDrag () {
  // Thank you https://bl.ocks.org/joyrexus/7207044
  let active = false;    // true if mouse is down
  let rotation = 0;      // amount of last rotation event
  let startAngle = 0;    // starting angle of rotation event
  let endAngle = 0;
  let center = {          // center point coords of target
    x: 0,
    y: 0
  };

  // document.ontouchmove = e => e.preventDefault();  // prevent scrolling

  // Runs when the web page is first opened
  const init = function() {
    const target = $('#rotate');
    target.on("mousedown", start);
    target.on("mousemove", rotate);
    target.on("mouseup", stop);

    // Mobile
    target.on("touchstart", start);
    target.on("touchend", stop);
    target.on("touchmove", rotate);

    return;
  };

  // Convert radians to degrees
  const R2D = 180 / Math.PI;

  // Set the starting angle of the touch relative to target's center
  var start = function(e) {
    e.preventDefault();
    let x, y;
    recordHolding = true;
    song.pause()

    const {top, left, height, width} = this.getBoundingClientRect();

    center = {
      x: left + (width/2),
      y: top + (height/2)
    };

    if (e.clientX && e.clientY) {
      x = e.clientX - center.x;
      y = e.clientY - center.y;
    } else if (e.touches) {
      x = e.touches[0].clientX - center.x;
      y = e.touches[0].clientY - center.y;
    }

    foo = this.style.transform;

    startAngle = R2D * Math.atan2(y, x);
    startAngle = normaliseAngle(startAngle);

    return active = true;
  };

  // Rotate target
  var rotate = function(e) {
    e.preventDefault();
    let x, y;

    if (e.clientX && e.clientY) {
      x = e.clientX - center.x;
      y = e.clientY - center.y;
    } else if (e.touches) {
      x = e.touches[0].clientX - center.x;
      y = e.touches[0].clientY - center.y;
    }

    const d = R2D * Math.atan2(y, x);
    rotation = d - startAngle;

    let newAngle = normaliseAngle(currentRotation + rotation);

    if (active) { return this.style.transform = `rotate(${newAngle}deg)`; }
  };

  // Save the final angle of rotation
  var stop = function() {
    recordHolding = false;
    currentRotation += rotation;
    currentRotation = normaliseAngle(currentRotation);
    const endAngle = parseInt(getEndAngle(foo))
    const diff = currentRotation - endAngle;
    song.play();
    return active = false;
  };

  init();
}
