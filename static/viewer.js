// Theme handling
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.theme = theme;
    updateThemeIcons();
}

function updateThemeIcons() {
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    
    if (document.documentElement.classList.contains('dark')) {
        darkIcon.classList.add('hidden');
        lightIcon.classList.remove('hidden');
    } else {
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
    }
}

// Initialize theme
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme('dark');
} else {
    setTheme('light');
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
});

// Help section toggle
function toggleHelp() {
    const content = document.getElementById('help-content');
    const chevron = document.getElementById('help-chevron');
    const isHidden = content.classList.contains('hidden');
    
    if (isHidden) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

async function switchRole() {
    try {
        console.log('Switching to creator role...');
        const response = await fetch('/set-role', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ role: 'creator' })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Role switch response:', data);
            
            // Check current cookies
            console.log('Current cookies:', document.cookie);
            
            // Force reload the page to get the new role
            window.location.href = '/?t=' + new Date().getTime();
        } else {
            console.error('Failed to switch role:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error switching role:', error);
    }
}

// Keep track of expanded wishlists
let expandedWishlists = new Set();

function toggleWishlist(wishlistId) {
    const content = document.getElementById(`wishlist-content-${wishlistId}`);
    const chevron = document.getElementById(`chevron-${wishlistId}`);
    const isHidden = content.classList.contains('hidden');
    
    if (isHidden) {
        content.classList.remove('hidden');
        chevron.classList.remove('rotate-180');
        expandedWishlists.add(wishlistId);
    } else {
        content.classList.add('hidden');
        chevron.classList.add('rotate-180');
        expandedWishlists.delete(wishlistId);
    }
}

async function togglePurchased(itemId, itemName, currentStatus) {
    let message = currentStatus ? 
        `Are you sure you want to mark "${itemName}" as not purchased?` :
        `Are you sure you want to mark "${itemName}" as purchased?`;
        
    if (confirm(message)) {
        try {
            const response = await fetch(`/items/${itemId}/purchase`, {
                method: 'POST',
                credentials: 'include'
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('Purchase toggle result:', result);
                
                // Update just the button status without refreshing the whole list
                const button = document.querySelector(`button[data-item-id="${itemId}"]`);
                if (button) {
                    const newStatus = result.purchased;
                    button.className = newStatus ? 
                        'bg-theme-light-success/10 text-theme-light-success dark:bg-theme-dark-success/10 dark:text-theme-dark-success px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity' : 
                        'bg-theme-light-warning/10 text-theme-light-warning dark:bg-theme-dark-warning/10 dark:text-theme-dark-warning px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity';
                    button.textContent = newStatus ? 'Purchased' : 'Not Purchased';
                }
            } else {
                console.error('Failed to toggle purchase status:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error details:', errorText);
            }
        } catch (error) {
            console.error('Error toggling purchased status:', error);
        }
    }
}

async function fetchWishlists() {
    try {
        const response = await fetch('/wishlists/');
        const wishlists = await response.json();
        console.log('Fetched wishlists:', wishlists);
        
        const wishlistsDiv = document.getElementById('wishlists-container');
        wishlistsDiv.innerHTML = '';
        wishlistsDiv.className = 'space-y-6 max-w-3xl mx-auto';
        
        wishlists.forEach(wishlist => {
            console.log('Processing wishlist:', wishlist);
            const wishlistDiv = document.createElement('div');
            wishlistDiv.className = 'bg-theme-light-surface dark:bg-theme-dark-surface rounded-xl shadow-lg dark:shadow-dark-lg';
            wishlistDiv.innerHTML = `
                <div class="p-4 sm:p-6">
                    <div class="flex items-center gap-4 cursor-pointer group flex-1 min-w-0" onclick="toggleWishlist(${wishlist.id})">
                        <svg id="chevron-${wishlist.id}" class="w-5 h-5 transform transition-transform rotate-180 text-theme-light-primary dark:text-theme-dark-primary flex-shrink-0" 
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                        <div class="min-w-0">
                            <h2 class="text-xl font-semibold text-theme-light-text dark:text-theme-dark-text group-hover:text-theme-light-primary dark:group-hover:text-theme-dark-primary transition-colors truncate">${wishlist.name}</h2>
                            <p class="text-theme-light-textMuted dark:text-theme-dark-textMuted text-sm truncate">For: ${wishlist.person}</p>
                        </div>
                    </div>
                </div>
                
                <div id="wishlist-content-${wishlist.id}" class="${expandedWishlists.has(wishlist.id) ? '' : 'hidden'} border-t border-theme-light-border dark:border-theme-dark-border/10">
                    <div class="p-4 sm:p-6 space-y-4">
                        <div class="overflow-x-auto rounded-lg border border-theme-light-border dark:border-theme-dark-border/10">
                            <table class="w-full">
                                <thead class="bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt">
                                    <tr>
                                        <th class="text-left px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium">Item</th>
                                        <th class="text-center px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium hidden sm:table-cell">Link</th>
                                        <th class="text-center px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium w-32">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-theme-light-border dark:divide-theme-dark-border/10">
                                    ${wishlist.items.map((item, index) => `
                                        <tr class="${index % 2 === 0 ? 
                                            'bg-theme-light-surface dark:bg-theme-dark-surface' : 
                                            'bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt/50'} 
                                            hover:bg-theme-light-primary/5 dark:hover:bg-theme-dark-primary/10 transition-colors">
                                            <td class="px-4 py-4 sm:py-3 text-theme-light-text dark:text-theme-dark-text">
                                                <div class="space-y-2">
                                                    <div class="font-medium">${item.name}</div>
                                                    ${item.link ? `
                                                        <a href="${item.link}" target="_blank" 
                                                            class="text-theme-light-primary dark:text-theme-dark-primary hover:opacity-80 
                                                                   inline-flex items-center gap-1 text-sm bg-theme-light-primary/10 
                                                                   dark:bg-theme-dark-primary/10 px-3 py-1.5 rounded-lg 
                                                                   transition-all block sm:hidden">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                                                                stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                                <path stroke-linecap="round" stroke-linejoin="round" 
                                                                    d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                                            </svg>
                                                            View Link
                                                        </a>
                                                    ` : ''}
                                                </div>
                                            </td>
                                            <td class="px-4 py-4 sm:py-3 text-center hidden sm:table-cell">
                                                ${item.link ? `
                                                    <a href="${item.link}" target="_blank" 
                                                        class="text-theme-light-primary dark:text-theme-dark-primary hover:underline">
                                                        View
                                                    </a>
                                                ` : '-'}
                                            </td>
                                            <td class="px-4 py-4 sm:py-3 text-center">
                                                <button onclick="togglePurchased(${item.id}, '${item.name}', ${item.purchased})"
                                                    data-item-id="${item.id}"
                                                    class="${item.purchased ? 
                                                        'bg-theme-light-success/10 text-theme-light-success dark:bg-theme-dark-success/10 dark:text-theme-dark-success' : 
                                                        'bg-theme-light-warning/10 text-theme-light-warning dark:bg-theme-dark-warning/10 dark:text-theme-dark-warning'} 
                                                        px-3 py-1.5 rounded-lg text-sm hover:opacity-80 transition-opacity">
                                                    ${item.purchased ? 'Purchased' : 'Not Purchased'}
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                    ${wishlist.items.length === 0 ? `
                                        <tr>
                                            <td colspan="3" class="px-4 py-8 text-center text-theme-light-textMuted dark:text-theme-dark-textMuted">
                                                No items in this wishlist yet
                                            </td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            wishlistsDiv.appendChild(wishlistDiv);
            
            // Restore expanded state
            if (expandedWishlists.has(wishlist.id)) {
                const content = document.getElementById(`wishlist-content-${wishlist.id}`);
                const chevron = document.getElementById(`chevron-${wishlist.id}`);
                if (content) content.classList.remove('hidden');
                if (chevron) chevron.classList.remove('rotate-180');
            }
        });
    } catch (error) {
        console.error('Error fetching wishlists:', error);
    }
}

// Initial load
fetchWishlists();
