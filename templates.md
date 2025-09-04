# Sistema de Templates - Documentación

## Introducción

Esta aplicación utiliza un sistema de templates basado en Go templates que permite crear páginas web dinámicas con una estructura modular y reutilizable. El sistema está diseñado para separar la lógica de presentación del código backend, facilitando el mantenimiento y la escalabilidad.

## Arquitectura del Sistema de Templates

### Estructura de Archivos

```
templates/
├── layout.html      # Template base que contiene la estructura HTML común
├── header.html      # Componente de navegación reutilizable
├── index.html       # Página de inicio
├── login.html       # Página de inicio de sesión
├── register.html    # Página de registro
└── products.html    # Página de gestión de productos
```

### Flujo de Renderizado

1. **Handler** → Recibe la petición HTTP
2. **TemplateName** → Se pasa como variable al template
3. **Layout Template** → Se ejecuta como template principal
4. **Content Templates** → Se incluyen dinámicamente según el TemplateName
5. **Component Templates** → Se incluyen como componentes reutilizables

## Componentes del Sistema

### 1. Template Base (layout.html)

El archivo `layout.html` actúa como el template principal que define la estructura HTML común de toda la aplicación.

**Características principales:**
- Define la estructura HTML5 básica
- Incluye Bootstrap 5 y Bootstrap Icons
- Carga CSS personalizado
- Incluye el header de navegación
- Maneja la carga dinámica de contenido
- Gestiona la carga de scripts específicos por página

**Estructura:**
```html
{{define "layout"}}
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta tags, CSS, etc. -->
</head>
<body>
    {{template "header" .}}  <!-- Incluye el header -->
    <main class="container-fluid">
        <!-- Lógica condicional para cargar contenido -->
        {{if .TemplateName}}
            {{if eq .TemplateName "login"}}
                {{template "login-content" .}}
            {{else if eq .TemplateName "register"}}
                {{template "register-content" .}}
            <!-- ... más condiciones ... -->
        {{end}}
    </main>
    <!-- Scripts -->
</body>
</html>
{{end}}
```

### 2. Header Component (header.html)

Componente reutilizable que contiene la navegación de la aplicación.

**Características:**
- Navbar responsivo con Bootstrap 5
- Brand/logo de la aplicación
- Menú colapsable para dispositivos móviles
- Sección de autenticación dinámica (manejada por JavaScript)
- Alineación correcta a la derecha con `ms-auto`

**Estructura:**
```html
{{define "header"}}
<header class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Gestión de Productos</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto" id="authSection">
                <!-- Contenido dinámico manejado por JavaScript -->
            </ul>
        </div>
    </div>
</header>
{{end}}
```

### 3. Templates de Páginas

Cada página sigue un patrón consistente:

#### Estructura Común:
```html
{{template "layout" .}}                    <!-- Extiende el layout base -->

{{define "title"}}Título de la Página{{end}} <!-- Define el título específico -->

{{define "nombre-content"}}                <!-- Define el contenido principal -->
<!-- HTML del contenido -->
{{end}}

{{define "scripts-nombre"}}                <!-- Define scripts específicos -->
<!-- Scripts de la página -->
{{end}}
```

#### Páginas Disponibles:

**index.html** - Página de inicio
- Muestra bienvenida a usuarios no autenticados
- Botones para login y registro
- Diseño centrado y atractivo

**login.html** - Página de inicio de sesión
- Formulario de autenticación
- Validación de campos
- Enlace a página de registro
- Manejo de mensajes de error/éxito

**register.html** - Página de registro
- Formulario de creación de cuenta
- Validación de contraseñas
- Enlace a página de login
- Validación de confirmación de contraseña

**products.html** - Página de gestión de productos
- Formulario para agregar/editar productos
- Lista dinámica de productos
- Funcionalidad de edición inline
- Botones de acción (editar, eliminar)

## Sistema de Rutas y Templates

### Configuración de Rutas (routes/routes.go)

Las rutas están organizadas en grupos lógicos:

```go
func SetupRoutes(r *gin.Engine) {
    // Páginas públicas HTML
    r.GET("/", handlers.IndexPage)
    r.GET("/login", handlers.LoginPage)
    r.GET("/register", handlers.RegisterPage)
    r.GET("/products", handlers.ProductsPage)
    
    // API pública
    api := r.Group("/api")
    {
        api.POST("/auth/register", handlers.Register)
        api.POST("/auth/login", handlers.Login)
    }
    
    // API privada (requiere autenticación)
    apiPrivate := r.Group("/api")
    apiPrivate.Use(middleware.AuthMiddleware())
    {
        apiPrivate.GET("/products", handlers.GetProducts)
        apiPrivate.POST("/products", handlers.CreateProduct)
        apiPrivate.PUT("/products/:id", handlers.UpdateProduct)
        apiPrivate.DELETE("/products/:id", handlers.DeleteProduct)
    }
}
```

### Handlers de Páginas (handlers/pages.go)

Cada handler de página sigue el mismo patrón:

```go
func NombrePage(c *gin.Context) {
    c.HTML(200, "layout", gin.H{
        "TemplateName": "nombre",
    })
}
```

**Explicación:**
- `c.HTML(200, "layout", ...)` → Renderiza el template "layout"
- `"TemplateName": "nombre"` → Pasa la variable que determina qué contenido cargar
- El template layout usa esta variable para decidir qué template de contenido incluir

## Flujo de Renderizado Detallado

### 1. Petición HTTP
```
GET /login → handlers.LoginPage()
```

### 2. Handler
```go
func LoginPage(c *gin.Context) {
    c.HTML(200, "layout", gin.H{
        "TemplateName": "login",
    })
}
```

### 3. Renderizado del Template
1. Se ejecuta `layout.html` como template principal
2. Se incluye `header.html` con `{{template "header" .}}`
3. Se evalúa la condición `{{if eq .TemplateName "login"}}`
4. Se incluye `login-content` con `{{template "login-content" .}}`
5. Se incluyen scripts con `{{template "scripts-login" .}}`

### 4. Resultado Final
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <title>Iniciar Sesión - Ejemplo Web</title>
    <!-- CSS -->
</head>
<body>
    <!-- Header con navegación -->
    <main>
        <!-- Contenido de login -->
    </main>
    <!-- Scripts -->
</body>
</html>
```

## Variables y Datos en Templates

### Variables Disponibles
- `.TemplateName` → Nombre del template actual
- `.` → Contexto completo de Gin (puede incluir datos adicionales)

### Uso de Variables
```html
{{define "title"}}{{.TemplateName}} - Ejemplo Web{{end}}
```

## Ventajas del Sistema

### 1. Modularidad
- Cada componente tiene una responsabilidad específica
- Fácil reutilización de componentes
- Separación clara entre layout, header y contenido

### 2. Mantenibilidad
- Cambios en el layout se aplican a todas las páginas
- Modificaciones en el header se reflejan globalmente
- Estructura consistente en todas las páginas

### 3. Escalabilidad
- Fácil agregar nuevas páginas siguiendo el patrón establecido
- Sistema de scripts específicos por página
- Organización clara de archivos

### 4. Responsive Design
- Bootstrap 5 integrado
- Navegación responsiva
- Diseño mobile-first

## Mejores Prácticas

### 1. Nomenclatura
- Templates de contenido: `nombre-content`
- Templates de scripts: `scripts-nombre`
- Variables consistentes: `TemplateName`

### 2. Estructura
- Siempre extender `layout.html`
- Definir título específico para cada página
- Separar contenido y scripts

### 3. Reutilización
- Usar componentes como `header.html`
- Aprovechar las variables de template
- Mantener consistencia en el diseño

## Ejemplo de Nueva Página

Para agregar una nueva página (ej: "about"):

### 1. Crear about.html
```html
{{template "layout" .}}

{{define "title"}}Acerca de - Ejemplo Web{{end}}

{{define "about-content"}}
<div class="container">
    <h1>Acerca de la Aplicación</h1>
    <p>Contenido de la página...</p>
</div>
{{end}}

{{define "scripts-about"}}
<script src="/static/js/about.js"></script>
{{end}}
```

### 2. Agregar Handler
```go
func AboutPage(c *gin.Context) {
    c.HTML(200, "layout", gin.H{
        "TemplateName": "about",
    })
}
```

### 3. Agregar Ruta
```go
r.GET("/about", handlers.AboutPage)
```

### 4. Actualizar layout.html
```html
{{else if eq .TemplateName "about"}}
    {{template "about-content" .}}
```

Este sistema proporciona una base sólida y escalable para el desarrollo de aplicaciones web con Go y templates HTML.
