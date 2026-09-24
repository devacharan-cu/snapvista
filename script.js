// SnapVista - Part 1: Scaffold & UI
// Theme toggle functionality for light/dark mode
// Search and image fetching will be implemented in Part 2

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else if (prefersDark) {
    html.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }

  // Theme toggle handler
  themeToggle.addEventListener('click', function() {
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Clear button functionality - clears search input
  const clearButton = document.getElementById('clear-button');
  const searchInput = document.getElementById('search-input');

  clearButton.addEventListener('click', function(e) {
    e.preventDefault();
    searchInput.value = '';
    searchInput.focus();
  });

  // Search form placeholder (actual search will be in Part 2)
  const searchForm = document.getElementById('search-form');
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Part 2: Fetch and render images
  });

  // Suggestion chips placeholder (actual search will be in Part 2)
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      const topic = this.getAttribute('data-topic');
      document.getElementById('search-input').value = topic;
      // Part 2: Trigger search with this topic
    });
  });
});
