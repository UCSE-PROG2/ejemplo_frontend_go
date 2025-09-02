let products = [];
let editingProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!requireAuth()) return;

    // Cargar productos al inicio
    loadProducts();

    // Configurar formulario
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', handleFormSubmit);
});

async function loadProducts() {
    const container = document.getElementById('productsContainer');
    container.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Cargando productos...</p>
        </div>
    `;

    try {
        const response = await fetch('/api/products', {
            headers: getApiHeaders()
        });

        if (response.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }

        const data = await response.json();

        if (response.ok) {
            products = data;
            renderProducts();
        } else {
            showMessage(data.error || 'Error al cargar productos', 'danger');
            container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                    <h3 class="mt-3">Error al cargar productos</h3>
                    <p class="text-muted">${data.error || 'Error desconocido'}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión', 'danger');
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-wifi-off text-muted" style="font-size: 3rem;"></i>
                <h3 class="mt-3">Error de conexión</h3>
                <p class="text-muted">No se pudo conectar con el servidor</p>
            </div>
        `;
    }
}

function renderProducts() {
    const container = document.getElementById('productsContainer');
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox text-muted" style="font-size: 3rem;"></i>
                <h3 class="mt-3">No tienes productos</h3>
                <p class="text-muted">Agrega tu primer producto usando el formulario de arriba</p>
            </div>
        `;
        return;
    }

    const productsHTML = products.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div class="product-info">
                    <h5 class="mb-1">${escapeHtml(product.nombre)}</h5>
                    <span class="badge bg-primary">${escapeHtml(product.tipo)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="editProduct('${product.id}')">
                        <i class="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct('${product.id}')">
                        <i class="bi bi-trash me-1"></i>Eliminar
                    </button>
                </div>
            </div>
            <div class="product-dates">
                <small class="text-muted">
                    <i class="bi bi-calendar-plus me-1"></i>Creado: ${formatDate(product.fecha_creacion)}
                </small>
                <br>
                <small class="text-muted">
                    <i class="bi bi-calendar-check me-1"></i>Actualizado: ${formatDate(product.fecha_ultima_actualizacion)}
                </small>
            </div>
        </div>
    `).join('');

    container.innerHTML = productsHTML;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const productData = {
        nombre: formData.get('nombre'),
        tipo: formData.get('tipo')
    };

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = editingProduct ? 
            '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Actualizando...' : 
            '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Agregando...';

        let response;
        if (editingProduct) {
            // Actualizar producto existente
            response = await fetch(`/api/products/${editingProduct.id}`, {
                method: 'PUT',
                headers: getApiHeaders(),
                body: JSON.stringify(productData)
            });
        } else {
            // Crear nuevo producto
            response = await fetch('/api/products', {
                method: 'POST',
                headers: getApiHeaders(),
                body: JSON.stringify(productData)
            });
        }

        const data = await response.json();

        if (response.ok) {
            showMessage(
                editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente', 
                'success'
            );
            e.target.reset();
            cancelEdit();
            loadProducts();
        } else {
            showMessage(data.error || 'Error al procesar el producto', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión', 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    editingProduct = product;
    
    document.getElementById('productId').value = product.id;
    document.getElementById('nombre').value = product.nombre;
    document.getElementById('tipo').value = product.tipo;
    
    document.getElementById('formTitle').innerHTML = '<i class="bi bi-pencil me-2"></i>Editar Producto';
    document.getElementById('submitBtn').innerHTML = '<i class="bi bi-check-circle me-2"></i>Actualizar Producto';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    
    // Scroll al formulario
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
    editingProduct = null;
    
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Agregar Producto';
    document.getElementById('submitBtn').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Agregar Producto';
    document.getElementById('cancelBtn').style.display = 'none';
}

async function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        return;
    }

    try {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
            headers: getApiHeaders()
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Producto eliminado exitosamente', 'success');
            loadProducts();
        } else {
            showMessage(data.error || 'Error al eliminar el producto', 'danger');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error de conexión', 'danger');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = messageDiv.querySelector('.alert');
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
