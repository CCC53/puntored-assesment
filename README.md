# puntored FrontEnd Assesment

## Descripción del Proyecto
Este proyecto es un sistema de gestión de pagos desarrollado con Next.js y TypeScript. Permite a los usuarios realizar las siguientes operaciones:

- Generar nuevos pagos
- Buscar pagos existentes por referencia o descripción
- Filtrar pagos por fecha de creación, fecha de pago y estado
- Cancelar pagos
- Exportar datos a Excel
- Visualizar detalles de pagos
- Paginación de resultados

El sistema utiliza una arquitectura moderna con:
- Next.js 15 para el frontend
- Redux Toolkit para el manejo del estado
- Material-UI para la interfaz de usuario
- TypeScript para type safety
- Moment.js para el manejo de fechas
- XLSX para la exportación a Excel
- Jest para pruebas unitarias

## Pasos para Configurar y Ejecutar el Proyecto

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm

### Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd puntored-assesment
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir el navegador:
El proyecto estará disponible en `http://localhost:3000`

### Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run test` - Ejecuta las pruebas unitarias con Jest
- `npm run test:watch` - Ejecuta las pruebas en modo watch
- `npm run test:coverage` - Genera reporte de cobertura de pruebas

### Estructura del Proyecto

```
src/
├── app/
│   ├── api/           # Servicios y configuraciones de API
│   ├── components/    # Componentes reutilizables
│   ├── dashboard/     # Página principal del dashboard
│   ├── redux/         # Estado global con Redux
│   ├── types/         # Definiciones de tipos TypeScript
│   └── utils/         # Utilidades y helpers
├── __tests__/        # Directorio de pruebas unitarias de componentes
├── public/            # Archivos estáticos
```

### Características Principales

- **Búsqueda en Tiempo Real**: Filtrado instantáneo de pagos por referencia o descripción
- **Filtros Avanzados**: Filtrado por fechas y estados
- **Paginación**: Navegación eficiente a través de grandes conjuntos de datos
- **Exportación**: Exportación de datos a Excel
- **Gestión de Pagos**: Creación y cancelación de pagos
- **Interfaz Responsiva**: Diseño adaptable a diferentes tamaños de pantalla
- **Pruebas Unitarias**: Cobertura completa de pruebas con Jest

### Tecnologías Utilizadas

- Next.js 15
- TypeScript
- Redux Toolkit
- Material-UI
- Moment.js
- XLSX
- React Query (para manejo de estado del servidor)
- Jest (para pruebas unitarias)

### Pruebas Unitarias
Para ejecutar las pruebas:
```bash
# Ejecutar todas las pruebas
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Generar reporte de cobertura
npm run test:coverage
```
