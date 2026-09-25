# Café Premium — tienda de café

Aplicación full-stack para consultar el catálogo de cafés y administrar el inventario. El frontend está desarrollado con Angular y Bootstrap 5; la API usa ASP.NET Core 10, Entity Framework Core y MySQL.

## Vistas

- **Comprador:** `/catalogo` — consulta y busca los cafés disponibles.
- **Administrador:** `/admin` — crea, consulta, edita y elimina cafés; consulta el inventario.
- **Login:** `/login` — pantalla inicial para una futura integración con Google.

La administración y el login todavía no tienen autenticación. Las órdenes de compra están reservadas para un módulo futuro; no se almacenan ni se procesan en esta versión.

## Tecnologías

| Componente | Tecnología |
|---|---|
| Interfaz | Angular 22, TypeScript, Bootstrap 5, Angular SSR |
| API | ASP.NET Core 10, controladores Web API |
| Acceso a datos | Entity Framework Core y proveedor MySQL |
| Base de datos | MySQL, `tienda_cafe`, tabla `cafe` |

## Requisitos

- .NET SDK 10.
- Node.js compatible con el proyecto y npm.
- MySQL local o accesible por red.
- MySQL Workbench (opcional) para ejecutar los scripts SQL.

## Puesta en marcha

### 1. Crear la base de datos

Ejecuta [`database/schema.sql`](database/schema.sql) en MySQL Workbench. Para poblar el catálogo con datos de demostración, ejecuta una sola vez [`database/demo-data.sql`](database/demo-data.sql).

### 2. Configurar y ejecutar la API

En PowerShell, configura la cadena de conexión en la sesión actual. Cambia `TU_CLAVE` por la contraseña local de MySQL:

```powershell
$env:ConnectionStrings__DefaultConnection = "Server=localhost;Database=tienda_cafe;User=root;Password=TU_CLAVE;SslMode=Disabled;AllowPublicKeyRetrieval=True;"
dotnet restore .\backend\API_CON_DB.slnx
dotnet run --project .\backend\API_CON_DB\API_CON_DB.csproj
```

La API escucha en `http://localhost:5031`. La cadena nunca debe escribirse en `appsettings.json` ni subirse a GitHub. También puedes copiar `backend/API_CON_DB/appsettings.example.json` como `appsettings.secrets.json`; ese archivo está excluido por `.gitignore`.

### 3. Ejecutar el frontend

Abre otra terminal en `frontend`:

```powershell
cd frontend
npm ci
npm start
```

Abre `http://localhost:4200/catalogo` o `http://localhost:4200/admin`. El frontend SSR compilado puede servirse con:

```powershell
npm run build
npm run serve:ssr:primer_proyecto
```

El servidor SSR usa `http://localhost:4000` por defecto. La API permite los orígenes locales `localhost` y `127.0.0.1` en los puertos `4000`, `4200` y `4201`.

### Ejecutar en Visual Studio

Abre `backend/API_CON_DB.slnx`, establece `API_CON_DB` como proyecto de inicio y ejecuta el perfil `http`. Visual Studio inicia la API; Angular se ejecuta aparte con `npm start`.

## Endpoints

Base URL: `http://localhost:5031/api`

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/cafe` | Listar cafés |
| `GET` | `/cafe/{id}` | Consultar un café |
| `POST` | `/cafe` | Crear un café |
| `PUT` | `/cafe/{id}` | Actualizar un café; el ID del cuerpo debe coincidir con la ruta |
| `DELETE` | `/cafe/{id}` | Eliminar un café |

La colección lista para importar está en [`postman/Cafe-Premium.postman_collection.json`](postman/Cafe-Premium.postman_collection.json). En Postman ejecuta las solicitudes en orden: el POST guarda el ID que se usa en GET, PUT y DELETE.

## Datos del café

El JSON usa los campos `cafe`, `especialidad`, `presentacion`, `origen`, `cantidad`, `valor` y `descripcion`. El ID se genera en MySQL. Cantidad debe ser un entero no negativo; valor debe ser un número no negativo. Descripción es opcional.

## Verificación

Para compilar la API y el frontend:

```powershell
dotnet build .\backend\API_CON_DB\API_CON_DB.csproj
cd frontend
npm ci
npm run build
npm test -- --watch=false
```

Consulta [`docs/DOCUMENTACION_PROYECTO.md`](docs/DOCUMENTACION_PROYECTO.md) para arquitectura, modelo de datos, validaciones, pruebas CRUD, Postman y solución de problemas.

## Alcance y próximos módulos

- El catálogo comprador y el CRUD de inventario usan la tabla `cafe` actual.
- El login con cuentas de Google aún es una pantalla de referencia.
- La autenticación/autorización del panel administrativo está pendiente.
- El módulo futuro de compras deberá incorporar entidades, tablas y endpoints de órdenes antes de habilitar compras desde la tienda.
