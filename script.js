const suppliers = [
  {
    id: "element14",
    label: "Element 14",
    selectedByDefault: true,
    buildUrl: (encodedQuery) =>
      `https://au.element14.com/search?st=${encodedQuery}&gs=true`,
  },
  {
    id: "rs",
    label: "RS Components",
    selectedByDefault: true,
    buildUrl: (encodedQuery) =>
      `https://au.rs-online.com/web/c/?searchTerm=${encodedQuery}`,
  },
  {
    id: "digikey",
    label: "Digi-Key",
    selectedByDefault: true,
    buildUrl: (encodedQuery) =>
      `https://www.digikey.com.au/en/products/result?keywords=${encodedQuery}`,
  },
  {
    id: "mouser",
    label: "Mouser",
    selectedByDefault: true,
    buildUrl: (encodedQuery) =>
      `https://au.mouser.com/c/?q=${encodedQuery}`,
  },
  {
    id: "octopart",
    label: "Octopart",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://octopart.com/search?q=${encodedQuery}&currency=AUD&specs=0`,
  },
  {
    id: "amazon",
    label: "Amazon",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://www.amazon.com.au/s?k=${encodedQuery}`,
  },
  {
    id: "ebay",
    label: "eBay",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://www.ebay.com.au/sch/i.html?_nkw=${encodedQuery}`,
  },
  {
    id: "officeworks",
    label: "Officeworks",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://www.officeworks.com.au/shop/officeworks/search?q=${encodedQuery}`,
  },
  {
    id: "bunnings",
    label: "Bunnings",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://www.bunnings.com.au/search/products?q=${encodedQuery}`,
  },
  {
    id: "kmart",
    label: "Kmart",
    selectedByDefault: false,
    buildUrl: (encodedQuery) =>
      `https://www.kmart.com.au/search/?searchTerm=${encodedQuery}`,
  },
];

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchStatus = document.getElementById("searchStatus");
const checkboxContainer = document.getElementById("checkboxes");
const selectButton = document.getElementById("select");
const deselectButton = document.getElementById("deselect");

function createSupplierCheckbox(supplier) {
  const label = document.createElement("label");
  const input = document.createElement("input");

  input.type = "checkbox";
  input.className = "search-checkbox";
  input.value = supplier.id;
  input.checked = supplier.selectedByDefault;

  label.append(input, document.createTextNode(supplier.label));
  return label;
}

checkboxContainer.replaceChildren(...suppliers.map(createSupplierCheckbox));
searchInput.focus();

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMultipleEngines(searchInput.value);
});

selectButton.addEventListener("click", () => setAllSuppliersSelected(true));
deselectButton.addEventListener("click", () => setAllSuppliersSelected(false));

function setAllSuppliersSelected(selected) {
  document.querySelectorAll(".search-checkbox").forEach((checkbox) => {
    checkbox.checked = selected;
  });

  searchStatus.textContent = selected
    ? "All suppliers selected."
    : "All suppliers deselected.";
}

function searchMultipleEngines(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    searchStatus.textContent = "Enter a part number or keywords to search.";
    return;
  }

  const selectedSupplierIds = new Set(
    [...document.querySelectorAll(".search-checkbox:checked")].map(
      (checkbox) => checkbox.value,
    ),
  );
  const selectedSuppliers = suppliers.filter((supplier) =>
    selectedSupplierIds.has(supplier.id),
  );

  if (selectedSuppliers.length === 0) {
    searchStatus.textContent = "Select at least one supplier.";
    return;
  }

  let blockedCount = 0;
  const encodedQuery = encodeURIComponent(trimmedQuery);

  selectedSuppliers.forEach((supplier) => {
    const newWindow = window.open("about:blank", "_blank");

    if (!newWindow) {
      blockedCount += 1;
      return;
    }

    newWindow.opener = null;
    newWindow.location.replace(supplier.buildUrl(encodedQuery));
  });

  const openedCount = selectedSuppliers.length - blockedCount;
  searchStatus.textContent = blockedCount
    ? `Opened ${openedCount} search ${openedCount === 1 ? "tab" : "tabs"}; ${blockedCount} blocked. Allow popups to open all results.`
    : `Opened ${openedCount} search ${openedCount === 1 ? "tab" : "tabs"}.`;
}
