# CALP VideoGames 🎮

Tienda en línea de videojuegos digitales con catálogo por plataforma, carrito de compras en tiempo real, búsqueda con autocompletado y sistema de registro de usuarios.

Nota: El sistema de registro de usuarios requiere XAMPP para funcionar localmente. Sin embargo, puedes explorar el catálogo completo, el carrito de compras y todas las secciones directamente desde el navegador sin instalar nada.
[🌐 Ver sitio en vivo] (https://uminogit.github.io/SItio-web-de-venta-de-juegos/)

---

## ✨ Características

- 🛒 **Carrito dinámico** — dropdown desplegable con total en tiempo real y contador de artículos
- 🔍 **Búsqueda con autocompletado** — sugerencias mientras escribes
- 🎠 **Carrusel de promociones** — navegación automática con transiciones suaves
- 👤 **Registro de usuarios** — formulario conectado a base de datos MySQL
- 🎨 **Tema único por plataforma** — cada sección tiene su identidad visual propia
- 📱 **Responsive** — diseño adaptable a cualquier dispositivo

---

## 🕹️ Plataformas

| Plataforma | Tema visual | Títulos destacados |
|---|---|---|
| PlayStation 5 | Azul `#00439C` | God of War Ragnarök, Spider-Man 2, The Last of Us |
| Xbox Series X\|S | Verde `#107C10` | Forza Horizon 5, Halo Infinite, Starfield |
| Nintendo Switch | Rojo `#E60012` | Zelda: Tears of the Kingdom, Super Mario Bros. Wonder |
| PC / Steam | Oscuro `#171A21` | Cyberpunk 2077, Elden Ring, Baldur's Gate 3 |

---

## 🛠️ Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript Vanilla |
| Backend | PHP 8.2 |
| Base de datos | MySQL / MariaDB 10.4 |
| Servidor local | XAMPP |
| Control de versiones | Git + GitHub |

---

## 🗄️ Base de datos

La base de datos `electronics` incluye:
- `datos` — registro de usuarios (nombre, correo, teléfono)
- `compras` — historial de transacciones

---

## 🚀 Instalación

### Requisitos
- XAMPP con PHP 8.2+ y MySQL

### Pasos

1. Clona el repositorio
```bash
git clone https://github.com/uminoGit/Sitio-web-de-venta-de-juegos.git
```

2. Copia la carpeta a `htdocs` de XAMPP
```bash
cp -r Sitio-web-de-venta-de-juegos /xampp/htdocs/
```

3. Importa la base de datos
- Abre phpMyAdmin en `http://localhost/phpmyadmin`
- Crea una base de datos llamada `electronics`
- Importa el archivo `electronics.sql` incluido en el repo

4. Abre el proyecto en tu navegador
```
http://localhost/Sitio-web-de-venta-de-juegos
```

---

## 📁 Estructura del proyecto

```
├── index.html          # Página principal
├── playstation.html    # Catálogo PlayStation
├── xbox.html           # Catálogo Xbox
├── nintendo.html       # Catálogo Nintendo
├── pc.html             # Catálogo PC
├── mandos.html         # Sección de mandos
├── Contacto.html       # Página de contacto
├── index.php           # Formulario de registro
├── styles.css          # Estilos globales
├── script.js           # Lógica del carrito y carrusel
├── stock-manager.js    # Gestión de inventario
└── electronics.sql     # Estructura de la base de datos
```

---

## 👤 Autor

**uminoGit** — [GitHub](https://github.com/uminoGit)
