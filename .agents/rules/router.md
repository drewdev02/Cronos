---
trigger: always_on
---

🧭 Regla para el Uso de Wouter

(Estándar Obligatorio de Enrutamiento — Uso Exclusivo de Wouter)

Todo el enrutamiento del cliente debe implementarse exclusivamente con Wouter.
No se permite el uso de otras librerías de routing.

⸻

1️⃣ Regla: Wouter es la Única Librería de Routing

❌ Prohibido
• React Router
• Sistemas de routing personalizados
• Manipular window.location manualmente
• Navegación imperativa fuera del sistema de Wouter

✔ Obligatorio

Se deben usar únicamente:
• Route
• Switch
• Link
• useLocation
• useRoute
• useParams

⸻

2️⃣ Regla: Definición Centralizada de Rutas

Las rutas deben definirse en un único módulo dentro de render.

src/
│ └── router/
│ ├── AppRouter.tsx
│ └── routes.ts

No se permite definir rutas dispersas en múltiples archivos sin estructura clara.

⸻

3️⃣ Regla: Patrón Obligatorio del Router

import { Route, Switch } from "wouter";

export function AppRouter() {
return (
<Switch>
<Route path="/" component={HomeScreen} />
<Route path="/login" component={LoginScreen} />
<Route path="/profile/:id" component={ProfileScreen} />
</Switch>
);
}

Las rutas deben renderizar Screens, no componentes sueltos.

⸻

4️⃣ Regla: Navegación con useLocation

La navegación programática debe realizarse únicamente con useLocation.

Correcto:

import { useLocation } from "wouter";

const [, navigate] = useLocation();

navigate("/login");

Incorrecto:

window.location.href = "/login"; // ❌

⸻

5️⃣ Regla: Uso Obligatorio de <Link>

Correcto:

import { Link } from "wouter";

<Link href="/login">Login</Link>

Incorrecto:

<a href="/login">Login</a> // ❌

⸻

6️⃣ Regla: Parámetros con useParams

Correcto:

import { useParams } from "wouter";

const { id } = useParams<{ id: string }>();

No se permite parsear la URL manualmente.

⸻

7️⃣ Regla: Las Screens Son el Punto de Entrada

Flujo obligatorio:

Route
↓
Screen (observer)
↓
ViewModel

    •	Las rutas renderizan Screens.
    •	Las Screens conectan con ViewModels.
    •	No debe existir lógica de negocio en el router.

⸻

8️⃣ Regla: El ViewModel No Depende de Wouter

El ViewModel no debe importar nada de Wouter.

Si se requiere navegación tras una acción:

Correcto:

vm.login().then(() => navigate("/dashboard"));

Incorrecto:

import { useLocation } from "wouter"; // ❌ dentro del ViewModel

La navegación se ejecuta desde la Screen.

⸻

9️⃣ Regla: Constantes de Rutas

Todas las rutas deben declararse como constantes.

export const ROUTES = {
HOME: "/",
LOGIN: "/login",
PROFILE: (id: string) => `/profile/${id}`,
};

Uso obligatorio:

navigate(ROUTES.LOGIN);

No se permiten strings hardcodeados en los componentes.

⸻

🔟 Regla: Simplicidad del Enrutamiento
• Evitar routers anidados innecesarios.
• Mantener la estructura clara y predecible.
• El routing es estructural, no lógico.

⸻

🎯 Principio Rector

Wouter maneja la navegación.
Las Screens renderizan.
Los ViewModels gestionan estado.
La lógica de negocio nunca depende del sistema de routing.

Todo código de enrutamiento generado debe adherirse estrictamente a estas reglas.
