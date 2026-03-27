Yummy! 🥘 ✨
Yummy! es una aplicación web Full-Stack diseñada para gestionar recetas de cocina de forma personal, sencilla y, sobre todo, accesible. Este proyecto nace de la necesidad de tener un espacio digital propio donde guardar nuestras recetas, pero con un enfoque real en la usabilidad mientras cocinamos.

🚀 Características principales
Gestión Completa de Recetas (CRUD): Registro, consulta, edición y eliminación de platos de forma privada y segura.

Modo Lectura Inmersivo: Una interfaz diseñada para evitar distracciones, con textos grandes y claros, ideal para seguir los pasos con el móvil en la cocina.

Seguridad con JWT: Implementación de autenticación mediante JSON Web Tokens para proteger la privacidad de cada usuario.

Buscador y Filtros Dinámicos: Localización inmediata de recetas por título, ingredientes o categorías (Postres, Entrantes, etc.).

Experiencia de Usuario (UX): Feedback visual constante, estados de carga y una celebración con confeti al completar con éxito una receta.

🛠️ Stack Tecnológico
Backend:

Node.js & Express.js: Motor del servidor y gestión de rutas API.

MongoDB & Mongoose: Base de datos NoSQL para un almacenamiento flexible de los platos.

Bcryptjs & JWT: Seguridad en el cifrado de contraseñas y gestión de sesiones.

Frontend:

React.js: Biblioteca principal para una interfaz rápida y reactiva.

Axios: Gestión de todas las peticiones asíncronas hacia el servidor.

CSS3 Personalizado: Diseño Responsive total, adaptado a móviles, tablets y escritorio.

📦 Instalación y Configuración Local
Para poner en marcha el proyecto en tu máquina, sigue estos pasos:

1. Clonar el repositorio
Bash
git clone https://github.com/tu-usuario/yummy-proyecto.git
cd yummy-proyecto

2. Configurar el Backend
Bash
cd backend
npm install
Importante: Crea un archivo .env en la carpeta backend con las variables PORT, MONGODB_URI y JWT_SECRET.

Bash
npm run dev

3. Configurar el Frontend
Bash
cd ../frontend
npm install
npm start
La aplicación se abrirá en http://localhost:3000.

👓 Compromiso con la Accesibilidad
Uno de los pilares de Yummy! es no dejar a nadie fuera. El proyecto ha sido auditado con Lighthouse, obteniendo una puntuación de 92/100 en Accesibilidad.

Se han cuidado aspectos como:

Jerarquía semántica de etiquetas (H1, H2, labels).

Contrastes de color para facilitar la lectura.

Navegabilidad mediante teclado y compatibilidad con lectores de pantalla.

👩‍💻 Autora
Marina Maestre Sánchez Proyecto de Fin de Grado - 2º DAM (Desarrollo de Aplicaciones Multiplataforma)

Construido con dedicación para hacer la cocina un poco más fácil para todos.