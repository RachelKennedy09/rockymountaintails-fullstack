// main.js (front-end browser JS for the marketing homepage)

//===============
// STEP 1: Grab all HTML elements (safe queries)
//===============

// NAVIGATION
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const navLinkItems = document.querySelectorAll("#navLinks a");

// DOG PROFILES
const dogContainer = document.getElementById("dogCards");

// TEAM CARDS
const teamContainer = document.getElementById("teamCards");

// FORMS
const bookingForm = document.getElementById("booking-form");
const applyForm = document.getElementById("apply-form");

// BOOKING FIELDS
const dateInput = document.getElementById("date");
const chooseBestieRadio = document.getElementById("chooseBestie");
const viewAvailableRadio = document.getElementById("viewAvailable");
const bestieContainer = document.getElementById("bestieSelectContainer");
const availableBestiesDiv = document.getElementById("availableBesties");
const calendarDiv = document.getElementById("bestieCalendar");

// SPINNER AND MESSAGE BOXES
const successDiv = document.getElementById("booking-success");
const spinner = document.getElementById("spinner");
const applySpinner = document.getElementById("apply-spinner");
const applySuccess = document.getElementById("apply-success");

// DISABLE PAST DATES (only if dateInput exists on this page)
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

//===============
// STEP 2: Global data (arrays and values)
//===============

// DOG DATA (UPDATED: /images/... paths for Express public folder)
const dogs = [
  {
    name: "Rammi",
    age: "two months",
    breed: "Rottweiler Shepherd",
    lovesWater: true,
    activity: "Playing in the river",
    image: "/images/Rami.jpeg",
  },
  {
    name: "Luna",
    age: 4,
    breed: "Husky",
    lovesWater: false,
    activity: "Zooming through snow",
    image: "/images/LunaHusky.jpeg",
  },
  {
    name: "Maple",
    age: 1,
    breed: "Golden Retriever",
    lovesWater: true,
    activity: "Chasing sticks",
    image: "/images/MapleShephard.jpeg",
  },
];

// TEAM MEMBER DATA (UPDATED: /images/... paths)
const teamMembers = [
  {
    name: "Rachel",
    image: "/images/RachandRami.jpeg",
    bio: "Mountain mama, trail guide, and Rami's best friend.",
    rating: 5,
    review: "Rachel is amazing! My dog never wants to come home.",
  },
  {
    name: "Jake",
    image: "/images/JakeandLuna.jpeg",
    bio: "Specializes in high-energy pups and snow walks.",
    rating: 5,
    review: "Jake took my husky on a trail run and she came back blissed out!",
  },
];

// PRETEND SCHEDULE FOR BESTIES
const bestieSchedule = {
  "2025-05-15": ["Rachel"],
  "2025-05-17": ["Jake"],
  "2025-05-22": ["Rachel", "Jake"],
  "2025-05-28": [], // no one available
};

//===============
// STEP 3: Functions
//===============

// NAV MENU TOGGLE
function toggleMenu() {
  if (!navLinks) return;
  navLinks.classList.toggle("show");
}

function closeMenu() {
  if (!navLinks) return;
  navLinks.classList.remove("show");
}

// DOG CARDS
function renderDogs(dogArray) {
  if (!dogContainer) return;

  dogContainer.innerHTML = "";
  dogArray.forEach((dog) => {
    const waterText = dog.lovesWater ? "loves water!" : "avoids water";
    const card = document.createElement("div");
    card.classList.add("dog-card");
    card.innerHTML = `
      <img src="${dog.image}" alt="${dog.name}" class="dog-img">
      <h3>${dog.name}</h3>
      <p>Age: ${dog.age}</p>
      <p>Breed: ${dog.breed}</p>
      <p>Activity: ${dog.activity}</p>
      <p><strong>${dog.name}</strong> ${waterText}</p>
    `;
    dogContainer.appendChild(card);
  });
}

// TEAM CARDS
function renderTeam(teamArray) {
  if (!teamContainer) return;

  teamContainer.innerHTML = "";
  teamArray.forEach((member) => {
    const stars = "⭐".repeat(member.rating);
    const card = document.createElement("div");
    card.classList.add("team-card");
    card.innerHTML = `
      <img src="${member.image}" alt="${member.name}" class="team-img" />
      <h3>${member.name}</h3>
      <p>${member.bio}</p>
      <p><strong>Client Review:</strong><br>"${member.review}"</p>
      <p class="stars">${stars}</p>
    `;
    teamContainer.appendChild(card);
  });
}

// AVAILABLE BESTIES ON SELECTED DATES
function showAvailableBestiesByDate() {
  if (!dateInput || !availableBestiesDiv) return;

  const date = dateInput.value;

  if (!date) {
    availableBestiesDiv.innerHTML = "Please select a date.";
    availableBestiesDiv.style.display = "block";
    return;
  }

  const available = bestieSchedule[date];

  if (available && available.length > 0) {
    availableBestiesDiv.innerHTML =
      "Available Besties on " + date + ": " + available.join(", ");
  } else if (available && available.length === 0) {
    availableBestiesDiv.innerHTML =
      "Sorry, no besties are available on this date. Please pick another option.";
  } else {
    availableBestiesDiv.innerHTML = "No availability data for that date yet.";
  }

  availableBestiesDiv.style.display = "block";
}

// SHOW FAKE CALENDAR WITH AVAILABLE DATES
function showFakeBestieCalendar() {
  if (!calendarDiv) return;

  const availableDates = ["2025-05-15", "2025-05-17", "2025-05-22"];
  calendarDiv.innerHTML = "<strong> Bestie Availability: </strong><br>";

  availableDates.forEach((date) => {
    const dateBox = document.createElement("div");
    dateBox.classList.add("date-box");
    dateBox.textContent = date;
    calendarDiv.appendChild(dateBox);
  });

  calendarDiv.style.display = "flex";
}

//===============
// STEP 4: Form Handlers
//===============

// BOOKING FORM
function handleBookingSubmit(event) {
  event.preventDefault();

  if (!bookingForm || !spinner || !successDiv) return;

  const bestieSelect = document.getElementById("bestie");
  const ownerName = document.getElementById("owner-name")?.value.trim();
  const dogName = document.getElementById("dog-name")?.value.trim();
  const service = document.getElementById("service")?.value.trim();
  const date = document.getElementById("date")?.value.trim();

  if (ownerName && dogName && service && date) {
    spinner.style.display = "inline-block";

    let bestieMessage = "";

    if (chooseBestieRadio?.checked) {
      const chosen = bestieSelect?.value;
      bestieMessage = chosen ? ` with bestie ${chosen}` : "";
    } else {
      const available = bestieSchedule[date];
      bestieMessage =
        available && available.length
          ? ` with bestie ${available.join(" and ")}`
          : " but no besties were available on that date";
    }

    setTimeout(() => {
      spinner.style.display = "none";
      successDiv.style.display = "block";
      successDiv.textContent = `Thank you, ${ownerName}! Your ${service} booking for ${dogName} on ${date} is confirmed${bestieMessage}. 🐾`;

      bookingForm.reset();
    }, 1500);
  } else {
    alert("Please fill out all required fields.");
  }
}

// APPLY FORM
function handleApplySubmit(event) {
  event.preventDefault();

  if (!applyForm || !applySpinner || !applySuccess) return;

  const name = document.getElementById("applicant-name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const about = document.getElementById("about")?.value.trim();

  if (name && email && about) {
    applySpinner.style.display = "inline-block";

    setTimeout(() => {
      applySpinner.style.display = "none";
      applySuccess.style.display = "block";
      applySuccess.textContent = `Thanks, ${name}! Your application has been received. We'll be in touch at ${email}.`;

      applyForm.reset();
    }, 1500);
  } else {
    alert("Please fill out all required fields.");
  }
}

//===============
// STEP 5: Event Listeners (guarded)
//===============

// RESPONSIVE NAV MENU
if (hamburger) hamburger.addEventListener("click", toggleMenu);
if (navLinkItems && navLinkItems.length) {
  navLinkItems.forEach((link) => link.addEventListener("click", closeMenu));
}

// FORMS
if (bookingForm) bookingForm.addEventListener("submit", handleBookingSubmit);
if (applyForm) applyForm.addEventListener("submit", handleApplySubmit);

// WHEN USER SELECTS "REQUEST A BESTIE"
if (chooseBestieRadio) {
  chooseBestieRadio.addEventListener("change", () => {
    if (bestieContainer) bestieContainer.style.display = "block";
    if (availableBestiesDiv) availableBestiesDiv.style.display = "none";
    if (calendarDiv) calendarDiv.style.display = "none";
  });
}

// CHECK WHO IS AVAILABLE
if (viewAvailableRadio) {
  viewAvailableRadio.addEventListener("change", () => {
    if (bestieContainer) bestieContainer.style.display = "none";
    showAvailableBestiesByDate();
    showFakeBestieCalendar();
  });
}

// If the user changes the date and "Show who is available" is selected
if (dateInput) {
  dateInput.addEventListener("change", () => {
    if (viewAvailableRadio?.checked) {
      showAvailableBestiesByDate();
    }
  });
}

// INITIAL PAGE LOAD
renderDogs(dogs);
renderTeam(teamMembers);
