// script.js

// Theme handling
function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
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

// Theme toggle functionality
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    themeToggleDarkIcon.classList.add('hidden');
} else {
    themeToggleLightIcon.classList.add('hidden');
    themeToggleDarkIcon.classList.remove('hidden');
}

document.getElementById('theme-toggle').addEventListener('click', function() {
    // Toggle icons
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // If is dark mode
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});

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
                    <div class="flex justify-between items-start gap-4">
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
                        <button onclick="deleteWishlist(${wishlist.id}, '${wishlist.name}', ${wishlist.items.length})"
                            class="px-3 py-1.5 bg-theme-light-danger/10 text-theme-light-danger dark:bg-theme-dark-danger/10 dark:text-theme-dark-danger 
                                   rounded-lg hover:opacity-80 transition-opacity text-sm whitespace-nowrap flex-shrink-0">
                            Delete
                        </button>
                    </div>
                </div>
                
                <div id="wishlist-content-${wishlist.id}" class="hidden border-t border-theme-light-border dark:border-theme-dark-border/10">
                    <div class="p-4 sm:p-6 space-y-4">
                        <form onsubmit="addItem(${wishlist.id}, event)" class="flex flex-col sm:flex-row gap-4">
                            <input type="text" id="new-item-name-${wishlist.id}" placeholder="Item Name" required
                                class="flex-1 px-4 py-2 rounded-lg bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt 
                                       border border-theme-light-border dark:border-theme-dark-border/20
                                       text-theme-light-text dark:text-theme-dark-text 
                                       placeholder-theme-light-textMuted dark:placeholder-theme-dark-textMuted/70
                                       focus:outline-none focus:ring-2 focus:ring-theme-light-primary dark:focus:ring-theme-dark-primary/50
                                       transition-colors">
                            <input type="text" id="new-item-link-${wishlist.id}" placeholder="Item Link (optional)"
                                class="flex-1 px-4 py-2 rounded-lg bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt 
                                       border border-theme-light-border dark:border-theme-dark-border/20
                                       text-theme-light-text dark:text-theme-dark-text 
                                       placeholder-theme-light-textMuted dark:placeholder-theme-dark-textMuted/70
                                       focus:outline-none focus:ring-2 focus:ring-theme-light-primary dark:focus:ring-theme-dark-primary/50
                                       transition-colors">
                            <button type="submit" 
                                class="px-6 py-2 bg-theme-light-primary dark:bg-theme-dark-primary text-white rounded-lg 
                                       hover:opacity-90 transition-all duration-200 font-medium shadow-md hover:shadow-lg
                                       w-full sm:w-auto whitespace-nowrap">
                                Add Item
                            </button>
                        </form>
                        
                        <div class="overflow-x-auto rounded-lg border border-theme-light-border dark:border-theme-dark-border/10">
                            <table class="w-full">
                                <thead class="bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt">
                                    <tr>
                                        <th class="text-left px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium">Item</th>
                                        <th class="text-center px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium hidden sm:table-cell">Link</th>
                                        <th class="text-center px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium w-32">Status</th>
                                        <th class="text-center px-4 py-3 text-theme-light-textMuted dark:text-theme-dark-textMuted font-medium w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-theme-light-border dark:divide-theme-dark-border/10">
                                    ${wishlist.items.map(item => `
                                        <tr class="bg-theme-light-surface dark:bg-theme-dark-surface">
                                            <td class="px-4 py-3 text-theme-light-text dark:text-theme-dark-text">${item.name}</td>
                                            <td class="px-4 py-3 text-center hidden sm:table-cell">
                                                ${item.link ? `
                                                    <a href="${item.link}" target="_blank" 
                                                        class="text-theme-light-primary dark:text-theme-dark-primary hover:underline">
                                                        View
                                                    </a>
                                                ` : '-'}
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <button onclick="togglePurchased(${item.id})"
                                                    class="${item.purchased ? 
                                                        'bg-theme-light-success/10 text-theme-light-success dark:bg-theme-dark-success/10 dark:text-theme-dark-success' : 
                                                        'bg-theme-light-warning/10 text-theme-light-warning dark:bg-theme-dark-warning/10 dark:text-theme-dark-warning'} 
                                                        px-3 py-1 rounded text-sm hover:opacity-80 transition-opacity">
                                                    ${item.purchased ? 'Purchased' : 'Not Purchased'}
                                                </button>
                                            </td>
                                            <td class="px-4 py-3 text-center">
                                                <button onclick="deleteItem(${item.id}, '${item.name}')"
                                                    class="text-theme-light-danger dark:text-theme-dark-danger hover:opacity-80 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                                                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                        <path stroke-linecap="round" stroke-linejoin="round" 
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                    ${wishlist.items.length === 0 ? `
                                        <tr>
                                            <td colspan="4" class="px-4 py-8 text-center text-theme-light-textMuted dark:text-theme-dark-textMuted">
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
        });
    } catch (error) {
        console.error('Error fetching wishlists:', error);
    }
}

async function deleteWishlist(wishlistId, wishlistName, itemCount) {
    // First confirmation
    if (!confirm(`Are you sure you want to delete the wishlist "${wishlistName}"?\nThis will delete ${itemCount} items.`)) {
        return;
    }
    
    // Second confirmation
    const confirmText = `delete ${wishlistName}`;
    const userInput = prompt(`To confirm deletion, please type "${confirmText}" below:`);
    
    if (userInput !== confirmText) {
        alert("Deletion cancelled: text did not match.");
        return;
    }
    
    try {
        const response = await fetch(`/wishlists/${wishlistId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        console.log('Delete result:', result);
        fetchWishlists(); // Refresh the list
    } catch (error) {
        console.error('Error deleting wishlist:', error);
        alert('Error deleting wishlist. Please try again.');
    }
}

function toggleWishlist(wishlistId) {
    const content = document.getElementById(`wishlist-content-${wishlistId}`);
    const chevron = document.getElementById(`chevron-${wishlistId}`);
    const status = document.getElementById(`status-${wishlistId}`);
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
        status.textContent = 'Click to collapse';
    } else {
        content.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
        status.textContent = 'Click to expand';
    }
}

async function addItem(wishlistId, event) {
    if (event) {
        event.preventDefault();
    }
    
    const nameInput = document.getElementById(`new-item-name-${wishlistId}`);
    const linkInput = document.getElementById(`new-item-link-${wishlistId}`);
    const name = nameInput.value.trim();
    const link = linkInput.value.trim();
    
    if (!name) return;

    try {
        await fetch(`/wishlists/${wishlistId}/items/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, link }),
        });
        nameInput.value = '';
        linkInput.value = '';
        fetchWishlists();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

async function togglePurchased(itemId) {
    const row = document.querySelector(`button[onclick="togglePurchased(${itemId})"]`).closest('tr');
    const itemName = row.querySelector('td').textContent.trim();
    const isPurchased = row.querySelector('button').textContent.trim() === 'Purchased';
    
    const action = isPurchased ? 'mark as not purchased' : 'mark as purchased';
    if (!confirm(`Are you sure you want to ${action} "${itemName}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/items/${itemId}/purchase`, {
            method: 'POST'
        });
        const updatedItem = await response.json();
        console.log('Updated item:', updatedItem);
        fetchWishlists(); // Refresh the list
    } catch (error) {
        console.error('Error toggling purchased status:', error);
    }
}

async function deleteItem(itemId, itemName) {
    // Ask for confirmation
    if (!confirm(`Are you sure you want to delete "${itemName}" from this wishlist?`)) {
        return;
    }

    try {
        await fetch(`/items/${itemId}`, { method: 'DELETE' });
        fetchWishlists();
    } catch (error) {
        console.error('Error deleting item:', error);
    }
}

document.getElementById('add-wishlist').addEventListener('click', async () => {
    const nameInput = document.getElementById('wishlist-name');
    const personInput = document.getElementById('wishlist-person');
    const name = nameInput.value.trim();
    const person = personInput.value.trim();
    
    if (!name || !person) return;

    try {
        await fetch('/wishlists/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, person }),
        });
        nameInput.value = '';
        personInput.value = '';
        fetchWishlists();
    } catch (error) {
        console.error('Error adding wishlist:', error);
    }
});

// Help section toggle
function toggleHelp() {
    const content = document.getElementById('help-content');
    const chevron = document.getElementById('help-chevron');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        chevron.classList.add('rotate-180');
    } else {
        content.classList.add('hidden');
        chevron.classList.remove('rotate-180');
    }
}

// Initial load
fetchWishlists();
