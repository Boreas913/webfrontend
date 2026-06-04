import { readFavorites, removeFavorite } from "./storage.js";

export function renderParkData(park) {
  if (!park) return;

  const parkName = document.getElementById("parkName");
  const parkType = document.getElementById("parkType");
  const parkStates = document.getElementById("parkStates");
  const parkImage = document.getElementById("park-image");

  parkName.textContent = park.name;
  parkType.textContent = park.designation;
  parkStates.textContent = park.states;

  if (park.images?.length) {
    parkImage.src = park.images[0].url;
    parkImage.alt = park.images[0].altText || park.images[0].title;
  }

  document.getElementById("info-description").textContent = park.description ?? "";
  document.getElementById("info-weather").textContent = park.weatherInfo ?? "";
  document.getElementById("info-directions").textContent = park.directionsInfo ?? "";

  const directionsLink = document.getElementById("info-directions-link");
  directionsLink.href = park.directionsUrl ?? "#";
  directionsLink.textContent = "Read more";

  const primaryContact = park.contacts?.phoneNumbers?.find((p) => p.type === "Voice");
  document.getElementById("info-contact").textContent = primaryContact?.phoneNumber ?? "";

  const address = park.addresses?.find((a) => a.type === "Physical");
  document.getElementById("info-address").textContent = address
    ? `${address.line1}, ${address.city}, ${address.stateCode} ${address.postalCode}`
    : "";

  const fees = document.getElementById("fees-entrance-fees");
  const passes = document.getElementById("fees-entrance-passes");

  fees.innerHTML = (park.entranceFees ?? [])
    .map((fee) => `<li><strong>${fee.title}</strong>: $${fee.cost} - ${fee.description}</li>`)
    .join("");

  passes.innerHTML = (park.entrancePasses ?? [])
    .map((pass) => `<li><strong>${pass.title}</strong>: $${pass.cost} - ${pass.description}</li>`)
    .join("");

  const iframe = document.getElementById("mapFrame");
  if (iframe && park.latitude && park.longitude) {
    iframe.src = `https://www.google.com/maps?q=${park.latitude},${park.longitude}&output=embed&z=8`;
  }
}

export function renderHeaderMenu(menuItems) {
  const list = document.querySelector("#header-menu-options ul");
  if (!list) return;

  list.innerHTML = "";
  menuItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.dataset.menuId = item.id;
    li.dataset.href = item.href;
    if (item.id === "maps") li.id = "header-maps-link";
    list.appendChild(li);
  });
}

export function renderParkMenu(menuItems) {
  const list = document.querySelector("#park-menu ul");
  if (!list) return;

  list.innerHTML = menuItems
    .map(
      (item) => `
        <li ${item.id === "maps" ? 'id="park-maps-link"' : ""} data-menu-id="${item.id}" data-href="${item.href}">
          <p>${item.name}</p>
          <p><svg><use href="${item.iconUrl}"></use></svg></p>
        </li>
      `
    )
    .join("");
}

export function setActiveSection(section) {
  const infoSection = document.getElementById("park-info");
  const feesSection = document.getElementById("park-fees");
  if (!infoSection || !feesSection) return;

  const showInfo = section === "info";
  infoSection.classList.toggle("is-hidden", !showInfo);
  feesSection.classList.toggle("is-hidden", showInfo);
}

function resolveMenuIdFromClickTarget(target) {
  const li = target?.closest?.("li");
  return li?.dataset?.menuId?.trim()?.toLowerCase() ?? "";
}

export function wireSectionMenus() {
  const menuTrigger = document.querySelector("#header-menu-trigger");
  const menuOptions = document.querySelector("#header-menu-options");
  const parkMenu = document.querySelector("#park-menu");
  const overview = document.querySelector("#overview");

  if (menuTrigger && menuOptions) {
    menuTrigger.addEventListener("click", () => {
      menuOptions.classList.toggle("is-hidden");
    });

    menuOptions.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (parkMenu) {
    parkMenu.addEventListener("click", (event) => {
      const menuId = resolveMenuIdFromClickTarget(event.target);
      if (menuId === "info") setActiveSection("info");
      if (menuId === "fees") setActiveSection("fees");
    });
  }

  if (overview) {
    overview.addEventListener("mouseenter", () => overview.classList.add("overlay-hover"));
    overview.addEventListener("mouseleave", () => overview.classList.remove("overlay-hover"));
  }
}

export function setupMapModalAndPromotions() {
  const headerMapsLink = document.getElementById("header-maps-link");
  const parkMapsLink = document.getElementById("park-maps-link");
  const mapModal = document.getElementById("map-modal");
  const mapModalClose = document.getElementById("map-modal-close");
  const promotionMessage = document.getElementById("promotion-message");

  const openMapModal = () => mapModal?.classList.remove("is-hidden");
  const closeMapModal = () => mapModal?.classList.add("is-hidden");

  headerMapsLink?.addEventListener("click", openMapModal);
  parkMapsLink?.addEventListener("click", openMapModal);
  mapModalClose?.addEventListener("click", closeMapModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMapModal();
  });

  const weekdayPromotions = {
    1: "Monday Special: Buy one get one park entrance.",
    2: "Tuesday Deal: 10% off park admissions.",
    3: "Wednesday Offer: Free junior ranger booklet with entry.",
    4: "Thursday Bonus: Free Yellowstone postcard at check-in.",
    5: "Friday Feature: 15% off annual pass upgrade.",
  };

  if (promotionMessage) {
    const day = new Date().getDay();
    promotionMessage.textContent = day === 0 || day === 6 ? "No Promotions today" : weekdayPromotions[day];
  }
}

export function renderFavorites(buildParkUrl, containerId = "favorites-section") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const favorites = readFavorites();
  if (!favorites.length) {
    container.classList.add("is-hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("is-hidden");
  container.innerHTML = `
    <div class="favorites-inner">
      <h2>Favorite Parks</h2>
      <ul class="favorites-list">
        ${favorites
          .map(
            (park) => `
              <li>
                <a href="${buildParkUrl(park.parkCode)}">${park.name} (${park.parkCode})</a>
                <button type="button" class="favorite-remove" data-park-code="${park.parkCode}">(X)</button>
              </li>
            `
          )
          .join("")}
      </ul>
    </div>
  `;

  container.querySelectorAll(".favorite-remove").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const code = event.currentTarget?.dataset?.parkCode;
      if (!code) return;
      removeFavorite(code);
      renderFavorites(buildParkUrl, containerId);
    });
  });
}

export function renderParkSelectorUI(parks, currentParkCode, onParkSelected) {
  const button = document.getElementById("choose-park-btn");
  const select = document.getElementById("choose-park-select");
  if (!button || !select) return;

  select.innerHTML = `
    <option value="">Select a park...</option>
    ${parks
      .map(
        (park) =>
          `<option value="${park.parkCode}"${park.parkCode === currentParkCode ? " selected" : ""}>${park.name}</option>`
      )
      .join("")}
  `;

  button.addEventListener("click", () => {
    select.classList.toggle("is-hidden");
  });

  select.addEventListener("change", () => {
    const parkCode = select.value;
    if (!parkCode) return;
    const park = parks.find((p) => p.parkCode === parkCode);
    onParkSelected?.(parkCode, park);
  });
}