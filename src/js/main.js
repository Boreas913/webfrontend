const MENU_DATA_URL = "./data/menu.json";
const NPS_PARK_URL = "https://developer.nps.gov/api/v1/parks";
const NPS_API_KEY = import.meta.env.VITE_NPS_API_KEY;

function updateOverviewFromParkData(park) {
  document.getElementById("parkName").textContent = park.name;
  document.getElementById("parkType").textContent = park.type;
  document.getElementById("parkStates").textContent = park.states;
}

async function fetchParkData(parkCode = "yell") {
  const response = await fetch(`${NPS_PARK_URL}?parkCode=${parkCode}`, {
    headers: {
      "X-Api-Key": NPS_API_KEY
    }
  });

  const payload = await response.json();
  return payload.data[0];
}

function renderParkInfoDetails(park) {
  document.getElementById("info-description").textContent = park.description;
  document.getElementById("info-weather").textContent = park.weatherInfo;
  document.getElementById("info-directions").textContent = park.directionsInfo;

  const directionsLink = document.getElementById("info-directions-link");
  directionsLink.href = park.directionsUrl;
  directionsLink.textContent = "Read more";

  const primaryContact = park.contacts[0].phoneNumbers[0]; // Assuming the first contact and first phone number is the primary one
  document.getElementById("info-contact").textContent = primaryContact.phoneNumber;

  const physicalAddress = park.addresses[0]; // Assuming the first address is the physical one
  document.getElementById("info-address").textContent =
    `${physicalAddress.line1}, ${physicalAddress.city}, ${physicalAddress.stateCode} ${physicalAddress.postalCode}`;
}

function renderParkFeesSection(park) {
  const fees = document.getElementById("fees-entrance-fees");
  const passes = document.getElementById("fees-entrance-passes");

  // We use map() and join() here to create list items from the list of entranceFees. Think of this like a fance for loop.
  fees.innerHTML = park.entranceFees
    .map(
      (fee) =>
        `<li><strong>${fee.title}</strong>: $${fee.cost} - ${fee.description}</li>`
    )
    .join("");

  // We use map() and join() here to create list items from the list of entrancePasses. Think of this like a fancy for loop.
  passes.innerHTML = park.entrancePasses
    .map(
      (pass) =>
        `<li><strong>${pass.title}</strong>: $${pass.cost} - ${pass.description}</li>`
    )
    .join("");
}

// This new function loads the park information that was previously hard-coded in getParkInfo()
function updateOverviewFromParkData(park) {
  const parkName = document.getElementById("parkName");
  const parkType = document.getElementById("parkType");
  const parkStates = document.getElementById("parkStates");
  const parkImage = document.getElementById("park-image");

  parkName.textContent = park.name;
  parkType.textContent = park.designation;
  parkStates.textContent = park.states;

  parkImage.src = park.images[0].url;
  parkImage.alt = park.images[0].altText || park.images[0].title;
}

async function loadAndRenderParkInfo() {
  const park = await fetchParkData();
  updateOverviewFromParkData(park);
  renderParkInfoDetails(park);
  renderParkFeesSection(park);
}

function loadParkData() {
  document.getElementById("parkName").textContent = "Yellowstone";
  document.getElementById("parkType").textContent = "National Park";
  document.getElementById("parkStates").textContent = "WY, ID, MT";
  const parkImg = document.querySelector("#park-image");
  if (parkImg) parkImg.src = "./images/yellowstone.jpg";
}

async function loadAndRenderParkInfo() {
  const park = await fetchParkData();
  updateOverviewFromParkData(park);
  renderParkInfoDetails(park);
  renderParkFeesSection(park);
}

function buildHeaderMenuWithThen() {
  const headerMenuList = document.querySelector("#header-menu-options ul");
  if (!headerMenuList) return Promise.resolve();

  return fetch(MENU_DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      headerMenuList.innerHTML = "";

      data.menu.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.dataset.menuId = item.id;
        li.dataset.href = item.href;

        if (item.id === "maps") {
          li.id = "header-maps-link";
        }
        headerMenuList.appendChild(li);
      });
    });
}

async function buildParkMenuWithAsyncAwait() {
  const parkMenuList = document.querySelector("#park-menu ul");
  if (!parkMenuList) return;

  const response = await fetch(MENU_DATA_URL);
  const data = await response.json();

  parkMenuList.innerHTML = data.menu
    .map(
      (item) => `
        <li
          ${item.id === "maps" ? 'id="park-maps-link"' : ""}
          data-menu-id="${item.id}"
          data-href="${item.href}">
          <p>${item.name}</p>
          <p>
            <svg>
              <use href="${item.iconUrl}"></use>
            </svg>
          </p>
        </li>
      `
    )
    .join("");
}

function setActiveSection(section) {
  const infoSection = document.getElementById("park-info");
  const feesSection = document.getElementById("park-fees");

  const showInfo = section === "info";
  if (infoSection) infoSection.classList.toggle("is-hidden", !showInfo);
  if (feesSection) feesSection.classList.toggle("is-hidden", showInfo);
}

function resolveMenuIdFromClickTarget(target) {
  const li = target.closest("li");
  if (!li || !li.dataset.menuId) return null; 
  return li.dataset.menuId.trim().toLowerCase();
}

function setActiveSection(section) {
  const infoSection = document.getElementById("park-info");
  const feesSection = document.getElementById("park-fees");

  const showInfo = section === "info";
  infoSection.classList.toggle("is-hidden", !showInfo);
  feesSection.classList.toggle("is-hidden", showInfo);
}

// This figures out which link was clicked by finding the closest list item to the target click.
function resolveMenuIdFromClickTarget(target) {
  const li = target.closest("li");
  return li.dataset.menuId.trim().toLowerCase();
}

function addEventListeners() {
  const menuTrigger = document.querySelector("#header-menu-trigger");
  const menuOptions = document.querySelector("#header-menu-options");
  const overview = document.querySelector("#overview");
  const parkMenu = document.querySelector("#park-menu");

  // MENU toggle
  if (menuTrigger && menuOptions) {
    // Don't add these listeners if the elements don't exist
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
    });

    menuOptions.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (parkMenu){
    parkMenu.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  // Overlay hover color toggle
  if (overview) {
    // Don't add these listeners if the element doesn't exist
    overview.addEventListener("mouseenter", () => {
      overview.classList.add("overlay-hover");
    });

    overview.addEventListener("mouseleave", () => {
      overview.classList.remove("overlay-hover");
    });
  }
}

function setupMapModalAndPromotions() {
  const headerMapsLink = document.getElementById("header-maps-link");
  const parkMapsLink = document.getElementById("park-maps-link");
  const mapModal = document.getElementById("map-modal");
  const mapModalClose = document.getElementById("map-modal-close");
  const promotionMessage = document.getElementById("promotion-message");

  function openMapModal() {
    if (mapModal) mapModal.classList.remove("is-hidden");
  }

  function closeMapModal() {
    if (mapModal) mapModal.classList.add("is-hidden");
  }

  if (headerMapsLink) headerMapsLink.addEventListener("click", openMapModal);
  if (parkMapsLink) parkMapsLink.addEventListener("click", openMapModal);
  if (mapModalClose) mapModalClose.addEventListener("click", closeMapModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMapModal();
    }
  });

  const weekdayPromotions = {
    1: "Monday Special: Buy one get one park entrance.",
    2: "Tuesday Deal: 10% off park admissions.",
    3: "Wednesday Offer: Free junior ranger booklet with entry.",
    4: "Thursday Bonus: Free Yellowstone postcard at check-in.",
    5: "Friday Feature: 15% off annual pass upgrade.",
  };

  const day = new Date().getDay();
  if (promotionMessage) {
    if (day === 0 || day === 6) {
      promotionMessage.textContent = "No Promotions today";
    } else {
      promotionMessage.textContent = weekdayPromotions[day];
    }
  }
}

async function init() {
  // loadParkData();
  buildHeaderMenuWithThen();
  await buildParkMenuWithAsyncAwait();
  await loadAndRenderParkInfo();

  setActiveSection("info");

  addEventListeners();
  setupMapModalAndPromotions();
}

init();