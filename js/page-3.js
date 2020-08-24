//#region scroll navigation
const slides = document.querySelectorAll("section.slide");
const container = document.querySelector("#panelWrap");
let dots = document.querySelector(".dots");
let toolTips = document.querySelectorAll(".tool-tip");
let oldSlide = 0;
let activeSlide = 0;
let navDots = [];
let dur = 0.6;
let offsets = [];
let toolTipAnims = [];
let ih = window.innerHeight;

for (let i = 0; i < slides.length; i++) {
  let tl = gsap.timeline({paused:true, reversed:true});
  let newDot = document.createElement("div");
  newDot.className = "dot";
  newDot.index = i;
  navDots.push(newDot);
  newDot.addEventListener("click", slideAnim);
  newDot.addEventListener("mouseenter", dotHover);
  newDot.addEventListener("mouseleave", dotHover);
  dots.appendChild(newDot);
  offsets.push(-slides[i].offsetTop);
  tl.to(toolTips[i], 0.25, {opacity:1, ease:Linear.easeNone});
  toolTipAnims.push(tl);
}

const dotAnim = gsap.timeline({paused:true});
dotAnim
  .to(
    ".dot",
    {
      stagger: { each: 1, yoyo: true, repeat: 1 },
      scale: 1.5,
      rotation: 0.1,
      ease: "none"
    },
    0.5
  )
dotAnim.time(1);

function dotHover() {
  toolTipAnims[this.index].reversed() && this.index !== activeSlide
    ? toolTipAnims[this.index].play()
    : toolTipAnims[this.index].reverse();
}

function slideAnim(e) {
  const currentSlide = slides[activeSlide];
  if (
    e.deltaY > 0 && currentSlide.scrollHeight - currentSlide.scrollTop === currentSlide.clientHeight ||
    e.deltaY < 0 && currentSlide.scrollTop === 0  ||
    e.type === 'click'
  ) {

    oldSlide = activeSlide;
  
    if (gsap.isTweening(container)) {
      return;
    }
  
    if (this.className === "dot") {
      activeSlide = this.index;
    } else {
      activeSlide = e.deltaY > 0 ? (activeSlide += 1) : (activeSlide -= 1);
    }
    
    activeSlide = activeSlide < 0 ? 0 : activeSlide;
    activeSlide = activeSlide > slides.length - 1 ? slides.length - 1 : activeSlide;
    if (oldSlide === activeSlide) {
      return;
    }
    if (activeSlide >= 2) {
      gsap.to('.navigation-wrapper', {backgroundColor: '#fff', delay: dur});
    } else {
      gsap.set('.navigation-wrapper', {backgroundColor: 'transparent'});
    }
    gsap.to(container, dur, { y: offsets[activeSlide], ease:"power2.inOut", onUpdate:tweenDot });
  }
  
}

window.addEventListener("wheel", slideAnim);

toolTips[0].classList.add('tool-tip--active');

function tweenDot() {
  gsap.set(dotAnim, {
    time: Math.abs(gsap.getProperty(container, "y") / ih) + 1
  });
  for (let index = 0; index < slides.length; index++) {
    if (index === activeSlide) {
      toolTips[index].classList.add('tool-tip--active');
    } else {
      toolTips[index].classList.remove('tool-tip--active');
    }
  }
}
//#endregion

//#region start section
const scrollWheelTimeline = gsap.timeline({
  repeat: -1,
});
scrollWheelTimeline
  .fromTo('#scroll-wheel', {y: 0}, {
    y: 10,
    ease: 'easeIn',
    duration: 1,
  }, 1)
  .to('#scroll-wheel', {
    y: 0,
    ease: 'easeOut',
    duration: 0.3,
  }, 2);
//#endregion

//#region welcome section
const welcomeGradient = gsap.timeline({
  scrollTrigger: {
    trigger: '.header',
    toggleActions: "play none none none",
  },
});

gsap.set('.welcome-section', {
  background: 'linear-gradient(37deg, rgba(2,0,36,1) 85%, rgba(9,83,121,1) 88%, rgba(0,212,255,1) 100%)',
})
welcomeGradient
  .to('.welcome-section', {
    background: "linear-gradient(37deg, rgba(2,0,36,1) 5%, rgba(9,83,121,1) 30%, rgba(0,212,255,1) 100%)",
    duration: 6
  }, 1)
  .to('.header-ending', {
    opacity: 1,
    x: 30,
    duration: 2,
  }, 2)
  .to('.header', {
    x: -30,
    duration: 2,
  }, 2);
//#endregion

//#region photo gallery
let offsetWidth = 0;
let photoSlides = gsap.utils.toArray('.photo-gallery__slide');

gsap.to(photoSlides, {
  xPercent: -100 * (photoSlides.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".photo-gallery__wrapper",
    pin: true,
    scrub: 1,
    scroller: '.photo-gallery',
    snap: 1 / (photoSlides.length - 1),
    end: () => {
      if (document.querySelector(".photo-gallery__wrapper").offsetWidth > 0) {
        offsetWidth = document.querySelector(".photo-gallery__wrapper").offsetWidth;
      }
      return "+=" + offsetWidth;
    }
  }
})
//#endregion

function resetSections() {
  activeSlide = 0;
  oldSlide = 0;
  gsap.set('.navigation-wrapper', {backgroundColor: 'transparent'});
  gsap.set(container, { y: offsets[activeSlide]});
  slides.forEach(slide =>  {
    slide.scrollTop = 0;
  });
  tweenDot();
  gsap.set('.welcome-section', {
    background: 'linear-gradient(37deg, rgba(2,0,36,1) 85%, rgba(9,83,121,1) 88%, rgba(0,212,255,1) 100%)',
  })
  welcomeGradient.time(0);
}

let timeout;

function start() {
  resetSections();
}

function stop(callback) {
  resetSections();
  callback();
}

export default {start, stop}