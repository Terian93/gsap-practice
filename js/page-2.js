import CustomEase from "../gsap/CustomEase.js";
import Draggable from "../gsap/Draggable.js";

// var width = 800;
// var sinus = new CustomEase("sinus", "M0,0 C0.4,0 0.3,1 0.5,1 0.7,1 0.6,0 1,0");
// console.log(sinus);

gsap.set('.oscilograph', {
  x: 0,
  y: 160
});

gsap.set('.lemon', {
  x: 0,
  y: -900
});

gsap.set('.lemon-shadow', {
  opacity: 0,
  width: 0,
  x: 50
})

gsap.set('.lemon-holes', {
  y: -900
});


//#region oscilograph animation
TweenLite.defaultEase = Sine.easeInOut;
TweenLite.set("g.line-group", { y: 50 });

var svg   = document.querySelector("svg");
var wave  = document.querySelector("#wave");
var width = 300;
var sinus = new CustomEase("sinus", "M0,0 C0.2,0 0.3,1 0.5,1 0.7,1 0.9,0 1,0");

var amplitude = 80;
var frequency = 20;
var segments  = 2000;
var interval  = width / segments;

for (var i = 0; i < segments; i++) {
  
  var norm  = i / (segments - 1);  
  var point = wave.points.appendItem(svg.createSVGPoint());
  
  point.x = i * interval;
  point.y = amplitude / 2 * sinus.ease(norm);
  
  TweenMax.to(point, 0.3, { y: -point.y, repeat: -1, yoyo: true, ease: Sine.easeInOut }).progress(norm * frequency);
}
//#endregion

//#region wires
var wires = document.querySelector("#wires");
var markerDef = document.querySelector("defs .marker");
var handleDef = document.querySelector("defs .handle");
var markerLayer = document.querySelector("#marker-layer");
var handleLayer = document.querySelector("#handle-layer");
var oscilograph = document.querySelector(".oscilograph");
var player = document.getElementById("player");
player.volume = 0.8;


var points = [];
var snapPoints = [{x: 238, y: 312}, {x: 317, y: 330}]
var numPoints = wires.points.numberOfItems;
const dropPositions = document.getElementsByClassName('marker--bindable');
let contactsPositions = {
  zinc: -1,
  copper: -1
}
const draggables = [];

for (var i = 0; i < numPoints; i++) {  
  var point = wires.points.getItem(i);
  points[i] = {x:point.x, y:point.y};
  createHandle(point, i);
}

createClone(markerDef, markerLayer, snapPoints[0]).classList.add('marker--bindable');
createClone(markerDef, markerLayer, snapPoints[1]).classList.add('marker--bindable');

gsap.set("#stage", { autoAlpha: 1 });

function createHandle(point, index) {
  var marker = createClone(markerDef, markerLayer, point);
  if (index === 0 || index === 3) {
    var handle = createClone(handleDef, handleLayer, point);
    if (index === 0) {
      handle.classList.add('handle--zinc');
    } else if (index === 3) {
      handle.classList.add('handle--copper');
    }
    draggables.push(new Draggable(handle, {
      bounds: window,
      throwProps: true,
      onDrag: moveAction,
      throwResistance: 1000,
      liveSnap: {
        points: snapPoints,
        radius: 20
      },
      snap: {
        points: snapPoints,
        radius: 100
      },
      onDragEnd: checkIfSnapped
    }));
    
    function moveAction(position) {
      point.x = this.x;
      point.y = this.y + 10;
      oscilograph.classList.remove('oscilograph--active');
      disableAllLights();
    }

  }
}

function checkIfSnapped() {
  if (this.target.classList.contains('handle--zinc')) {
    logBindPosition.call(this, 'zinc');
  } else {
    logBindPosition.call(this, 'copper');
  }
  if(contactsPositions.zinc !== contactsPositions.copper && 
    contactsPositions.zinc >= 0 && 
    contactsPositions.copper >= 0) {
    console.log('hit');
    oscilograph.classList.add('oscilograph--active');
    enableLights();
  }
}

function logBindPosition(type) {
  if (this.hitTest(dropPositions[0])) {
    contactsPositions[type] = 0;
    gsap.to('.handle--' + type, {
      y: this.y + 5
    });
    gsap.to('#first-hole', {
      opacity: 0.8
    });
  } else if (this.hitTest(dropPositions[1])) {
    contactsPositions[type] = 1;
    gsap.to('.handle--' + type, {
      y: this.y + 5
    });
    gsap.to('#second-hole', {
      opacity: 0.9
    });
  } else {
    contactsPositions[type] = -1;
  }
}


function createClone(node, parent, point) {
  var element = node.cloneNode(true);
  parent.appendChild(element);
  TweenLite.set(element, { x: point.x, y: point.y });
  return element;
}
//#endregion

let lemonTimeline = gsap.timeline({onReverseComplete: ()=>console.log('cinemaReverseEnd')});
lemonTimeline
  .fromTo('.page-2', 1, {backgroundColor: "#fff"}, {backgroundColor: "#aaa", duration: 5}, 1)
  .to('.oscilograph', 1, {y: 0, duration: 2, }, 2)
  .to('.lemon', 1, {y: 0, duration: 6, }, 3)
  .to('.lemon-shadow', 1, {opacity: 1, width: "180px", x: 0, duration: 6}, 3)
  .to('.lemon-holes', 1, {
    y: 0,
    duration: 6
  }, 3)
  .fromTo('#stage', 1, {
    x: 780
  }, {
    x: 0,
    duration: 6
  }, 4);
 
//#region lights
const partyLightsTimeline = gsap.timeline({repeat: -1});
partyLightsTimeline
  .fromTo('.light', 3, {backgroundColor: "#ff7f00"}, {backgroundColor: "#9400d3", duration: 0.5}, 1)
  .to('.light', 3, {backgroundColor: "#00ff00", duration: 1}, 2)
  .to('.light', 3, {backgroundColor: "#ff0000", duration: 1}, 3)
  .to('.light', 3, {backgroundColor: "#4b0082", duration: 1}, 4)
  .to('.light', 3, {backgroundColor: "#ffff00", duration: 1}, 5)
  .to('.light', 3, {backgroundColor: "#0000ff", duration: 1}, 6)
  .to('.light', 3, {backgroundColor: "#ff7f00", duration: 0.5}, 7)

gsap.set('.light', {clearProps: "all"})

let lightsEnabled = true;

function enableLights() {
  partyLightsTimeline.play();
  lightsEnabled = true;
  player.play();
  gsap.set('.bulb-light', {opacity: 1});
  gsap.set('.bulb-wire', {opacity: 1});
}

function disableAllLights() {
  if (lightsEnabled) {
    partyLightsTimeline.pause();
    player.pause();
    gsap.set('.light', {clearProps: "all"});
    gsap.set('.page-2', {backgroundColor: "#aaa"});
    gsap.set('.bulb-light', {opacity: 0});
    gsap.set('.bulb-wire', {opacity: 0});
    lightsEnabled = false;
  }
}
//#endregion

let timeout;

function start() {
  player.currentTime = 0;
  contactsPositions = {
    zinc: -1,
    copper: -1
  };
  disableAllLights();
  oscilograph.classList.remove('oscilograph--active');
  lemonTimeline.reversed(false);
  lemonTimeline.time(0);
  gsap.set('#first-hole', {
    opacity: 0
  });

  gsap.set('#second-hole', {
    opacity: 0
  });

  gsap.set('.handle--zinc', {
    x:478,
    y:235
  })
  gsap.set('.handle--copper', {
    x:518,
    y:235
  })
  wires.points[0].x = 478;
  wires.points[0].y = 235;
  wires.points[3].x = 518;
  wires.points[3].y = 235;
  lemonTimeline.play();
  clearTimeout(timeout);
}

function stop(callback) {
  disableAllLights();
  let wireWrapper = gsap.timeline({onComplete: reversePageWraping});
  wireWrapper.to('.handle--zinc', 1, {
    x:478,
    y:235,
    duration: 1
  }, 1);
  wireWrapper.to('.handle--copper', 1, {
    x:518,
    y:235,
    duration: 1
  }, 1);
  wireWrapper.to(wires.points[0], 1, {
    x: 478,
    y: 235,
    duration: 1,
  }, 1);
  wireWrapper.to(wires.points[3], 1, {
    x: 518,
    y: 235,
    duration: 1,
  }, 1);
  wireWrapper.play();

  function reversePageWraping() {
    oscilograph.classList.remove('oscilograph--active');
    lemonTimeline.reversed(true);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      callback();
      clearTimeout(timeout);
    }, lemonTimeline.time() * 1000)
  }
}

export default {start, stop}