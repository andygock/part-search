const checkboxes = [
  { label: "Element14", value: "element14", checked: true },
  { label: "RS Components", value: "rs", checked: true },
  { label: "Digi-Key", value: "digikey", checked: true },
  { label: "Mouser", value: "mouser", checked: true },
  { label: "Octopart", value: "octopart", checked: false },
  { label: "Amazon", value: "amazon", checked: false },
  { label: "eBay", value: "ebay", checked: false },
  { label: "Officeworks", value: "officeworks", checked: false },
  { label: "Bunnings", value: "bunnings", checked: false },
  { label: "Kmart", value: "kmart", checked: false },
];

function generateCheckboxes(checkboxes) {
  let html = "";
  checkboxes.forEach((checkbox) => {
    html += `<label><input type="checkbox" class="search-checkbox" value="${
      checkbox.value
    }" ${checkbox.checked ? "checked" : ""} />${checkbox.label}</label>`;
  });
  return html;
}

const checkboxHtml = generateCheckboxes(checkboxes);
document.getElementById("checkboxes").innerHTML = checkboxHtml;

document.getElementById("searchInput").focus();
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMultipleEngines(this.value);
    }
  });

document.getElementById("searchButton").addEventListener("click", function () {
  const searchInput = document.getElementById("searchInput");
  searchMultipleEngines(searchInput.value);
});

// #select and #deselect will check and uncheck all checkboxes
document.getElementById("select").addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(".search-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = true;
  });
});

document.getElementById("deselect").addEventListener("click", function () {
  const checkboxes = document.querySelectorAll(".search-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
});

function searchMultipleEngines(query) {
  const checkboxes = document.querySelectorAll(".search-checkbox:checked");
  const encodedTerm = encodeURIComponent(query);
  const searchEngines = {
    element14: `https://au.element14.com/search?st=${encodedTerm}&gs=true`,
    rs: `https://au.rs-online.com/web/c/?searchTerm=${encodedTerm}`,
    digikey: `https://www.digikey.com.au/en/products/result?keywords=${encodedTerm}`,
    mouser: `https://au.mouser.com/c/?q=${encodedTerm}`,
    octopart: `https://octopart.com/search?q=${encodedTerm}&currency=AUD&specs=0`,
    amazon: `https://www.amazon.com.au/s?k=${encodedTerm}`,
    ebay: `https://www.ebay.com.au/sch/i.html?_nkw=${encodedTerm}`,
    officeworks: `https://www.officeworks.com.au/shop/officeworks/search?q=${encodedTerm}`,
    bunnings: `https://www.bunnings.com.au/search/products?q=${encodedTerm}`,
    kmart: `https://www.kmart.com.au/search/?searchTerm=${encodedTerm}`,
  };

  checkboxes.forEach((checkbox) => {
    const searchUrl = searchEngines[checkbox.value];
    const win = window.open(searchUrl, "_blank");
    if (win) {
      win.focus();
    } else {
      // alert('Please allow pop-ups for this website.');
    }
  });
}
