// ===========================
// MAIN APPLICATION
// ===========================

import { initPageFlip } from './pageflip.js';
import { PAGE_DATA, SVG_ICONS } from './data.js';

document.addEventListener('DOMContentLoaded', function() {
  // Show loading screen
  const loadingScreen = document.querySelector('.loading-screen');
  const loadingBar = document.querySelector('.loading-bar-fill');
  const loadingText = document.querySelector('.loading-text');

  let progress = 0;
  const loadingMessages = [
    'Preparing the canvas...',
    'Mixing colors...',
    'Arranging the studio...',
    'Opening the book...',
  ];

  const loadingInterval = setInterval(function() {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      if (loadingText) loadingText.textContent = 'Welcome to Artoriya Studio';

      setTimeout(function() {
        loadingScreen.classList.add('hidden');
        initPageFlip();
      }, 600);
    }

    if (loadingBar) loadingBar.style.width = progress + '%';

    const msgIndex = Math.min(Math.floor(progress / 25), loadingMessages.length - 1);
    if (loadingText) loadingText.textContent = loadingMessages[msgIndex];
  }, 200);

  // Populate dynamic content
  populateCourses();
  populateBatches();
  populateBenefits();
  populateValues();
  populateNavigationHints();
});

function populateCourses() {
  const grid = document.getElementById('courses-grid');
  if (!grid) return;

  grid.innerHTML = PAGE_DATA.courses.map(function(course) {
    return '<div class="course-card">' +
      '<div class="course-icon" style="background: ' + course.bgColor + '">' + course.icon + '</div>' +
      '<h3>' + course.name + '</h3>' +
      '<p class="course-desc">' + course.desc + '</p>' +
      '<div class="course-meta">' +
        '<span>\u23F1 ' + course.duration + '</span>' +
        '<span>\uD83D\uDCCA ' + course.level + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

function populateBatches() {
  const container = document.getElementById('batch-cards');
  if (!container) return;

  container.innerHTML = PAGE_DATA.batches.map(function(batch) {
    var daysHtml = batch.days.map(function(day) {
      return '<span class="batch-day">' + day + '</span>';
    }).join('');

    return '<div class="batch-card">' +
      '<div class="batch-label">' + batch.label + '</div>' +
      '<h4>Weekly Schedule</h4>' +
      '<div class="batch-days">' + daysHtml + '</div>' +
      '<div class="batch-time">' + batch.time + '</div>' +
    '</div>';
  }).join('');
}

function populateBenefits() {
  const grid = document.getElementById('benefits-grid');
  if (!grid) return;

  grid.innerHTML = PAGE_DATA.benefits.map(function(benefit) {
    return '<div class="benefit-item">' +
      '<div class="benefit-icon">' + benefit.icon + '</div>' +
      '<h5>' + benefit.title + '</h5>' +
    '</div>';
  }).join('');
}

function populateValues() {
  const container = document.getElementById('about-values');
  if (!container) return;

  container.innerHTML = PAGE_DATA.values.map(function(val) {
    return '<div class="value-card">' +
      '<div class="value-icon" style="background: ' + val.color + '">' + val.icon + '</div>' +
      '<h4>' + val.title + '</h4>' +
      '<p>' + val.desc + '</p>' +
    '</div>';
  }).join('');
}

function populateNavigationHints() {
  const prevBtn = document.getElementById('nav-prev');
  const nextBtn = document.getElementById('nav-next');

  if (prevBtn) prevBtn.innerHTML = SVG_ICONS.chevronLeft;
  if (nextBtn) nextBtn.innerHTML = SVG_ICONS.chevronRight;
}
