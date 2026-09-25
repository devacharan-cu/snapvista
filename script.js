// SnapVista - Part 2: Fetch & Render
// Catch search, fetch images from Wikimedia Commons API, render results as cards

document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const resultsGrid = document.getElementById('results');
  const emptyState = document.getElementById('empty-state');
  const statusElement = document.getElementById('status');
  const clearButton = document.getElementById('clear-button');

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

  // Clear button functionality
  clearButton.addEventListener('click', function(e) {
    e.preventDefault();
    searchInput.value = '';
    searchInput.focus();
    resultsGrid.innerHTML = '';
    emptyState.style.display = 'flex';
    statusElement.textContent = '';
  });

  // Fetch images from Wikimedia Commons API
  async function fetchImages(query) {
    const url =
      "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
      "&gsrsearch=" + encodeURIComponent(query) +
      "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  // Render image cards to the grid
  function render(items, query) {
    resultsGrid.innerHTML = '';
    emptyState.style.display = 'none';

    if (!items || items.length === 0) {
      statusElement.textContent = `No results found for "${query}"`;
      emptyState.style.display = 'flex';
      return;
    }

    statusElement.textContent = `Showing ${items.length} results for "${query}"`;

    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = item.imageinfo[0].thumburl;
      img.alt = item.title;
      img.loading = 'lazy';

      const caption = document.createElement('p');
      caption.textContent = item.title;

      const link = document.createElement('a');
      link.href = item.imageinfo[0].url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.title = 'Open full image';
      link.style.cursor = 'pointer';
      link.appendChild(img);

      card.appendChild(link);
      card.appendChild(caption);
      resultsGrid.appendChild(card);
    });
  }

  // Handle search form submission
  searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (!query) {
      statusElement.textContent = 'Please enter a search term';
      return;
    }

    statusElement.textContent = 'Searching...';
    resultsGrid.innerHTML = '';
    emptyState.style.display = 'none';

    try {
      const data = await fetchImages(query);
      const items = Object.values(data.query.pages);
      render(items, query);
    } catch (error) {
      statusElement.textContent = `Error: ${error.message}. Please try again.`;
      emptyState.style.display = 'flex';
      console.error('Search error:', error);
    }
  });

  // Quick-pick chips trigger search
  const chips = document.querySelectorAll('.chip');
  chips.forEach(chip => {
    chip.addEventListener('click', function(e) {
      e.preventDefault();
      const topic = this.getAttribute('data-topic');
      searchInput.value = topic;
      searchForm.dispatchEvent(new Event('submit'));
    });
  });
});
