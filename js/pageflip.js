// ===========================
// PAGE-FLIP INITIALIZATION
// ===========================

import { animatePageEntrance, animateCoverEntrance } from './animations.js';

var flipInstance = null;
var currentPageIndex = 0;
var currentConfig = null;

function getBookDimensions() {
  var vw = window.innerWidth;
  var vh = window.innerHeight;
  var isMobile = vw <= 768;
  var isTablet = vw <= 1200 && vw > 768;

  var pageWidth, pageHeight;

  if (isMobile) {
    // Single page mode: one page fills the screen
    pageWidth = Math.min(vw - 16, 420);
    pageHeight = Math.min(vh - 32, 680);
  } else if (isTablet) {
    // Two-page spread but smaller
    pageWidth = Math.min(Math.floor((vw - 80) / 2), 440);
    pageHeight = Math.min(vh - 60, 650);
  } else {
    // Desktop: full size
    pageWidth = 550;
    pageHeight = 720;
  }

  return {
    width: pageWidth,
    height: pageHeight,
    isMobile: isMobile
  };
}

export function initPageFlip() {
  var bookEl = document.getElementById('flipbook');
  if (!bookEl) {
    console.error('Flipbook element #flipbook not found');
    return;
  }

  var dims = getBookDimensions();
  currentConfig = dims;

  var config = {
    width: dims.width,
    height: dims.height,
    size: 'fixed',
    maxShadowOpacity: 0.3,
    showCover: true,
    mobileScrollSupport: true,
    clickEventForward: false,
    useMouseEvents: true,
    swipeDistance: 30,
    flippingTime: 800,
    drawShadow: true,
    autoSize: false,
    startZIndex: 0,
    startPage: 0,
    usePortrait: dims.isMobile,
    showPageCorners: true,
    disableFlipByClick: false,
  };

  // PageFlip is loaded globally via CDN as window.St.PageFlip
  var PageFlipLib = (window.St && window.St.PageFlip);
  if (!PageFlipLib) {
    console.error('PageFlip library not loaded. window.St:', window.St);
    return;
  }

  try {
    flipInstance = new PageFlipLib(bookEl, config);
  } catch (err) {
    console.error('Failed to initialize PageFlip:', err);
    return;
  }

  // CRITICAL: loadFromHTML must be called to register pages
  var pageElements = bookEl.querySelectorAll(':scope > div');
  if (pageElements.length === 0) {
    console.error('No page elements found inside #flipbook');
    return;
  }

  flipInstance.loadFromHTML(pageElements);

  // Event: page turning
  flipInstance.on('flip', function(e) {
    currentPageIndex = e.data;
    var nextPage = getNextPageElement();
    if (nextPage) {
      animatePageEntrance(nextPage);
    }
    updateNavigationHints();
  });

  // Initial cover animation
  setTimeout(function() {
    var coverPage = document.querySelector('.cover-page');
    if (coverPage) {
      animateCoverEntrance(coverPage);
    }
    updateNavigationHints();
  }, 500);

  // Keyboard navigation
  document.addEventListener('keydown', handleKeydown);

  // Navigation arrows
  setupNavigationArrows();

  // Handle resize with debounce
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });
}

function handleKeydown(e) {
  if (!flipInstance) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault();
    flipInstance.flipNext();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    flipInstance.flipPrev();
  }
}

function setupNavigationArrows() {
  var prevBtn = document.getElementById('nav-prev');
  var nextBtn = document.getElementById('nav-next');

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (flipInstance) flipInstance.flipPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (flipInstance) flipInstance.flipNext();
    });
  }
}

function updateNavigationHints() {
  var prevBtn = document.getElementById('nav-prev');
  var nextBtn = document.getElementById('nav-next');
  var hint = document.querySelector('.nav-hint');

  if (!flipInstance) return;

  var current = flipInstance.getCurrentPageIndex();
  var total = flipInstance.getPageCount();

  if (prevBtn) {
    prevBtn.classList.toggle('hidden', current === 0);
  }

  if (nextBtn) {
    nextBtn.classList.toggle('hidden', current >= total - 1);
  }

  if (hint && current > 0) {
    hint.classList.add('hidden');
  }
}

function getNextPageElement() {
  if (!flipInstance) return null;
  var currentIndex = flipInstance.getCurrentPageIndex();
  var nextPageIndex = currentIndex + 1;
  var allDivs = document.querySelectorAll('#flipbook > div');
  return allDivs[nextPageIndex] || null;
}

function handleResize() {
  if (!flipInstance) return;

  var dims = getBookDimensions();
  var prevIndex = flipInstance.getCurrentPageIndex();

  // Only reinitialize if dimensions actually changed significantly
  if (currentConfig && Math.abs(dims.width - currentConfig.width) < 20 && Math.abs(dims.height - currentConfig.height) < 20) {
    return;
  }

  // Destroy and rebuild
  try {
    flipInstance.destroy();
  } catch(e) {}

  flipInstance = null;
  currentConfig = dims;

  var bookEl = document.getElementById('flipbook');
  if (!bookEl) return;

  // Reset the flipbook element
  bookEl.innerHTML = '';
  bookEl.classList.remove('stf__parent');

  // Rebuild pages from stored data
  rebuildPages(bookEl);

  var config = {
    width: dims.width,
    height: dims.height,
    size: 'fixed',
    maxShadowOpacity: 0.3,
    showCover: true,
    mobileScrollSupport: true,
    clickEventForward: false,
    useMouseEvents: true,
    swipeDistance: 30,
    flippingTime: 800,
    drawShadow: true,
    autoSize: false,
    startZIndex: 0,
    startPage: Math.min(prevIndex, 6),
    usePortrait: dims.isMobile,
    showPageCorners: true,
    disableFlipByClick: false,
  };

  var PageFlipLib = (window.St && window.St.PageFlip);
  if (!PageFlipLib) return;

  try {
    flipInstance = new PageFlipLib(bookEl, config);
  } catch (err) {
    console.error('Failed to reinitialize PageFlip:', err);
    return;
  }

  var pageElements = bookEl.querySelectorAll(':scope > div');
  flipInstance.loadFromHTML(pageElements);

  flipInstance.on('flip', function(e) {
    currentPageIndex = e.data;
    var nextPage = getNextPageElement();
    if (nextPage) {
      animatePageEntrance(nextPage);
    }
    updateNavigationHints();
  });

  updateNavigationHints();
}

// Store page HTML to rebuild on resize
var storedPagesHTML = null;

function rebuildPages(bookEl) {
  if (storedPagesHTML) {
    bookEl.innerHTML = storedPagesHTML;
    return;
  }

  // First time: store the original HTML
  storedPagesHTML = bookEl.innerHTML;
}

export function goToPage(pageIndex) {
  if (flipInstance) {
    flipInstance.flip(pageIndex);
  }
}

export function getCurrentPage() {
  return currentPageIndex;
}
