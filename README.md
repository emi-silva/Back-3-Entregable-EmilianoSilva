# Backend 3 Entregable

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Instala MongoDB y asegúrate de que esté corriendo en `mongodb://localhost:27017/back3`.
4. El servidor se ejecuta en el puerto 8080 por defecto.

## Ejecución

```bash
npm start
```
Esto abrirá automáticamente el navegador en `http://localhost:8080`.

## Endpoints principales


**Frontend:**
  - `GET /` → Vista moderna en navegador (`http://localhost:8080/`)

**API:**
  - `GET /api/mocks/mockingpets` → Endpoint migrado
  - `GET /api/mocks/mockingusers` → Genera 50 usuarios mock
  - `POST /api/mocks/generateData` → Genera e inserta usuarios y mascotas (body: `{ "users": 10, "pets": 5 }`)
  - `GET /api/users` → Lista todos los usuarios
  - `GET /api/pets` → Lista todas las mascotas

## Mejoras implementadas

- Validación de parámetros en `/generateData`.
- Mensajes de error claros y descriptivos.
- Frontend moderno con Bootstrap.
- Código modular y organizado.

## Pruebas
Usar Postman, Insomnia o el navegador para probar los endpoints en `http://localhost:8080`.


