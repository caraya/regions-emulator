class CSSRegionsEmulator {
  constructor(sourceSelector, regionSelector) {
    this.sourceElement = document.querySelector(sourceSelector);
    this.regionElements = Array.from(document.querySelectorAll(regionSelector));

    if (!this.sourceElement || this.regionElements.length === 0) {
      console.error('CSS Regions Emulator: Source or region elements not found.');
      return;
    }
    this._init();
  }

  _init() {
    this._flowContent(); // Initial flow

    // Use ResizeObserver to reflow content when regions change size
    this.resizeObserver = new ResizeObserver(() => this._flowContent());
    this.regionElements.forEach(region => this.resizeObserver.observe(region));

    // Use MutationObserver to reflow content when the source content changes
    this.mutationObserver = new MutationObserver(() => this._flowContent());
    if (this.sourceElement) {
      this.mutationObserver.observe(this.sourceElement, { childList: true, characterData: true, subtree: true });
    }
  }

  _isOverflowing(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
  }

  _clearRegions() {
    this.regionElements.forEach(region => {
      region.innerHTML = '';
    });
  }

  _flowContent() {
    this._clearRegions();
    if (!this.sourceElement || !this.regionElements.length) return;

    let regionIndex = 0;
    const sourceNodes = Array.from(this.sourceElement.childNodes);

    for (const node of sourceNodes) {
      if (regionIndex >= this.regionElements.length) break;

      // Skip empty text nodes
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length === 0) {
        continue;
      }

      // Handle Element Nodes (like <p>, <blockquote>, etc.)
      if (node.nodeType === Node.ELEMENT_NODE) {
        let currentRegion = this.regionElements[regionIndex];
        let destElement = node.cloneNode(false); // Shallow clone, e.g., <p></p>
        currentRegion.appendChild(destElement);

        // Check if the empty element overflows (due to margins, etc.)
        if (this._isOverflowing(currentRegion)) {
          destElement.remove();
          regionIndex++;
          if (regionIndex >= this.regionElements.length) break;
          currentRegion = this.regionElements[regionIndex];
          destElement = node.cloneNode(false);
          currentRegion.appendChild(destElement);
        }

        // Process text word-by-word to allow splitting
        const words = node.textContent.split(/\s+/).filter(Boolean);
        for (const [i, word] of words.entries()) {
          const separator = i < words.length - 1 ? ' ' : '';
          destElement.appendChild(document.createTextNode(word + separator));

          if (this._isOverflowing(currentRegion)) {
            // Backtrack the word
            destElement.lastChild.textContent = destElement.lastChild.textContent.slice(0, -(word.length + separator.length));

            // Move to the next region
            regionIndex++;
            if (regionIndex >= this.regionElements.length) break;
            currentRegion = this.regionElements[regionIndex];

            // Create a new clone of the parent in the new region
            destElement = node.cloneNode(false);
            currentRegion.appendChild(destElement);
            // Add the overflowing word to the new element
            destElement.appendChild(document.createTextNode(word + separator));
          }
        }
      }
    }
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.mutationObserver) this.mutationObserver.disconnect();
  }
}

export default CSSRegionsEmulator;
