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
        
        const wishlistsDiv = document.getElementById('wishlists');
        wishlistsDiv.innerHTML = '';
        
        wishlists.forEach(wishlist => {
            console.log('Processing wishlist:', wishlist);
            const wishlistDiv = document.createElement('div');
            wishlistDiv.className = 'bg-theme-light-surface dark:bg-theme-dark-surface rounded-xl shadow-lg dark:shadow-dark-lg border border-theme-light-border dark:border-theme-dark-border/20 transition-colors';
            wishlistDiv.innerHTML = `
                <div class="p-6 border-b border-theme-light-border dark:border-theme-dark-border/10">
                    <div class="flex justify-between items-center cursor-pointer group" onclick="toggleWishlist(${wishlist.id})">
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-3">
                                <svg id="chevron-${wishlist.id}" class="w-5 h-5 transform transition-transform rotate-180 text-theme-light-primary dark:text-theme-dark-primary" 
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                                <div>
                                    <h2 class="text-xl font-semibold text-theme-light-text dark:text-theme-dark-text group-hover:text-theme-light-primary dark:group-hover:text-theme-dark-primary transition-colors">${wishlist.name}</h2>
                                    <p class="text-theme-light-textMuted dark:text-theme-dark-textMuted text-sm">For: ${wishlist.person}</p>
                                </div>
                            </div>
                        </div>
                        <span id="status-${wishlist.id}" class="text-theme-light-textMuted dark:text-theme-dark-textMuted text-sm">Click to collapse</span>
                    </div>
                </div>
                
                <div id="wishlist-content-${wishlist.id}" class="p-6 bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt/30">
                    <div class="flex gap-4 mb-6">
                        <input type="text" id="new-item-name-${wishlist.id}" placeholder="Item Name" 
                            class="flex-1 px-4 py-2 rounded-lg bg-theme-light-surface dark:bg-theme-dark-surface border border-theme-light-border dark:border-theme-dark-border/20
                                   text-theme-light-text dark:text-theme-dark-text placeholder-theme-light-textMuted dark:placeholder-theme-dark-textMuted/70
                                   focus:outline-none focus:ring-2 focus:ring-theme-light-primary dark:focus:ring-theme-dark-primary/50
                                   transition-colors">
                        <input type="text" id="new-item-link-${wishlist.id}" placeholder="Item Link" 
                            class="flex-1 px-4 py-2 rounded-lg bg-theme-light-surface dark:bg-theme-dark-surface border border-theme-light-border dark:border-theme-dark-border/20
                                   text-theme-light-text dark:text-theme-dark-text placeholder-theme-light-textMuted dark:placeholder-theme-dark-textMuted/70
                                   focus:outline-none focus:ring-2 focus:ring-theme-light-primary dark:focus:ring-theme-dark-primary/50
                                   transition-colors">
                        <button onclick="addItem(${wishlist.id})" class="px-6 py-2 bg-theme-light-primary dark:bg-theme-dark-primary text-white rounded-lg 
                                     hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                            Add Item
                        </button>
                    </div>
                    
                    <div class="overflow-hidden rounded-lg border border-theme-light-border dark:border-theme-dark-border/10">
                        <table class="w-full">
                            <thead>
                                <tr class="bg-theme-light-surface dark:bg-theme-dark-surface/50">
                                    <th class="px-4 py-3 text-left text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Item</th>
                                    <th class="px-4 py-3 text-left text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Link</th>
                                    <th class="px-4 py-3 text-center text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Status</th>
                                    <th class="px-4 py-3 text-center text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-theme-light-border dark:divide-theme-dark-border/10">
                                ${wishlist.items ? wishlist.items.map(item => `
                                    <tr class="border-t border-theme-light-border dark:border-theme-dark-border/10 ${item.purchased 
                                        ? 'bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt/70' 
                                        : 'bg-theme-light-surface dark:bg-theme-dark-surface hover:bg-theme-light-surfaceAlt dark:hover:bg-theme-dark-surfaceAlt/30'}">
                                        <td class="px-4 py-2 ${item.purchased ? 'line-through text-theme-light-textMuted dark:text-theme-dark-textMuted' : 'text-theme-light-text dark:text-theme-dark-text'}">
                                            ${item.name}
                                        </td>
                                        <td class="px-4 py-2">
                                            <a href="${item.link}" target="_blank" 
                                                class="${item.purchased 
                                                    ? 'line-through text-theme-light-textMuted dark:text-theme-dark-textMuted pointer-events-none' 
                                                    : 'text-theme-light-primary dark:text-theme-dark-primary hover:text-theme-light-secondary dark:hover:text-theme-dark-secondary'}">${item.link}</a>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <button onclick="togglePurchased(${item.id})"
                                                title="${item.purchased 
                                                    ? `Purchased on ${new Date(item.purchase_date).toLocaleString()}\nClick to mark as not purchased` 
                                                    : 'Click to mark as purchased'}"
                                                class="${item.purchased 
                                                    ? 'bg-theme-light-success/20 text-theme-light-success dark:bg-theme-dark-success/20 dark:text-theme-dark-success' 
                                                    : 'bg-theme-light-warning/20 text-theme-light-warning dark:bg-theme-dark-warning/20 dark:text-theme-dark-warning'} 
                                                    px-3 py-1 rounded hover:opacity-80 transition-opacity">
                                                ${item.purchased ? 'Purchased' : 'Mark Purchased'}
                                            </button>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <button onclick="deleteItem(${item.id})" 
                                                class="bg-theme-light-danger/20 text-theme-light-danger dark:bg-theme-dark-danger/20 dark:text-theme-dark-danger px-3 py-1 rounded hover:opacity-80 transition-opacity">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `).join('') : ''}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            wishlistsDiv.appendChild(wishlistDiv);
        });
    } catch (error) {
        console.error('Error fetching wishlists:', error);
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

async function addItem(wishlistId) {
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

async function deleteItem(itemId) {
    try {
        await fetch(`/items/${itemId}/`, { method: 'DELETE' });
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

// Initial load
fetchWishlists();
