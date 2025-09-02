# API Endpoints - Curl Examples

## Autenticación

### Registro de Usuario
**Endpoint:** `POST /api/auth/register`  
**Propósito:** Crear una nueva cuenta de usuario  
**Ejemplo:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

### Login de Usuario
**Endpoint:** `POST /api/auth/login`  
**Propósito:** Iniciar sesión y obtener token JWT  
**Ejemplo:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "123456"
  }'
```

## Productos (Requiere Autenticación)

### Obtener Productos
**Endpoint:** `GET /api/products`  
**Propósito:** Listar todos los productos del usuario autenticado  
**Ejemplo:**
```bash
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

### Crear Producto
**Endpoint:** `POST /api/products`  
**Propósito:** Crear un nuevo producto  
**Ejemplo:**
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -d '{
    "nombre": "Producto Ejemplo",
    "tipo": "Electrónico"
  }'
```

### Actualizar Producto
**Endpoint:** `PUT /api/products/:id`  
**Propósito:** Modificar un producto existente  
**Ejemplo:**
```bash
curl -X PUT http://localhost:8080/api/products/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -d '{
    "nombre": "Producto Actualizado",
    "tipo": "Nuevo Tipo"
  }'
```

### Eliminar Producto
**Endpoint:** `DELETE /api/products/:id`  
**Propósito:** Eliminar un producto  
**Ejemplo:**
```bash
curl -X DELETE http://localhost:8080/api/products/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

## Páginas Web

### Página de Login
**Endpoint:** `GET /login`  
**Propósito:** Mostrar formulario de login  

### Página de Registro
**Endpoint:** `GET /register`  
**Propósito:** Mostrar formulario de registro  

### Página de Productos
**Endpoint:** `GET /products`  
**Propósito:** Mostrar lista de productos (requiere autenticación)  

### Página Principal
**Endpoint:** `GET /`  
**Propósito:** Redirige a la página de login
