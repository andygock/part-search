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
const searchButton = document.getElementById("searchButton");
const searchStatus = document.getElementById("searchStatus");
const searchResults = document.getElementById("searchResults");
const searchResultLinks = document.getElementById("searchResultLinks");
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

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchMultipleEngines(searchInput.value);
});

selectButton.addEventListener("click", () => setAllSuppliersSelected(true));
deselectButton.addEventListener("click", () => setAllSuppliersSelected(false));

// Enable the form last so a partial initialisation cannot expose a broken form.
searchInput.disabled = false;
searchButton.disabled = false;
searchStatus.textContent = "";
searchInput.focus();

function setAllSuppliersSelected(selected) {
  document.querySelectorAll(".search-checkbox").forEach((checkbox) => {
    checkbox.checked = selected;
  });

  searchStatus.textContent = selected
    ? "All suppliers selected."
    : "All suppliers deselected.";
}

function searchMultipleEngines(query) {
  const trimmedQuery = makeWellFormed(query.trim());
  if (!trimmedQuery) {
    clearSearchLinks();
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
    clearSearchLinks();
    searchStatus.textContent = "Select at least one supplier.";
    return;
  }

  const encodedQuery = encodeURIComponent(trimmedQuery);
  const searchTargets = selectedSuppliers.map((supplier) => ({
    supplier,
    url: supplier.buildUrl(encodedQuery),
  }));

  renderSearchLinks(searchTargets);

  const opened = [];
  const blocked = [];
  const failed = [];

  searchTargets.forEach(({ supplier, url }) => {
    let newWindow;

    try {
      newWindow = window.open("about:blank", "_blank");
    } catch {
      failed.push(supplier.label);
      return;
    }

    if (!newWindow) {
      blocked.push(supplier.label);
      return;
    }

    try {
      // Detach the destination from this page before sending it off-origin.
      newWindow.opener = null;
      newWindow.location.replace(url);
      opened.push(supplier.label);
    } catch {
      failed.push(supplier.label);

      // Do not leave a useless blank tab behind after a navigation failure.
      try {
        newWindow.close();
      } catch {
        // Some browsers may deny access to a window after it starts navigating.
      }
    }
  });

  searchStatus.textContent = describeOutcomes({ opened, blocked, failed });
}

/**
 * Replaces unmatched UTF-16 surrogate code units before URL encoding. These can
 * enter a form through paste or browser automation and otherwise cause
 * encodeURIComponent() to throw, aborting the entire search.
 */
function makeWellFormed(value) {
  if (typeof value.toWellFormed === "function") {
    return value.toWellFormed();
  }

  return value.replace(/[\uD800-\uDFFF]/g, (codeUnit, index, input) => {
    const code = codeUnit.charCodeAt(0);
    const previousCode = index > 0 ? input.charCodeAt(index - 1) : 0;
    const nextCode = index + 1 < input.length ? input.charCodeAt(index + 1) : 0;
    const isHighSurrogate = code >= 0xd800 && code <= 0xdbff;
    const isLowSurrogate = code >= 0xdc00 && code <= 0xdfff;
    const isPartOfPair =
      (isHighSurrogate && nextCode >= 0xdc00 && nextCode <= 0xdfff) ||
      (isLowSurrogate && previousCode >= 0xd800 && previousCode <= 0xdbff);

    return isPartOfPair ? codeUnit : "\uFFFD";
  });
}

function clearSearchLinks() {
  searchResultLinks.replaceChildren();
  searchResults.hidden = true;
}

function renderSearchLinks(searchTargets) {
  const links = searchTargets.map(({ supplier, url }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = `Search ${supplier.label}`;
    item.append(link);

    return item;
  });

  searchResultLinks.replaceChildren(...links);
  searchResults.hidden = false;
}

function describeOutcomes({ opened, blocked, failed }) {
  const messages = [
    `Opened ${opened.length} search ${opened.length === 1 ? "tab" : "tabs"}.`,
  ];

  if (blocked.length > 0) {
    messages.push(`Blocked: ${blocked.join(", ")}.`);
  }

  if (failed.length > 0) {
    messages.push(`Failed: ${failed.join(", ")}.`);
  }

  if (blocked.length > 0 || failed.length > 0) {
    messages.push("Use the supplier links below to open the missing results.");
  }

  return messages.join(" ");
}
