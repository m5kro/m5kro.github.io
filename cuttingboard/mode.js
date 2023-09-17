// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const checkbox = document.getElementById('darkModeToggle');

    // Toggle the dark mode class based on the checkbox state
    if (checkbox.checked) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }

  // Add a change event listener to the checkbox
  const darkModeCheckbox = document.getElementById('darkModeToggle');
  darkModeCheckbox.addEventListener('change', toggleDarkMode);

  // Initialize dark mode based on user preference (optional)
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  darkModeCheckbox.checked = prefersDarkMode;
  toggleDarkMode();