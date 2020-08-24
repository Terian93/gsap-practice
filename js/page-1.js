
  gsap.set('.cog-1', {
    rotation: 105,
    x: 0,
    y: -100
  });
  gsap.set('.cog-2', {
    x: -80,
    y: 15,
  });

  gsap.set('.cog-3', {
    rotation: -105,
    x: 0,
    y: -100,
  });

  gsap.set('.cog-4', {
    x: 80,
    y: 15,
  });

  gsap.set('.page-content', {
     x: 0,
     y: -20,
  });

  gsap.set('.seats', {
    opacity: 0
  })

  gsap.set('.seats-row-1', {
    opacity: 0,
    y: 15
  })

  gsap.set('.seats-row-2', {
    opacity: 0,
    y: 15
  })

  gsap.set('.seats-row-3', {
    opacity: 0,
    y: 15
  })

  const videoFilm = document.getElementById('film');
  videoFilm.loop=true;
  videoFilm.volume=0.2

  let filmTimeline = gsap.timeline({onComplete: filmCallback, onReverseComplete: ()=>console.log('cinemaReverseEnd')});
  filmTimeline
    .to('.cog-2', 1, {x: -40, duration: 2, }, 1)
    .to('.cog-4', 1, {x: 40, duration: 2,}, 1)
    .to('.seats', 1, {opacity: 1, duration: 2}, 1)
    .to('.page-content', 1, {y: 40, duration: 2, delay: 1}, 2)
    .to('.cog-1', 1, {y: -40, duration: 2, delay: 1}, 2)
    .to('.cog-3', 1, {y: -40, duration: 2, delay: 1}, 2)
    .fromTo(".cog-1",{
      rotation: 105
    },{
      rotation: 465,
      duration: 6,
      ease: "linear"
    },4)
    .fromTo(".cog-2",{
      rotation: 0
    },{
      rotation: -360,
      duration: 6,
      ease: "linear"
    },4)
    .fromTo(".cog-3",{
      rotation: -105
    },{
      rotation: -465,
      duration: 6,
      ease: "linear"
    },4)
    .fromTo(".cog-4",{
      rotation: 0
    },{
      rotation: 360,
      duration: 6,
      ease: "linear"
    },4)
    .to('.page-content', {yPercent: 100, y: 0, duration: 6}, 4)
    .to('.seats-row-3', {opacity: 1, y: 0, duration: 0.5}, 10)
    .to('.seats-row-2', {opacity: 1, y: 0, duration: 0.5}, 10.25)
    .to('.seats-row-1', {opacity: 1, y: 0, duration: 0.5}, 10.5)
    .to('.page-1', {backgroundColor: '#272727', duration: 2}, 11)
    .to('.seat', {backgroundColor: '#404040', duration: 2}, 11)
    .to('.seats', {backgroundColor: '#310202', duration: 2}, 11)
    .to('.cog', {color: '#000000', duration: 2}, 11)
    .to('.page-content', {backgroundColor: '#000000', duration: 2}, 11)
    .set('#film', {opacity: 1})
    .pause();

let timeout;

function filmCallback() {
  videoFilm.play();
}

function start() {
  filmTimeline.reversed(false);
  videoFilm.currentTime = 0;
  filmTimeline.play();
  clearTimeout(timeout);
}

function stop(callback) {
  filmTimeline.reversed(true);
  videoFilm.pause();
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  },filmTimeline.time() * 1000)
}

export default {start, stop}