# Aplicación Web con Go, Gin y MongoDB

Una aplicación web completa con autenticación JWT, gestión de productos y interfaz web moderna.

## Características

- ✅ API REST con endpoints de login y registro
- ✅ Autenticación JWT con middleware
- ✅ Base de datos MongoDB con colección "users"
- ✅ Hash de contraseñas con bcrypt
- ✅ ABM completo de productos (nombre, tipo, user_id, fechas)
- ✅ Interfaz web con templates de Go
- ✅ JavaScript para manejo de eventos
- ✅ Almacenamiento de JWT en localStorage
- ✅ Validación de tokens en endpoints privados

## Requisitos

- Go 1.23 o superior
- MongoDB 4.0 o superior

## Instalación

1. **Clonar el repositorio:**
```bash
git clone <tu-repositorio>
cd fetch
```

2. **Instalar dependencias:**
```bash
go mod tidy
```

3. **Iniciar MongoDB:**
```bash
# En macOS con Homebrew
brew services start mongodb-community

# En Ubuntu/Debian
sudo systemctl start mongod

# En Windows
net start MongoDB
```

4. **Ejecutar la aplicación:**
```bash
go run main.go
```

La aplicación estará disponible en: http://localhost:8080

## Estructura del Proyecto

```
├── main.go                 # Punto de entrada de la aplicación
├── go.mod                  # Dependencias de Go
├── models/                 # Modelos de datos
│   ├── user.go            # Modelo de usuario
│   └── product.go         # Modelo de producto
├── database/              # Configuración de base de datos
│   └── mongodb.go         # Conexión a MongoDB
├── auth/                  # Autenticación
│   ├── jwt.go            # Manejo de JWT
│   └── password.go       # Hash de contraseñas
├── middleware/            # Middlewares
│   └── auth.go           # Middleware de autenticación
├── handlers/              # Controladores
│   ├── auth.go           # Handlers de autenticación
│   └── products.go       # Handlers de productos
├── routes/                # Configuración de rutas
│   └── routes.go         # Definición de rutas
├── templates/             # Templates HTML
│   ├── login.html        # Página de login
│   ├── register.html     # Página de registro
│   └── products.html     # Página de productos
└── static/               # Archivos estáticos
    └── js/               # JavaScript
        ├── login.js      # Lógica de login
        ├── register.js   # Lógica de registro
        └── products.js   # Lógica de productos
```

## API Endpoints

### Autenticación (Públicos)
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Productos (Privados - Requieren JWT)
- `GET /api/products` - Obtener productos del usuario
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Páginas Web
- `GET /` - Página de login
- `GET /login` - Página de login
- `GET /register` - Página de registro
- `GET /products` - Página de productos (requiere autenticación)

## Uso

1. **Registro:** Ve a http://localhost:8080/register y crea una cuenta
2. **Login:** Ve a http://localhost:8080/login e inicia sesión
3. **Productos:** Una vez autenticado, serás redirigido a la página de productos donde puedes:
   - Ver todos tus productos
   - Agregar nuevos productos
   - Editar productos existentes
   - Eliminar productos

## Base de Datos

La aplicación usa MongoDB con:
- **Base de datos:** `ejemplo`
- **Colección de usuarios:** `users`
- **Colección de productos:** `products`

### Estructura de Usuario
```json
{
  "_id": "ObjectId",
  "email": "usuario@ejemplo.com",
  "password": "hash_bcrypt",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Estructura de Producto
```json
{
  "_id": "ObjectId",
  "nombre": "Nombre del producto",
  "tipo": "Tipo del producto",
  "user_id": "ObjectId del usuario",
  "fecha_creacion": "timestamp",
  "fecha_ultima_actualizacion": "timestamp"
}
```

## Seguridad

- Las contraseñas se almacenan con hash bcrypt
- Los tokens JWT expiran en 24 horas
- Los endpoints privados validan el token JWT
- Los usuarios solo pueden acceder a sus propios productos

## Desarrollo

Para desarrollo, puedes usar:
```bash
# Modo debug de Gin
export GIN_MODE=debug
go run main.go
```

## Troubleshooting

**Error de conexión a MongoDB:**
- Verifica que MongoDB esté ejecutándose
- Verifica la URI de conexión en `database/mongodb.go`

**Error de dependencias:**
```bash
go mod tidy
go mod download
```

**Error de permisos:**
- Asegúrate de que el puerto 8080 esté disponible
- En algunos sistemas, puede necesitar permisos de administrador
