class ItemManager {
    constructor() {
        this.items = [];
        this.baseUrl = this.getBaseUrl();
        this.loadItems();
    }

    getBaseUrl() {
        const pathParts = window.location.pathname.split('/');
        pathParts.pop();
        return window.location.origin + pathParts.join('/');
    }

    async loadItems() {
        try {
            const response = await fetch(`${this.baseUrl}/api/handler.php`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.items = data.items.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            this.renderItems();
        } catch (error) {
            console.error('Error loading items:', error);
            this.items = [];
            this.renderItems();
        }
    }

    async saveItems() {
        try {
            const response = await fetch(`${this.baseUrl}/api/handler.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: this.items })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save items');
            }
            
            const result = await response.json();
            if (!result.success) {
                throw new Error('Server failed to save items');
            }
        } catch (error) {
            console.error('Error saving items:', error);
            alert('Failed to save changes. Please try again.');
        }
    }

    renderItems() {
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';
        
        this.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-card';
            itemDiv.innerHTML = `
                <a href="single.html?id=${item.id}" class="item-link">
                    ${item.image ? `<img src="${item.image}" class="item-image" alt="${this.escapeHtml(item.title)}">` : ''}
                    <div class="item-title">${this.escapeHtml(item.title)}</div>
                    <div class="item-content">${this.escapeHtml(item.content.substring(0, 150))}${item.content.length > 150 ? '...' : ''}</div>
                    <div class="item-meta">
                        <small>Created: ${new Date(item.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="item-actions">
                        <button class="edit-btn" onclick="event.preventDefault(); itemManager.editItem(${item.id})">Edit</button>
                        <button class="delete-btn" onclick="event.preventDefault(); itemManager.deleteItem(${item.id})">Delete</button>
                    </div>
                </a>
            `;
            itemsList.appendChild(itemDiv);
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    generateId() {
        return this.items.length > 0 
            ? Math.max(...this.items.map(item => item.id)) + 1 
            : 1;
    }

    async addItem(title, content, imageFile) {
        try {
            let imageUrl = null;
            
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                const response = await fetch(`${this.baseUrl}/api/upload.php`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const result = await response.json();
                if (result.success) {
                    imageUrl = result.imageUrl;
                }
            }

            const newItem = {
                id: this.generateId(),
                title: title.trim(),
                content: content.trim(),
                image: imageUrl,
                createdAt: new Date().toISOString()
            };
            
            this.items.unshift(newItem);
            await this.saveItems();
            this.renderItems();
            return true;
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item: ' + error.message);
            return false;
        }
    }

    async updateItem(id, title, content, imageFile) {
        try {
            const item = this.items.find(item => item.id === id);
            if (!item) return false;

            let imageUrl = item.image; // Keep existing image by default

            // Only attempt upload if a new image was selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                const response = await fetch(`${this.baseUrl}/api/upload.php`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload image');
                }

                const result = await response.json();
                if (result.success) {
                    imageUrl = result.imageUrl;
                }
            }

            item.title = title.trim();
            item.content = content.trim();
            item.image = imageUrl;
            item.updatedAt = new Date().toISOString();

            await this.saveItems();
            this.renderItems();
            return true;
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Error updating item: ' + error.message);
            return false;
        }
    }

    async deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.items = this.items.filter(item => item.id !== id);
            await this.saveItems();
            this.renderItems();
            return true;
        }
        return false;
    }

    editItem(id) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            const titleInput = document.getElementById('titleInput');
            const contentInput = document.getElementById('contentInput');
            const editId = document.getElementById('editId');
            
            titleInput.value = item.title;
            contentInput.value = item.content;
            editId.value = item.id;
            document.getElementById('submitBtn').textContent = 'Update Item';
        }
    }
}

// Initialize ItemManager
const itemManager = new ItemManager();

// Handle form submission
async function handleSubmit() {
    const titleInput = document.getElementById('titleInput');
    const contentInput = document.getElementById('contentInput');
    const imageInput = document.getElementById('imageInput');
    const editId = document.getElementById('editId');


   // <section class="form-container" id="formContainer" data-edit="false">


   console.log(titleInput);
    console.log('1 --------------------------------');
    console.log(titleInput.getAttribute('edit'));
    console.log(titleInput.getAttribute('disabled'));
    console.log(titleInput.getAttribute('required'));
    console.log(titleInput.getAttribute('type'));
    console.log(titleInput.getAttribute('id'));
    console.log(titleInput.getAttribute('placeholder'));
    console.log(titleInput.getAttribute('value'));

    console.log('2 --------------------------------');

    console.log(titleInput.edit);
    console.log(titleInput.disabled);
    console.log(titleInput.required);
    console.log(titleInput.type);
    console.log(titleInput.id);
    console.log(titleInput.placeholder);
    console.log(titleInput.value);

    if (titleInput.value.trim() === '' || contentInput.value.trim() === '') {
        //alert('Please fill in both title and content');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
        if (editId.value === '') {
            // Create new item
            await itemManager.addItem(titleInput.value, contentInput.value, imageInput.files[0]);
        } else {
            // Update existing item
            await itemManager.updateItem(
                parseInt(editId.value),
                titleInput.value,
                contentInput.value,
                imageInput.files[0]
            );
            document.getElementById('submitBtn').textContent = 'Add Item';
        }
        
        // Clear form
        titleInput.value = '';
        contentInput.value = '';
        imageInput.value = '';
        editId.value = '';
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('Error handling form submission: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save';
    }
}
// Add form submit event listener
document.getElementById('submitBtn').addEventListener('click', handleSubmit);
// Add this line for debugging
console.log('Current base URL:', new ItemManager().baseUrl); 