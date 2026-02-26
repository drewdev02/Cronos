---
trigger: always_on
---

📦 Regla General para Importaciones

(Obligatoria para el Agente — Uso Exclusivo de Alias @)

Todas las importaciones internas del proyecto deben realizarse utilizando alias absolutos.

No se permiten rutas relativas profundas.

⸻

1️⃣ Configuración Base Obligatoria

El proyecto define el siguiente alias:

{
"paths": {
"@/_": ["src/renderer/src/_"]
}
}

Esto significa que:

@ = src/renderer/src

⸻

2️⃣ Regla: Prohibido Usar Rutas Relativas Complejas

❌ Incorrecto

import { LoginViewModel } from "../../../modules/auth/presentation/viewmodels/LoginViewModel";
import { Button } from "../../../../shared/ui/Button";

✔ Correcto

import { LoginViewModel } from "@/modules/auth/presentation/viewmodels/LoginViewModel";
import { Button } from "@/shared/ui/Button";

⸻

3️⃣ Regla: Todas las Importaciones Internas Usan @

Aplica para:
• modules
• shared
• core
• hooks
• services
• utils
• types
• assets internos

Ejemplos obligatorios:

import { AuthRepository } from "@/modules/auth/domain/repositories/AuthRepository";
import { LoginUseCase } from "@/modules/auth/domain/usecases/LoginUseCase";
import { HttpClient } from "@/shared/services/HttpClient";
import { container } from "@/core/di/container";

⸻

4️⃣ Regla: Rutas Relativas Solo para el Mismo Directorio

Únicamente se permite ./ cuando el archivo está en la misma carpeta.

✔ Permitido:

import { AuthMapper } from "./AuthMapper";

❌ No permitido:

import { AuthMapper } from "../mappers/AuthMapper";

En ese caso debe usarse:

import { AuthMapper } from "@/modules/auth/data/mappers/AuthMapper";

⸻

5️⃣ Regla: Orden de Importaciones

El orden debe ser consistente: 1. Librerías externas 2. Alias internos (@) 3. Importaciones locales (./)

Ejemplo:

import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";

import { LoginViewModel } from "@/modules/auth/presentation/viewmodels/LoginViewModel";
import { Button } from "@/shared/ui/Button";

import { styles } from "./styles";

⸻

6️⃣ Beneficios Obligatorios del Alias

El uso del alias garantiza:
• Refactors seguros
• Independencia de profundidad de carpetas
• Código más legible
• Menor fragilidad estructural
• Consistencia en todo el proyecto

⸻

7️⃣ Prohibiciones Absolutas

El agente no debe:
• Generar rutas con ../../..
• Mezclar alias y rutas relativas en el mismo nivel
• Importar cruzando módulos con rutas relativas
• Hardcodear paths dependientes de estructura frágil

⸻

🎯 Principio Rector

Todas las importaciones internas deben ser absolutas y comenzar con @.

Las rutas relativas solo se permiten dentro del mismo directorio.

No hay excepciones.
