#!/bin/bash
# filepath: scripts/crear_estructura_api.sh

# Ir a la raíz del proyecto
cd "$(dirname "$0")/.."

# Crear carpetas
mkdir -p src/api
mkdir -p src/utils
mkdir -p scripts

# Crear archivos si no existen
touch src/api/__init__.py
touch src/api/youtube_client.py
touch src/api/models.py
touch src/api/main.py
touch src/utils/csv_utils.py
touch scripts/fetch_comments.py

echo "Estructura de API creada o actualizada."