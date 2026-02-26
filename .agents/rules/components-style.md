---
trigger: always_on
---

⚛️ Regla General para Componentes React

(Obligatoria para el Agente — React + MobX, sin estado de React)

Todos los componentes deben respetar estrictamente el patrón:
• MVVM
• Estado gestionado exclusivamente con MobX
• Componentes funcionales
• Sin useState, useReducer, useContext
• Sin lógica de negocio en UI

⸻

1️⃣ Regla: React No Gestiona Estado

❌ Prohibido
• useState
• useReducer
• useContext para estado global
• Lógica de negocio dentro del componente
• Manejo manual de sincronización

✔ Obligatorio
• El estado vive únicamente en ViewModels (MobX).
• El componente solo observa y renderiza.

⸻

2️⃣ Regla: Todos los Componentes que Consumen Estado Deben ser observer

Si el componente consume propiedades observables, debe estar envuelto en observer.

import { observer } from "mobx-react-lite";

export const LoginScreen = observer(() => {
const vm = useInjection(LoginViewModel);

return (
<LoginForm
      email={vm.email}
      loading={vm.loading}
      onSubmit={vm.login}
    />
);
});

⸻

3️⃣ Regla: Separación por Tipo de Componente

Los componentes deben dividirse en:

presentation/
├── screens/ → Conectan con ViewModel
├── components/ → UI pura (sin estado)
└── layouts/ → Estructura visual

⸻

4️⃣ Regla: Screens = Punto de Conexión con el ViewModel

Las Screens:
• Obtienen el ViewModel vía DI.
• No crean estado.
• No instancian dependencias.
• Solo conectan UI con el VM.

export const LoginScreen = observer(() => {
const vm = useInjection(LoginViewModel);

return (
<LoginForm
      email={vm.email}
      loading={vm.loading}
      onSubmit={vm.login}
    />
);
});

⸻

5️⃣ Regla: Componentes Presentacionales Son Puros

Deben ser:
• Funciones puras
• Controlados por props
• Sin acceso a MobX directamente
• Sin acceso a DI

type LoginFormProps = {
email: string;
loading: boolean;
onSubmit: () => void;
};

export function LoginForm({
email,
loading,
onSubmit,
}: LoginFormProps) {
return (

<form className="space-y-4">
<Input value={email} />
<Button disabled={loading} onClick={onSubmit}>
{loading ? "Loading..." : "Login"}
</Button>
</form>
);
}

⸻

6️⃣ Regla: Eventos Siempre Delegan al ViewModel

Nunca se define lógica en el componente.

Correcto:

onClick={vm.login}

Incorrecto:

onClick={() => {
if (!email) return; // ❌ lógica en UI
vm.login();
}}

La validación debe vivir en el ViewModel o UseCase.

⸻

7️⃣ Regla: El ViewModel Contiene Todo el Estado

Ejemplo obligatorio:

export class LoginViewModel {
email = '';
password = '';
loading = false;

constructor(private loginUseCase: LoginUseCase) {
makeAutoObservable(this);
}

setEmail(value: string) {
this.email = value;
}

async login() {
this.loading = true;
await this.loginUseCase.execute(this.email, this.password);
this.loading = false;
}
}

El componente nunca modifica estado directamente; siempre llama métodos del VM.

⸻

8️⃣ Regla: No Se Usan Hooks de Estado de React

El agente no debe generar:

const [loading, setLoading] = useState(false); // ❌

Todo estado observable debe venir del VM.

⸻

9️⃣ Regla: No Se Usa useEffect para Lógica de Negocio

Si se necesita inicialización:

Correcto:

useEffect(() => {
vm.load();
}, []);

Pero:
• La lógica debe estar en el VM.
• El efecto solo dispara acciones del VM.

Nunca:

useEffect(() => {
fetchData(); // ❌ lógica en componente
}, []);

⸻

🔟 Regla: Flujo Obligatorio

Screen (observer)
↓
ViewModel (MobX)
↓
UseCase
↓
Domain

React solo renderiza.

MobX controla estado.

⸻

1️⃣1️⃣ Prohibiciones Absolutas

El agente no debe:
• Crear estado local en componentes.
• Llamar APIs desde componentes.
• Instanciar ViewModels manualmente.
• Mutar observables fuera del VM.
• Usar useMemo o useCallback para optimizar lógica de negocio.
• Usar context como store global.

⸻

🎯 Principio Rector

React es solo la capa de render.

MobX es el único gestor de estado.

El ViewModel es el único dueño del estado.

La UI es una proyección declarativa del estado observable.

Todo componente generado debe adherirse estrictamente a estas reglas.
