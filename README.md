Candidato Nicolás Roa

Documentacion completa


Documentación Proyecto Frontend

📑 Resumen General
Este frontend es un proyecto desarrollado en Angular Standalone + Material Design, siguiendo principios de Arquitectura Limpia adaptados a frontend:
* Separación de responsabilidades: servicios, componentes, módulos core/shared.
* Inyección de dependencias usando inject().
* Interceptors para la autenticación.
* Observadores (RxJS) para la gestión reactiva del estado (por ejemplo BehaviorSubject para las tareas).
Utiliza:
* Angular 17+
* Angular Material
* RXJS 7+

📋 Estructura de Carpetas y Descripción de Archivos
src/
➜ app/
Archivo: app.routes.ts
* Define las rutas principales: /login, /tasks.
* Controla la navegación de las vistas principales.

➜ core/
Contiene los servicios y modelos principales del sistema.
core/models/
Archivo: task.dto.ts
* Define la interfaz Task (estructura de datos de las tareas).
Archivo: login-request.dto.ts
* Define el formato del login email que se enviará al backend.
Archivo: login-response.dto.ts
* Define la respuesta de login: credentials, accessToken, refreshToken.
core/services/auth/
Archivo: auth.service.ts
* Maneja todo lo relacionado con autenticación:
    * login, register, refreshToken, logout.
    * Gestión de access-token y refresh-token en localStorage.
* Expone métodos como getAccessToken(), isLoggedIn(), etc.
* Observadores utilizados: No tiene un observable directo, pero maneja estado mediante almacenamiento persistente (localStorage).
core/services/task/
Archivo: task.service.ts
* Maneja la comunicación con el backend para:
    * Crear tareas
    * Obtener tareas
    * Actualizar tareas
    * Eliminar tareas
* Gestión reactiva de la lista de tareas con BehaviorSubject (tasks$).
Observadores utilizados:
* BehaviorSubject<Task[]>: maneja el estado reactivo de la lista de tareas.
* Expuesto como tasks$ para suscripción automática en templates con async pipe.
core/interceptors/
Archivo: auth.interceptor.ts
* Intercepta todas las peticiones HTTP.
* Agrega el Authorization: Bearer token.
* Detecta errores 401 para intentar refrescar el access token automáticamente usando refreshTokens().
* Observadores utilizados:
    * Uso de from() y switchMap() para convertir Promise en Observable y manejar flujos asincrónicos.

➜ shared/
Componentes reutilizables en toda la aplicación.
shared/components/dialog/confirm/
Archivo: confirm-dialog.component.ts
* Diálogo de confirmación cuando el usuario intenta crear una nueva cuenta si no existe.
* Pregunta: "¡Deseas crear el usuario?"
* Observadores utilizados:
    * afterClosed(): Observable que emite el valor de la decisión del usuario.

➜ pages/
Páginas principales.
pages/login/
Archivo: login.component.ts
* Formulario de login.
* Maneja login o registro dependiendo si el usuario existe.
* Usa MatDialog para confirmaciones.
* Redirige a /tasks al iniciar sesión correctamente.
* Observadores utilizados:
    * firstValueFrom() convierte el afterClosed() del dialogo en una promesa para manejo sencillo.
Archivo: login.component.html
* Formulario simple: input email + botón login.
Archivo: login.component.scss
* Estilos para el formulario de login.
pages/task/
Archivo: task-form.component.ts
* Formulario para crear o editar tareas.
* Maneja tanto la creación como la edición dependiendo si hay tarea seleccionada.
Archivo: task-form.component.html
* Formulario con title, description y completed usando Angular Material.
Archivo: task-form.component.scss
* Estilos para el form de tareas.
Archivo: task-list.component.ts
* Lista de tareas.
* Permite editar, eliminar o marcar tareas como completadas.
* Usa tasks$ | async para reactividad.
* Controla carga individual (spinner en la tarjeta editada).
Archivo: task-list.component.html
* Renderiza las tarjetas de tareas con mat-card, mat-checkbox, botones de acciones.
Archivo: task-list.component.scss
* Estilos para la lista de tareas y cards.
Archivo: task-page.component.ts
* Página que une el TaskForm (izquierda) + TaskList (derecha) en layout flex.
Archivo: task-page.component.html
* Contiene los 2 componentes lado a lado.
Archivo: task-page.component.scss
* Estilos para dividir el layout 50%-50%.

🔬 Arquitectura Limpia Aplicada
* Core: Todo lo que es fundamental para el proyecto (models, services, interceptors) está en /core/.
* Shared: Componentes reusables y genéricos (ej: ConfirmDialog).
* Pages: Cada feature grande tiene su página separada (LoginPage, TaskPage).
* Reactive programming:
    * BehaviorSubject para lista de tareas (tasks$).
    * async pipe en templates para suscribirse automáticamente.
    * afterClosed() observable para confirmar acciones.
    * switchMap, catchError, from en interceptores para manejar flujos de errores y refresh tokens.
* Interceptors:
    * authInterceptor para manejo de tokens automático en cada request.
    * Refresh automático si el token expira.
* Http First Value Pattern:
    * firstValueFrom en servicios para tratar Observable como Promise.
* Error Handling:
    * Catching global 401 para logout seguro.
    * Snackbar amigables en errores.

📊 Tecnologías Principales
Tecnología	Uso
Angular 17+	Framework base
Angular Material	UI components
RxJS	Programación reactiva
Standalone Components	Angular sin módulos clásicos
JWT Authentication	Manejo de login/refresh
📝 Instalación y Ejecución
# Instalar dependencias
npm install

# Levantar el proyecto
npm run dev
