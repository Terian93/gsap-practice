import CustomEase from "../gsap/CustomEase.js";
import ScrollTrigger from "../gsap/ScrollTrigger.js";
gsap.registerPlugin(MotionPathPlugin, CSSRule, CustomEase, ScrollTrigger);
gsap.registerPlugin(ScrollTrigger);
import page1 from './js/page-1.js';
import page2 from './js/page-2.js';
import page3 from './js/page-3.js';

document.getElementById('page-1').style.display='none';
document.getElementById('page-2').style.display='none';
document.getElementById('page-3').style.display='none';

//Default position
gsap.set('.nav-arrow', {
  y: -20,
  x: 0,
});

//#region Navigation
function moveToNavItem(position) {
  const arrow = document.getElementsByClassName('nav-arrow')[0];
  arrow.classList.add('nav-arrow--visible');

  const arrowGS = gsap.getProperty('.nav-arrow');
  gsap.to('.nav-arrow', {
    motionPath: {
      path: [
        /*p1*/{x:0, y:arrowGS('y')}, 
        /*p2*/{x:10, y:(position + arrowGS('y')) / 2},
        /*p3*/{x:0, y:position},
      ],
      curvines: 3,
      autoRotate: false
    },
    duration: 0.3,
    ease: "ease"
  });
};

let currentPage = 0;

function showFirstPage() {
  page1.start();
  document.getElementById('page-1').style.display='block';
  document.getElementById('page-2').style.display='none';
  document.getElementById('page-3').style.display='none';
}

function firstPage() {
  moveToNavItem(0);
  switch (currentPage) {
    case 1:
      break;
    case 2:
      page2.stop(() => {
        showFirstPage();
      });
      break;

    case 3:
      page3.stop(() => {
        showFirstPage();
      });
      break;
  
    default:
      showFirstPage();
      break;
  }
  currentPage = 1;
  
}

function showSecondPage() {
  page2.start();
  document.getElementById('page-1').style.display='none';
  document.getElementById('page-2').style.display='block';
  document.getElementById('page-3').style.display='none';
}

function secondPage() {
  moveToNavItem(36);

  switch (currentPage) {
    case 1:
      page1.stop(() => {
        showSecondPage();
      });
      break;

    case 2:
      break;
    
    case 3:
      page3.stop(() => {
        showSecondPage();
      });
      break;
  
    default:
      showSecondPage();
      break;
  }
  currentPage = 2;
}

function showThirdPage() {
  page3.start();
  document.getElementById('page-1').style.display='none';
  document.getElementById('page-2').style.display='none';
  document.getElementById('page-3').style.display='block';
  ScrollTrigger.refresh();
}

function thirdPage() {
  moveToNavItem(72);
  switch (currentPage) {
    case 1:
      page1.stop(() => {
        showThirdPage();
      });
      break;
    
    case 2:
      page2.stop(() => {
        showThirdPage();
      });
      break;

    case 3:
      break;
  
    default:
      showThirdPage();
      break;
  }
  currentPage = 3;
}

window.firstPage = firstPage;
window.secondPage = secondPage;
window.thirdPage = thirdPage;
//#endregion