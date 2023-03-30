document.getElementById("searchInput").focus();

document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMultipleEngines(this.value);
    }
  });

function searchMultipleEngines(query) {
  const checkboxes = document.querySelectorAll(".search-checkbox:checked");
  const encodedTerm = encodeURIComponent(query);
  const searchEngines = {
    element14: `https://au.element14.com/search?st=${encodedTerm}&gs=true`,
    rs: `https://au.rs-online.com/web/c/?searchTerm=${encodedTerm}`,
    digikey: `https://www.digikey.com.au/en/products/result?keywords=${encodedTerm}`,
    mouser: `https://au.mouser.com/c/?q=${encodedTerm}`,
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

document.getElementById("searchButton").addEventListener("click", function () {
  const searchInput = document.getElementById("searchInput");
  searchMultipleEngines(searchInput.value);
});
