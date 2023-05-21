// text aimation with typed package
let typed = new Typed("#element", {
  strings: ["complete", "done"],
  typeSpeed: 150,
  backSpeed: 150,
  loop: true,
});

// elements
const formContainer = document.getElementById("form-container");
const form = document.querySelector("form");
const dateElement = document.getElementById("date");

const countdownTitle = document.getElementById("countdown-title");
const countdown = document.getElementById("countdown");
const countdownBtn = document.getElementById("reset-button");
const timeElements = document.querySelectorAll("span");

const complete = document.getElementById("complete");
const completeInfo = document.getElementById("complete-info");
const completeButton = document.getElementById("complete-button");

let title;
let date;
let dateValue;
let countdownActive;

// time logic
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// minimum selected day
let today = new Date().toISOString();
today = today.split("T")[0];
dateElement.setAttribute("min", today);

// update ui
function updateDom() {
  // start time
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = dateValue - now;

    // calculate remain time
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);

    formContainer.hidden = true;

    // update ui according to remain time
    if (distance < 0) {
      countdown.hidden = true;
      clearInterval(countdownActive);
      completeInfo.textContent = `${title} finished on ${date}`;
      complete.hidden = false;
    } else {
      countdownTitle.textContent = `${title}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      complete.hidden = true;
      countdown.hidden = false;
    }
  }, second);
}

// submit functionality
function submitForm(e) {
  e.preventDefault();
  title = e.srcElement[0].value;
  date = e.srcElement[1].value;

  savedCountdown = {
    title,
    date,
  };

  localStorage.setItem("countdown", JSON.stringify(savedCountdown));

  if (date === "") {
    alert("Please specify date");
  } else {
    dateValue = new Date(date).getTime();
    updateDom();
  }
}

// reset functionality
function resetCountdown() {
  formContainer.hidden = false;
  countdown.hidden = true;

  clearInterval(countdownActive);
  title = "";
  date = "";
  localStorage.removeItem("countdown");
}

// restore countdown with local storage
function restoreCountdown() {
  if (localStorage.getItem("countdown")) {
    formContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));

    ({ title, date } = savedCountdown);
    dateValue = new Date(date);
    updateDom();
  }
}

//submit event
form.addEventListener("submit", submitForm);
// reset button click event
countdownBtn.addEventListener("click", resetCountdown);
// back to form event
completeButton.addEventListener("click", () => {
  formContainer.hidden = false;
  complete.hidden = true;
});

// call restore countdown
restoreCountdown();
