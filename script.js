// focus on input on page load
document.getElementById("searchInput").focus();

// listen for enter key
document
  .getElementById("searchInput")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      searchMultipleEngines(this.value);
    }
  });

function searchMultipleEngines(query) {
  const encodedTerm = encodeURIComponent(query);
  const urls = [
    `https://au.element14.com/search?st=${encodedTerm}&gs=true`,
    `https://au.rs-online.com/web/c/?searchTerm=${encodedTerm}`,
    `https://www.digikey.com.au/en/products/result?keywords=${encodedTerm}`,
    `https://au.mouser.com/c/?q=${encodedTerm}`,
  ];

  urls.forEach((url) => {
    // const searchUrl = url + encodeURIComponent(query);
    const searchUrl = url;
    const win = window.open(searchUrl, "_blank");
    if (win) {
      win.focus();
    } else {
      // alert('Please allow pop-ups for this website.');
    }
  });
}
