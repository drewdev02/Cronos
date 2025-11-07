#!/bin/bash

# Script para preparar un pre-release desde develop
# Uso: ./scripts/pre-release.sh

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Preparando pre-release desde develop...${NC}"

# Verificar que estemos en la rama develop
current_branch=$(git branch --show-current)
if [ "$current_branch" != "develop" ]; then
    echo -e "${RED}Error: Debes estar en la rama develop para crear un pre-release${NC}"
    echo "Rama actual: $current_branch"
    exit 1
fi

# Verificar que no haya cambios sin commitear
if ! git diff --quiet HEAD; then
    echo -e "${RED}Error: Hay cambios sin commitear. Commitea o stash los cambios antes de continuar${NC}"
    exit 1
fi

# Push de la rama develop para disparar el workflow
echo -e "${YELLOW}Pushing rama develop...${NC}"
git push origin develop

echo -e "${GREEN}✅ Pre-release disparado exitosamente!${NC}"
echo -e "${GREEN}El workflow de GitHub Actions se ejecutará automáticamente para construir y publicar el pre-release.${NC}"
echo -e "${GREEN}Puedes seguir el progreso en: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions${NC}"