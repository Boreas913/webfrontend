const MENU_DATA_URL = "./data/menu.json";

function updateOverviewFromParkData(park) {
  document.getElementById("parkName").textContent = park.name;
  document.getElementById("parkType").textContent = park.type;
  document.getElementById("parkStates").textContent = park.states;
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

function addEventListeners() {
  const menuTrigger = document.querySelector("#header-menu-trigger");
  const menuOptions = document.querySelector("#header-menu-options");
  const overview = document.querySelector("#overview");
  const parkMenu = document.querySelector("#park-menu");

  if (menuTrigger && menuOptions) {
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
    });

    menuOptions.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (!menuId) return;
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (parkMenu){
    parkMenu.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (!menuId) return;
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (overview) {
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
  loadParkData();
  await buildHeaderMenuWithThen(); 
  await buildParkMenuWithAsyncAwait();

  setActiveSection("info");
  addEventListeners();
  setupMapModalAndPromotions();
}

init();