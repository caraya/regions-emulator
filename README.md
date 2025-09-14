# CSS Regions Emulator

A lightweight, dependency-free JavaScript library that emulates the behavior of the CSS Regions specification. This allows content from a single source element to flow across multiple designated container elements, creating complex, magazine-style layouts on the web.

## Features

* Content Flow: Automatically flows content from a source div into any number of specified region divs.
* Word-level Granularity: Breaks text content at word boundaries for clean and readable reflows.
* Element Aware: Correctly handles whole elements (like images, blockquotes, etc.), moving them to the next region if they don't fit.
* Dynamic: Works with any number of regions, placed anywhere on the page.

## Installation

```bash
npm install css-regions-emulator
```

## Usage

Structure your HTML
: Create a source element with your content and a series of region elements where you want the content to flow.

```html
<!-- The content that will be flowed -->
<div id="source-content" style="display: none;">
    <h2>My Article Title</h2>
    <p>A lot of content goes here...</p>
    <p>More content to fill the regions...</p>
</div>

<!-- The containers where the content will flow -->
<div class="region"></div>
<div class="region"></div>
<div class="region"></div>
```

Import and Initialize
: Import the library and create a new instance, passing in the CSS selectors for your source and region elements.

```js
// app.js
import CSSRegionsEmulator from 'regions-emulator';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new CSSRegionsEmulator('#source-content', '.region');
});
```

## How It Works

The library takes all child nodes from the source element. It then iterates through each region, adding content node by node (and word by word for text) into a temporary container to measure its height. When the content's height exceeds the region's available height, the overflowing node is pushed to the next region. This process continues until all content is placed or all regions are filled.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
