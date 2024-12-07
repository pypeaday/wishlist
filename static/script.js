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

// Wishlist functionality
let wishlists = [];
let nextWishlistId = 1;
let nextItemId = 1;

function createWishlist(name, person) {
    const wishlist = {
        id: nextWishlistId++,
        name: name,
        person: person,
        items: []
    };
    wishlists.push(wishlist);
    renderWishlists();
    return wishlist;
}

function addItem(wishlistId, name, link) {
    const wishlist = wishlists.find(w => w.id === wishlistId);
    if (wishlist) {
        const item = {
            id: nextItemId++,
            name: name,
            link: link,
            purchased: false
        };
        wishlist.items.push(item);
        renderWishlists();
    }
}

function togglePurchased(itemId) {
    for (let wishlist of wishlists) {
        const item = wishlist.items.find(i => i.id === itemId);
        if (item) {
            item.purchased = !item.purchased;
            renderWishlists();
            break;
        }
    }
}

function deleteItem(itemId) {
    for (let wishlist of wishlists) {
        const index = wishlist.items.findIndex(i => i.id === itemId);
        if (index !== -1) {
            wishlist.items.splice(index, 1);
            renderWishlists();
            break;
        }
    }
}

function toggleWishlist(wishlistId) {
    const chevron = document.getElementById(`chevron-${wishlistId}`);
    const content = document.getElementById(`wishlist-content-${wishlistId}`);
    const status = document.getElementById(`status-${wishlistId}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
        status.textContent = 'Click to collapse';
    } else {
        content.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
        status.textContent = 'Click to expand';
    }
}

function renderWishlists() {
    const container = document.getElementById('wishlists');
    container.innerHTML = '';
    
    wishlists.forEach(wishlist => {
        const items = wishlist.items.map(item => `
            <tr class="border-t border-theme-light-border dark:border-theme-dark-border ${item.purchased ? 'bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt' : ''}">
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
                        class="px-3 py-1 rounded-lg text-sm ${item.purchased 
                            ? 'bg-theme-light-success/20 dark:bg-theme-dark-success/20 text-theme-light-success dark:text-theme-dark-success' 
                            : 'bg-theme-light-primary/20 dark:bg-theme-dark-primary/20 text-theme-light-primary dark:text-theme-dark-primary hover:bg-theme-light-primary/30 dark:hover:bg-theme-dark-primary/30'}">
                        ${item.purchased ? 'Purchased' : 'Mark Purchased'}
                    </button>
                </td>
                <td class="px-4 py-2 text-center">
                    <button onclick="deleteItem(${item.id})" 
                        class="px-3 py-1 bg-theme-light-danger/20 dark:bg-theme-dark-danger/20 text-theme-light-danger dark:text-theme-dark-danger rounded-lg text-sm hover:bg-theme-light-danger/30 dark:hover:bg-theme-dark-danger/30">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');

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
                    <button onclick="addItemToWishlist(${wishlist.id})" 
                        class="px-6 py-2 bg-theme-light-primary dark:bg-theme-dark-primary text-white rounded-lg 
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
                                <th class="px-4 py-3 text-left text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Status</th>
                                <th class="px-4 py-3 text-left text-sm font-medium text-theme-light-textMuted dark:text-theme-dark-textMuted">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-theme-light-border dark:divide-theme-dark-border/10">
                            ${items}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        container.appendChild(wishlistDiv);
    });
}

// Event Listeners
document.getElementById('add-wishlist').addEventListener('click', function() {
    const nameInput = document.getElementById('wishlist-name');
    const personInput = document.getElementById('wishlist-person');
    
    if (nameInput.value && personInput.value) {
        createWishlist(nameInput.value, personInput.value);
        nameInput.value = '';
        personInput.value = '';
    }
});

function addItemToWishlist(wishlistId) {
    const nameInput = document.getElementById(`new-item-name-${wishlistId}`);
    const linkInput = document.getElementById(`new-item-link-${wishlistId}`);
    
    if (nameInput.value && linkInput.value) {
        addItem(wishlistId, nameInput.value, linkInput.value);
        nameInput.value = '';
        linkInput.value = '';
    }
}

// Initial render
renderWishlists();
