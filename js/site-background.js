const root = document.documentElement;

function addPcbBackground() {
  if (document.querySelector(".pcb-background")) {
    return;
  }

  document.body.insertAdjacentHTML("afterbegin", `
    <div class="pcb-background"></div>
    <svg class="pcb-svg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
      <path class="pcb-trace" d="M0 320 H250 V185 H410 V260 H610" />
      <path class="pcb-trace" d="M1600 150 H1320 V70 H1170 V180 H1010" />
      <path class="pcb-trace" d="M0 710 H180 V640 H360 V745 H540" />
      <path class="pcb-trace" d="M1600 690 H1410 V760 H1220 V640 H990" />
      <path class="pcb-trace" d="M670 0 V190 H780 V315 H930" />
      <path class="pcb-trace" d="M840 900 V715 H720 V590 H520" />
      <path class="pcb-thin-trace" d="M120 90 H330 V130 H460" />
      <path class="pcb-thin-trace" d="M1180 430 H1360 V500 H1490" />
      <path class="pcb-thin-trace" d="M240 515 H420 V455 H610" />
      <path class="pcb-thin-trace" d="M1060 810 H1210 V720 H1380" />
      <rect class="pcb-chip" x="980" y="80" width="150" height="115" rx="12" />
      <rect class="pcb-chip" x="110" y="655" width="150" height="115" rx="12" />
      <rect class="pcb-chip" x="1260" y="565" width="170" height="130" rx="12" />
      <g>
        <rect class="pcb-pin" x="985" y="205" width="12" height="8" />
        <rect class="pcb-pin" x="1008" y="205" width="12" height="8" />
        <rect class="pcb-pin" x="1031" y="205" width="12" height="8" />
        <rect class="pcb-pin" x="1054" y="205" width="12" height="8" />
        <rect class="pcb-pin" x="1077" y="205" width="12" height="8" />
        <rect class="pcb-pin" x="1100" y="205" width="12" height="8" />
      </g>
      <g>
        <rect class="pcb-pin" x="115" y="780" width="12" height="8" />
        <rect class="pcb-pin" x="138" y="780" width="12" height="8" />
        <rect class="pcb-pin" x="161" y="780" width="12" height="8" />
        <rect class="pcb-pin" x="184" y="780" width="12" height="8" />
        <rect class="pcb-pin" x="207" y="780" width="12" height="8" />
        <rect class="pcb-pin" x="230" y="780" width="12" height="8" />
      </g>
      <circle class="pcb-pad" cx="250" cy="320" r="8" />
      <circle class="pcb-pad" cx="410" cy="185" r="8" />
      <circle class="pcb-pad" cx="610" cy="260" r="8" />
      <circle class="pcb-pad" cx="1320" cy="150" r="8" />
      <circle class="pcb-pad" cx="1170" cy="70" r="8" />
      <circle class="pcb-pad" cx="1010" cy="180" r="8" />
      <circle class="pcb-pad" cx="360" cy="640" r="8" />
      <circle class="pcb-pad" cx="540" cy="745" r="8" />
      <circle class="pcb-pad" cx="1410" cy="690" r="8" />
      <circle class="pcb-pad" cx="1220" cy="760" r="8" />
      <circle class="pcb-pad" cx="990" cy="640" r="8" />
      <circle class="pcb-pad" cx="780" cy="190" r="8" />
      <circle class="pcb-pad" cx="930" cy="315" r="8" />
      <path class="electric-flow fast" d="M0 320 H250 V185 H410 V260 H610" />
      <path class="electric-flow slow reverse" d="M1600 150 H1320 V70 H1170 V180 H1010" />
      <path class="electric-flow" d="M0 710 H180 V640 H360 V745 H540" />
      <path class="electric-flow fast reverse" d="M1600 690 H1410 V760 H1220 V640 H990" />
      <path class="electric-flow slow" d="M670 0 V190 H780 V315 H930" />
      <path class="electric-flow reverse" d="M840 900 V715 H720 V590 H520" />
      <path class="electric-flow slow" d="M120 90 H330 V130 H460" />
      <path class="electric-flow fast reverse" d="M1180 430 H1360 V500 H1490" />
      <path class="electric-flow" d="M240 515 H420 V455 H610" />
      <path class="electric-flow reverse" d="M1060 810 H1210 V720 H1380" />
    </svg>
  `);
}

addPcbBackground();

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let lastMouseX = mouseX;
let lastMouseY = mouseY;

let boardX = 0;
let boardY = 0;
let flowX = 0;
let flowY = 0;
let targetBoardX = 0;
let targetBoardY = 0;
let targetFlowX = 0;
let targetFlowY = 0;
let targetAngle = 0;

window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
}, { passive: true });

function animateElectricity() {
  const deltaX = mouseX - lastMouseX;
  const deltaY = mouseY - lastMouseY;

  targetBoardX = (mouseX - window.innerWidth / 2) / 28;
  targetBoardY = (mouseY - window.innerHeight / 2) / 28;

  const strength = 24;
  targetFlowX = Math.max(-strength, Math.min(strength, deltaX * 1.4));
  targetFlowY = Math.max(-strength, Math.min(strength, deltaY * 1.4));

  if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
    targetAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    const direction = deltaX + deltaY;
    if (direction >= 0) {
      root.style.setProperty("--electric-start", "0");
      root.style.setProperty("--electric-end", "-520");
    } else {
      root.style.setProperty("--electric-start", "-520");
      root.style.setProperty("--electric-end", "0");
    }
  }

  boardX += (targetBoardX - boardX) * 0.08;
  boardY += (targetBoardY - boardY) * 0.08;
  flowX += (targetFlowX - flowX) * 0.16;
  flowY += (targetFlowY - flowY) * 0.16;

  targetFlowX *= 0.86;
  targetFlowY *= 0.86;

  root.style.setProperty("--board-x", boardX.toFixed(2) + "px");
  root.style.setProperty("--board-y", boardY.toFixed(2) + "px");
  root.style.setProperty("--flow-x", flowX.toFixed(2) + "px");
  root.style.setProperty("--flow-y", flowY.toFixed(2) + "px");
  root.style.setProperty("--flow-angle", targetAngle.toFixed(2) + "deg");

  lastMouseX += (mouseX - lastMouseX) * 0.35;
  lastMouseY += (mouseY - lastMouseY) * 0.35;

  requestAnimationFrame(animateElectricity);
}

requestAnimationFrame(animateElectricity);

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});
