#!/bin/bash

# Script para crear una nueva versión y release
# Uso: ./scripts/release.sh [major|minor|patch]

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./scripts/release.sh [major|minor|patch]"
    echo ""
    echo "Opciones:"
    echo "  major  - Incrementa la versión mayor (1.0.0 -> 2.0.0)"
    echo "  minor  - Incrementa la versión menor (1.0.0 -> 1.1.0)"
    echo "  patch  - Incrementa la versión de parche (1.0.0 -> 1.0.1)"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/release.sh patch"
    echo "  ./scripts/release.sh minor"
}

# Verificar que se proporcione el tipo de versión
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: Debes especificar el tipo de versión${NC}"
    show_help
    exit 1
fi

VERSION_TYPE=$1

# Verificar que el tipo de versión sea válido
if [[ "$VERSION_TYPE" != "major" && "$VERSION_TYPE" != "minor" && "$VERSION_TYPE" != "patch" ]]; then
    echo -e "${RED}Error: Tipo de versión inválido. Usa: major, minor, o patch${NC}"
    show_help
    exit 1
fi

# Verificar que estemos en la rama main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo -e "${RED}Error: Debes estar en la rama main para crear un release${NC}"
    echo "Rama actual: $current_branch"
    exit 1
fi

# Verificar que no haya cambios sin commitear
if ! git diff --quiet HEAD; then
    echo -e "${RED}Error: Hay cambios sin commitear. Commitea o stash los cambios antes de continuar${NC}"
    exit 1
fi

# Obtener la versión actual
current_version=$(node -p "require('./package.json').version")
echo -e "${YELLOW}Versión actual: $current_version${NC}"

# Incrementar la versión
echo -e "${YELLOW}Incrementando versión $VERSION_TYPE...${NC}"
npm version $VERSION_TYPE --no-git-tag-version

# Obtener la nueva versión
new_version=$(node -p "require('./package.json').version")
echo -e "${GREEN}Nueva versión: $new_version${NC}"

# Crear commit con la nueva versión
echo -e "${YELLOW}Creando commit de versión...${NC}"
git add package.json
git commit -m "chore: bump version to $new_version"

# Crear y push del tag
tag_name="v$new_version"
echo -e "${YELLOW}Creando tag $tag_name...${NC}"
git tag -a "$tag_name" -m "Release $new_version"

echo -e "${YELLOW}Pushing cambios y tag...${NC}"
git push origin main
git push origin "$tag_name"

echo -e "${GREEN}✅ Release creado exitosamente!${NC}"
echo -e "${GREEN}Tag: $tag_name${NC}"
echo -e "${GREEN}El workflow de GitHub Actions se ejecutará automáticamente para construir y publicar el release.${NC}"
echo -e "${GREEN}Puedes seguir el progreso en: https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')/actions${NC}"