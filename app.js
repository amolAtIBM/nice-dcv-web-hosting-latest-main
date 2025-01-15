// Initialize the application
import { main } from './index.js';

// Add event listener after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const inputBar = document.getElementById('inputBar');
    inputBar.addEventListener('blur', main);
});