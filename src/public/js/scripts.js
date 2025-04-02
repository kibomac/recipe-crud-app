document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved mode in localStorage
    const savedMode = localStorage.getItem('dark-mode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        toggleButton.textContent = '☀️'; // Sun icon for light mode toggle
    } else {
        toggleButton.textContent = '🌙'; // Moon icon for dark mode toggle
    }

    // Toggle dark mode on button click
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            toggleButton.textContent = '☀️'; // Sun icon for light mode toggle
            localStorage.setItem('dark-mode', 'enabled');
        } else {
            toggleButton.textContent = '🌙'; // Moon icon for dark mode toggle
            localStorage.setItem('dark-mode', 'disabled');
        }
    });
});