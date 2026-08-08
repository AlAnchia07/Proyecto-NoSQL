# BiteUp

BiteUp es una aplicación web orientada a la gestión y aprovechamiento de excedentes alimentarios. La plataforma permite conectar establecimientos de comida con consumidores para facilitar la comercialización de productos que aún son aptos para el consumo y contribuir a la reducción del desperdicio de alimentos.

El proyecto está compuesto por un frontend y un backend, ubicados en carpetas separadas dentro del mismo repositorio.

## Estructura del proyecto

```text
BiteUp/
├── backend/
└── frontend/
```

## Requisitos

Para ejecutar el proyecto se necesita:

* Node.js
* npm
* Acceso a Internet para establecer la conexión con MongoDB Atlas.

No es necesario instalar MongoDB localmente, ya que el sistema utiliza MongoDB Atlas.

## Base de datos

El sistema utiliza **MongoDB Atlas** como servicio de base de datos. La conexión se encuentra configurada en:

```text
backend/db.js
```

La base de datos utilizada por el sistema se denomina **BiteUp**.

El proyecto está configurado para conectarse a la instancia de MongoDB Atlas definida en `db.js`, por lo que, en condiciones normales, no es necesario realizar configuraciones adicionales de base de datos para ejecutar el sistema.

Si se desea utilizar una instancia local de MongoDB, se puede modificar la cadena de conexión definida en `backend/db.js` para apuntar a la instancia local correspondiente.

La base de datos contempla las siguientes colecciones principales:

* Usuarios
* Clientes
* Restaurantes
* Categorías
* Productos
* Pedidos
* Notificaciones
* Reseñas

## Instalación

### Backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

### Frontend

En otra terminal, ingresar a la carpeta del frontend:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

El backend y el frontend deben ejecutarse de manera independiente.

### Backend

Desde la carpeta `backend`:

```bash
npm run dev
```

### Frontend

Desde la carpeta `frontend`:

```bash
npm run dev
```

Una vez iniciados ambos servicios, el frontend mostrará en la terminal la dirección local desde la cual se puede acceder a la aplicación.

## Tecnologías utilizadas

* **Frontend:** aplicación web desarrollada con tecnologías web.
* **Backend:** Node.js.
* **Base de datos:** MongoDB Atlas.
* **Base de datos NoSQL:** MongoDB.

## Consideraciones

La conexión a MongoDB se encuentra definida en `backend/db.js`. Si se modifica la configuración de la base de datos, se debe verificar que la instancia utilizada contenga las colecciones y datos necesarios para el funcionamiento de la aplicación.

Para ejecutar correctamente el sistema, tanto el backend como el frontend deben permanecer activos simultáneamente.
