# Part Search

Part Search opens a product query across multiple Australian electronic component and retail supplier sites.

Element 14, RS Components, Digi-Key, and Mouser are selected by default. Optional searches are available for Octopart, Amazon, eBay, Officeworks, Bunnings, and Kmart.

Each result opens in a separate tab, so the browser may ask you to allow popups for the site.

## Demo

[Open Part Search](https://parts.gock.net/)

## Local development

No build step or package installation is required. Serve the repository with any static HTTP server, for example:

```shell
python -m http.server 8000
```

Then open <http://localhost:8000>. Serving the files over HTTP is recommended because the JavaScript is loaded as an ES module.
