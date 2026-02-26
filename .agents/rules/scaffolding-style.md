---
trigger: always_on
---

📁 Regla General de Estructura de Carpetas

Toda nueva funcionalidad debe respetar estrictamente la siguiente organización modular y por capas.

La estructura no es opcional. No se permiten variaciones arbitrarias.

⸻

Dentro de Render:
1️⃣ Regla: Arquitectura Modular por Feature

Cada feature debe vivir dentro de modules/ como un módulo autosuficiente.

src/
│
├── modules/
│ ├── auth/
│ ├── payments/
│ └── profile/

✔ Obligatorio
• Cada módulo contiene su propia estructura interna.
• No se permite mezclar lógica entre módulos.
• No se permiten carpetas globales para lógica de negocio.

⸻

2️⃣ Regla: Estructura Interna Obligatoria del Módulo

Cada módulo debe contener exactamente tres capas:

module-name/
├── domain/
├── data/
└── presentation/

No se permiten dependencias cruzadas incorrectas entre capas.

⸻

3️⃣ Regla: Capa domain

Propósito

Contiene la lógica de negocio pura y los contratos del sistema.

Restricciones
• No puede depender de React Native.
• No puede depender de MobX.
• No puede depender de APIs.
• No puede depender de librerías externas.

Estructura obligatoria

domain/
├── models/ → Entidades del negocio
├── repositories/ → Interfaces (contratos)
└── usecases/ → Casos de uso

Principios
• Define reglas.
• Define contratos.
• No implementa infraestructura.

⸻

4️⃣ Regla: Capa data

Propósito

Implementa lo definido en domain.

Restricciones
• Puede depender de librerías externas.
• No puede contener reglas de negocio.
• No puede acceder a UI.

Estructura obligatoria

data/
├── api/ → Llamadas HTTP / SDKs
├── repositories/ → Implementaciones concretas
└── mappers/ → Conversión DTO ↔ dominio

Principios
• Implementa contratos del dominio.
• Traduce datos externos al modelo interno.
• Es infraestructura, no lógica de negocio.

⸻

5️⃣ Regla: Capa presentation (MVVM)

Propósito

Contiene UI y estado observable.

Restricciones
• Es la única capa que puede usar MobX.
• No puede acceder directamente a APIs.
• No puede contener lógica de negocio compleja.
• Solo interactúa mediante UseCases.

Estructura obligatoria

presentation/
├── screens/ → Pantallas
├── components/ → UI reutilizable
└── viewmodels/ → Estado + coordinación

Principios
• Screens renderizan.
• ViewModels coordinan.
• Components son presentacionales.

⸻

6️⃣ Regla: Carpeta shared

Contiene recursos reutilizables globales.

shared/
├── ui/ → Componentes genéricos
├── hooks/ → Hooks reutilizables
├── utils/ → Funciones puras
├── services/ → Servicios transversales (ej: HttpClient)
└── types/ → Tipos globales

Restricciones
• No debe contener lógica específica de un módulo.
• No debe contener reglas de negocio.

⸻

7️⃣ Regla: Punto de Entrada

index.tsx

    •	Solo inicializa la app.
    •	No contiene lógica de negocio.

⸻

8️⃣ Regla Fundamental de Dependencias

Las dependencias deben fluir únicamente en esta dirección:

presentation
↓
domain
↑
data (implementa domain)

Nunca:
• domain → presentation
• domain → data
• presentation → api
• presentation → repository implementation

⸻

9️⃣ Prohibiciones Estructurales

El agente no debe:
• Crear lógica de negocio en data.
• Crear llamadas HTTP en presentation.
• Crear ViewModels fuera de presentation.
• Crear UseCases fuera de domain.
• Crear repositorios concretos dentro de domain.
• Mezclar archivos de distintos módulos.

⸻

🔟 Principio Rector

Cada módulo debe ser:
• Autosuficiente
• Escalable
• Testeable
• Desacoplado
• Predecible en su organización

Toda generación de código debe respetar esta estructura sin excepciones.
