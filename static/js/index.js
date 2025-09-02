// Index page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // No automatic redirects on index page
    // Just update the header normally
    updateAuthSection();
    
    // Update auth section when storage changes
    window.addEventListener('storage', function(e) {
        if (e.key === 'token') {
            updateAuthSection();
        }
    });
});
