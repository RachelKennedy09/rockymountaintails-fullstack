//===============
//STEP 1: Grab all HTML elements. These all can be at the top of the page, as they only run once.
// ==============

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

//DISABLE PAST DATES
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

//=============
//STEP 2: Global data (arrays and values): defining any reusable data.
//=============

// DOG DATA
const dogs = [
  {
    name: "Rammi",
    age: "two months",
    breed: "Rottweiler Shepherd",
    lovesWater: true,
    activity: "Playing in the river",
    image: "images/Rami.jpeg",
  },
  {
    name: "Luna",
    age: 4,
    breed: "Husky",
    lovesWater: false,
    activity: "Zooming through snow",
    image: "images/LunaHusky.jpeg",
  },
  {
    name: "Maple",
    age: 1,
    breed: "Golden Retriever",
    lovesWater: true,
    activity: "Chasing sticks",
    image: "images/MapleShephard.jpeg",
  },
];

// TEAM MEMBER DATA
const teamMembers = [
  {
    name: "Rachel",
    image: "images/RachandRami.jpeg",
    bio: "Mountain mama, trail guide, and Rami's best friend.",
    rating: 5,
    review: "Rachel is amazing! My dog never wants to come home.",
  },
  {
    name: "Jake",
    image: "images/JakeandLuna.jpeg",
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
  "2025-05-28": [], //no one available
};

//==============
//STEP 3: Functions: Defining the behavior
//==============

// NAV MENU TOGGLE
function toggleMenu() {
  navLinks.classList.toggle("show");
}

function closeMenu() {
  navLinks.classList.remove("show");
}

// DOG CARDS
function renderDogs(dogArray) {
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
  const date = dateInput.value;
  //saying if (!date) does not equal to them clicking a date and to pick one
  if (!date) {
    availableBestiesDiv.innerHTML = "Please select a date.";
    availableBestiesDiv.style.display = "block";
    return;
  }

  const available = bestieSchedule[date]; //looking up the availability

  if (available.length > 0) {
    //this is saying if there are besties available, show their names
    availableBestiesDiv.innerHTML =
      "Available Besties on " + date + ": " + available.join(", ");
  } else if (available && available.length === 0) {
    //if we know the date but no one is free
    availableBestiesDiv.innerHTML =
      "Sorry, no besties are available on this date. Please pick an other option.";
  } else {
    //if there is no data for that date at all
    availableBestiesDiv.innerHTML = "No availability data for that date yet.";
  }
  availableBestiesDiv.style.display = "block"; //show the results
}

//SHOW FAKE CALENDAR WITH AVAILABLE DATES
function showFakeBestieCalendar() {
  const availableDates = ["2025-05-15", "2025-05-17", "2025-05-22"];

  calendarDiv.innerHTML = "<strong> Bestie Availability: </strong><br>"; //adding title text

  //Creating a loop to go through the fake dates and create a visual box for each one
  availableDates.forEach((date) => {
    const dateBox = document.createElement("div"); //creating a box div
    dateBox.classList.add("date-box"); //styling
    dateBox.textContent = date; // add the date text inside the box
    calendarDiv.appendChild(dateBox); // attach the box to the calendar section
  });

  calendarDiv.style.display = "flex"; //showing on screen
}

//------------
// STEP 4: Form Handlers
//---------------

// BOOKING FORM
function handleBookingSubmit(event) {
  event.preventDefault(); // stops form from reloading normally

  //grab user input
  const bestieSelect = document.getElementById("bestie");
  const ownerName = document.getElementById("owner-name").value.trim();
  const dogName = document.getElementById("dog-name").value.trim();
  const service = document.getElementById("service").value.trim();
  const date = document.getElementById("date").value.trim();

  if (ownerName && dogName && service && date) {
    spinner.style.display = "inline-block";

    // build a message based on the user's bestie selection
    let bestieMessage = ""; // start with an empty message

    if (chooseBestieRadio.checked) {
      const chosen = bestieSelect.value;
      // If user chose a bestie, include their name
      bestieMessage = chosen ? ` with bestie ${chosen}` : "";
    } else {
      // If "see who's available" was selected, use this message instead
      const available = bestieSchedule[date]; // get besties for selected date
      bestieMessage =
        available && available.length
          ? ` with bestie ${available.join(" and ")}`
          : " but no besties were available on that date";
    }

    //using asynchronous to settime to simulate data being processed and user getting feedback
    setTimeout(() => {
      spinner.style.display = "none"; //hiding spinner
      successDiv.style.display = "block"; //shows message "block"
      successDiv.textContent =
        successDiv.textContent = `Thank you, ${ownerName}! Your ${service} booking for ${dogName} on ${date} is confirmed${bestieMessage}. 🐾`;

      bookingForm.reset(); //where I clear the form for 1500ms (1.5 seconds)
    }, 1500);
  } else {
    alert("please fill out all required fields.");
  }
}

// APPLY FORM

function handleApplySubmit(event) {
  event.preventDefault(); // stops form from reloading normally

  // Grab user input values // using trip to remove extra spaces.
  const name = document.getElementById("applicant-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const about = document.getElementById("about").value.trim();

  //targeting spinner and success message

  //using if/else statements to validate
  if (name && email && about) {
    applySpinner.style.display = "inline-block"; // Show loading spinner
    //using asynchronous to settime to simulate data being processed and user getting feedback
    setTimeout(() => {
      applySpinner.style.display = "none"; // Hiding spinner
      applySuccess.style.display = "block"; // Show confirmation
      applySuccess.textContent = `Thanks, ${name}! Your application has been received. We'll be in touch at ${email}.`;

      applyForm.reset(); // Reset form fields
    }, 1500);
  } else {
    alert("Please fill out all required fields.");
  }
}

// STEP 5: Event Listeners

// RESPONSIVE NAV MENU
hamburger.addEventListener("click", toggleMenu);
navLinkItems.forEach((link) => link.addEventListener("click", closeMenu));

// FORMS
bookingForm.addEventListener("submit", handleBookingSubmit);
applyForm.addEventListener("submit", handleApplySubmit);

// WHEN USER SELECTS "REQUEST A BESTIE"
chooseBestieRadio.addEventListener("change", () => {
  bestieContainer.style.display = "block"; //show dropdown
  availableBestiesDiv.style.display = "none"; //hide availability list
  calendarDiv.style.display = "none"; //hide calendar
});
// CHECK WHO IS AVAILABLE
viewAvailableRadio.addEventListener("change", () => {
  bestieContainer.style.display = "none"; // hide the dropdown
  showAvailableBestiesByDate(); // check who's available
  showFakeBestieCalendar(); // show pretend calendar
});

// If the user changes the date, and "Show who is available" is selected,
// we update the available besties list immediately
dateInput.addEventListener("change", () => {
  if (viewAvailableRadio.checked) {
    showAvailableBestiesByDate(); // refresh the list of available besties
  }
});

// Initial PAGE LOAD
renderDogs(dogs);
renderTeam(teamMembers);
