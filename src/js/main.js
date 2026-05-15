const MENU_DATA_URL = "/data/menu.json";
function loadParkData() {
  document.getElementById("parkName").textContent = "Yellowstone";
  document.getElementById("parkType").textContent = "National Park";
  document.getElementById("parkStates").textContent = "WY, ID, MT";
  document.querySelector("#heroImage").src = "./images/yellowstone.jpg";
}

function addEventListeners() {
  const menuTrigger = document.querySelector("#header-menu-trigger");
  const menuOptions = document.querySelector("#header-menu-options");
  const parkInfo = document.querySelector("#parkInfo");

  // MENU toggle
  if (menuTrigger && menuOptions) { 
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
    });

    // Event delegation (single listener)
    menuOptions.addEventListener("click", (event) => {
      const itemName = event.target.textContent;
      console.log(itemName);
    });
  }

  // Overlay hover color toggle
  if (parkInfo) { 
    parkInfo.addEventListener("mouseenter", () => {
      parkInfo.classList.add("overlay-hover");
    });

    parkInfo.addEventListener("mouseleave", () => {
      parkInfo.classList.remove("overlay-hover");
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

  headerMapsLink?.addEventListener("click", openMapModal);
  parkMapsLink?.addEventListener("click", openMapModal);
  mapModalClose?.addEventListener("click", closeMapModal);

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
    5: "Friday Feature: 15% off annual pass upgrade."
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

function buildHeaderMenuWithThen() {
  // Find the header menu <ul>.
  const headerMenuList = document.querySelector("#header-menu-options ul");
  if (!headerMenuList) return;

  // Fetch JSON and convert response to JS object.
  fetch(MENU_DATA_URL)
    .then((response) => response.json())
    .then((data) => {
      // Remove old markup before rebuilding.
      headerMenuList.innerHTML = "";

      // Create <li> items from the JSON array.
      data.menu.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.dataset.menuId = item.id;
        li.dataset.href = item.href;

        // Keep this ID for existing map modal behavior.
        if (item.id === "maps") li.id = "header-maps-link";

        headerMenuList.appendChild(li);
      });
    });
}
async function buildParkMenuWithAsyncAwait() {
  // Find the park menu <ul>.
  const parkMenuList = document.querySelector("#park-menu ul");
  if (!parkMenuList) return;

  // Fetch and parse JSON with async/await.
  const response = await fetch(MENU_DATA_URL);
  const data = await response.json();

  // Build the entire menu in one pass.
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
async function init() {
  loadParkData();
  buildHeaderMenuWithThen();
  await buildParkMenuWithAsyncAwait();
  addEventListeners();
  setupMapModalAndPromotions();
}

init();
loadParkData();
addEventListeners();
setupMapModalAndPromotions();