class ItemDetail {
    constructor() {
        this.baseUrl = this.getBaseUrl();
        this.loadItem();
    }

    getBaseUrl() {
        const pathParts = window.location.pathname.split('/');
        pathParts.pop();
        return window.location.origin + pathParts.join('/');
    }

    getItemId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    async loadItem() {
        try {
            const response = await fetch(`${this.baseUrl}/api/handler.php`);
            if (!response.ok) throw new Error('Failed to load data');
            
            const data = await response.json();
            const itemId = parseInt(this.getItemId());
            const item = data.items.find(item => item.id === itemId);
            
            if (item) {
                this.renderItem(item);
            } else {
                this.renderError('Item not found');
            }
        } catch (error) {
            console.error('Error loading item:', error);
            this.renderError('Failed to load item');
        }
    }

    renderItem(item) {
        const container = document.getElementById('itemDetail');
        container.innerHTML = `
            <h1>${this.escapeHtml(item.title)}</h1>
            ${item.image ? `<img src="${item.image}" alt="${this.escapeHtml(item.title)}">` : ''}
            <div class="item-content">${this.escapeHtml(item.content)}</div>
            <div class="item-meta">
                <p>Created: ${new Date(item.createdAt).toLocaleDateString()}</p>
                ${item.updatedAt ? `<p>Updated: ${new Date(item.updatedAt).toLocaleDateString()}</p>` : ''}
            </div>
        `;
    }

    renderError(message) {
        const container = document.getElementById('itemDetail');
        container.innerHTML = `
            <div class="error-message">
                <h2>Error</h2>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the detail page
const itemDetail = new ItemDetail(); 