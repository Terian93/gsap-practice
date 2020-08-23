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


//#region oscilograph animation
TweenLite.defaultEase = Sine.easeInOut;
TweenLite.set("g", { y: 50 });

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
var star = document.querySelector("#star");
var markerDef = document.querySelector("defs .marker");
var handleDef = document.querySelector("defs .handle");
var markerLayer = document.querySelector("#marker-layer");
var handleLayer = document.querySelector("#handle-layer");

var points = [];
var snapPoints = [{x: 238, y: 312}, {x: 317.5, y: 332}]
var numPoints = star.points.numberOfItems;
const dropPositions = document.getElementsByClassName('marker--bindable');
const contactsPositions = {
  zinc: -1,
  copper: -1
}
const draggables = [];

for (var i = 0; i < numPoints; i++) {  
  var point = star.points.getItem(i);
  points[i] = {x:point.x, y:point.y};
  createHandle(point, i);
}

createClone(markerDef, markerLayer, snapPoints[0]).classList.add('marker--bindable');
createClone(markerDef, markerLayer, snapPoints[1]).classList.add('marker--bindable');

gsap.set("#svg", { autoAlpha: 1 });

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
  .to('.oscilograph', 1, {y: 0, duration: 2, }, 1)
  .to('.lemon', 1, {y: 0, duration: 6, }, 2)
  .to('.lemon-shadow', 1, {opacity: 1, width: "180px", x: 0, duration: 10}, 2)

let timeout;

function start() {
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
  star.points[0].x = 478;
  star.points[0].y = 235;
  star.points[3].x = 518;
  star.points[3].y = 235;
  lemonTimeline.play();
  clearTimeout(timeout);
}

function stop(callback) {
  lemonTimeline.reversed(true);
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, lemonTimeline.time() * 1000)
}

export default {start, stop}