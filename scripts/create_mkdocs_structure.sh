#!/bin/bash
# filepath: scripts/crear_docs.sh

# Ir a la raíz del proyecto (asumiendo que scripts/ está en la raíz)
cd "$(dirname "$0")/.."

# Crear carpetas si no existen
mkdir -p docs/api
mkdir -p docs/ejemplos

# Crear archivos solo si no existen
touch docs/index.md
touch docs/instalacion.md
touch docs/guia-uso.md
touch docs/api/endpoints.md
touch docs/api/modelos.md
touch docs/ejemplos/basico.md
touch docs/ejemplos/avanzado.md

echo "Estructura de documentación creada o actualizada."