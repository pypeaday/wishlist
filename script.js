// script.js

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
            wishlistDiv.className = 'bg-white p-6 rounded-lg shadow';
            wishlistDiv.innerHTML = `
                <div class="flex justify-between items-center mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded" 
                    onclick="toggleWishlist(${wishlist.id})">
                    <div class="flex items-center gap-4 flex-1">
                        <div class="flex items-center gap-2">
                            <svg id="chevron-${wishlist.id}" class="w-6 h-6 transform transition-transform rotate-180" 
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            <div>
                                <h2 class="text-2xl font-semibold">${wishlist.name}</h2>
                                <p class="text-gray-600">For: ${wishlist.person}</p>
                            </div>
                        </div>
                    </div>
                    <span id="status-${wishlist.id}" class="text-gray-500 text-sm">Click to collapse</span>
                </div>
                
                <div id="wishlist-content-${wishlist.id}" class="border-t pt-4">
                    <div class="flex gap-4 items-center mb-4">
                        <input type="text" placeholder="Item Name" 
                            class="p-2 border rounded" id="new-item-name-${wishlist.id}">
                        <input type="text" placeholder="Item Link" 
                            class="p-2 border rounded" id="new-item-link-${wishlist.id}">
                        <button onclick="addItem(${wishlist.id})" 
                            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                            Add Item
                        </button>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="min-w-full table-auto">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-4 py-2 text-left">Item</th>
                                    <th class="px-4 py-2 text-left">Link</th>
                                    <th class="px-4 py-2 text-center">Status</th>
                                    <th class="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${wishlist.items ? wishlist.items.map(item => `
                                    <tr class="border-t ${item.purchased ? 'bg-gray-50' : ''}">
                                        <td class="px-4 py-2 ${item.purchased ? 'line-through text-gray-500' : ''}">${item.name}</td>
                                        <td class="px-4 py-2 ${item.purchased ? 'line-through text-gray-500' : ''}">
                                            ${item.link ? 
                                                item.purchased ?
                                                    `<span class="text-gray-500">${item.link}</span>` :
                                                    `<a href="${item.link}" target="_blank" 
                                                        class="text-blue-500 hover:text-blue-700">View Item</a>`
                                                : ''}
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <button onclick="togglePurchased(${item.id})" 
                                                class="px-3 py-1 rounded ${item.purchased ? 
                                                    'bg-gray-200 text-gray-700' : 
                                                    'bg-yellow-500 text-white hover:bg-yellow-600'}">
                                                ${item.purchased ? 'Purchased' : 'Mark Purchased'}
                                            </button>
                                        </td>
                                        <td class="px-4 py-2 text-center">
                                            <button onclick="deleteItem(${item.id})" 
                                                class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
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
    try {
        await fetch(`/items/${itemId}/purchase/`, { method: 'PUT' });
        fetchWishlists();
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
