---
trigger: always_on
---

🎨 Regla General de UI, Componentes y Estilos

(Obligatoria para el Agente — shadcn + Tailwind CSS)

Toda la UI debe construirse bajo un sistema consistente basado en:
• shadcn/ui como base de componentes
• Tailwind CSS como sistema de estilos
• Componentes reutilizables
• Diseño basado en tokens
• Separación estricta entre lógica y presentación

⸻

1️⃣ Regla: No Se Escriben Estilos Inline Arbitrarios

✔ Obligatorio
• Todos los estilos deben expresarse con clases de Tailwind.
• No se permiten objetos style={{}} salvo casos excepcionales justificados.
• No se permite CSS suelto fuera del sistema definido.

⸻

2️⃣ Regla: Uso Obligatorio de shadcn como Base

Siempre que exista un componente equivalente en shadcn, debe utilizarse como base.

✔ Ejemplos obligatorios
• Button
• Input
• Card
• Dialog
• Badge
• Tabs
• Sheet
• DropdownMenu

❌ Prohibido
• Crear botones personalizados desde cero si ya existe Button.
• Reescribir patrones de accesibilidad ya resueltos por shadcn.

⸻

3️⃣ Regla: Estructura de Componentes

Los componentes deben clasificarse en tres niveles:

components/
├── ui/ → Wrappers de shadcn (base del sistema)
├── shared/ → Componentes reutilizables del proyecto
└── feature/ → Componentes específicos de un módulo

⸻

4️⃣ Regla: Componentes UI (Wrappers)

Estos encapsulan variantes del sistema visual.

Ejemplo:

export function PrimaryButton(props: ButtonProps) {
return (
<Button
className="w-full font-semibold"
{...props}
/>
);
}

✔ Principios
• Extienden shadcn
• Definen variantes del sistema
• No contienen lógica de negocio

⸻

5️⃣ Regla: Componentes Reutilizables

Deben ser:
• Controlados por props
• Sin acceso a estado global
• Sin lógica de negocio
• Sin acceso a APIs

Ejemplo:

type FormFieldProps = {
label: string;
error?: string;
children: React.ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
return (

<div className="flex flex-col gap-2">
<label className="text-sm font-medium">{label}</label>
{children}
{error && (
<span className="text-sm text-destructive">
{error}
</span>
)}
</div>
);
}

⸻

6️⃣ Regla: Uso Correcto de Tailwind

✔ Obligatorio
• Layout con flex, grid
• Espaciado con gap-_, p-_, m-_
• Tipografía con text-_, font-\*
• Colores desde el theme (primary, secondary, muted, destructive)

❌ Prohibido
• Colores hardcodeados (text-red-500 si no es parte del sistema)
• Medidas arbitrarias no justificadas
• Repetición excesiva de clases

⸻

7️⃣ Regla: Diseño Basado en Tokens

Se debe usar el sistema de diseño del theme:
• bg-background
• text-foreground
• border-border
• text-muted-foreground
• bg-primary
• text-primary-foreground

Nunca usar valores HEX directos dentro de componentes.

⸻

8️⃣ Regla: Composición Sobre Personalización

En vez de modificar estilos complejos:

✔ Componer con contenedores:

<Card className="p-6 space-y-4">
  <CardHeader>
    <CardTitle>Login</CardTitle>
  </CardHeader>
  <CardContent>
    <LoginForm />
  </CardContent>
</Card>

No crear wrappers innecesarios si la composición resuelve el problema.

⸻

9️⃣ Regla: Separación UI / Lógica

✔ Obligatorio
• Los componentes reciben datos por props.
• Nunca acceden directamente a ViewModels.
• Nunca contienen lógica de negocio.

Ejemplo correcto:

<LoginForm
  loading={vm.loading}
  onSubmit={vm.login}
/>

Ejemplo prohibido:

const vm = useLoginViewModel(); // ❌ dentro del componente

⸻

🔟 Regla: Responsividad

Todo layout debe considerar:
• sm:
• md:
• lg:

Ejemplo:

<div className="grid gap-4 md:grid-cols-2">

No se permiten layouts rígidos sin justificación.

⸻

1️⃣1️⃣ Regla: Estados Visuales Obligatorios

Todo componente interactivo debe contemplar:
• hover
• focus
• disabled
• loading (cuando aplique)

Ejemplo:

<Button
disabled={loading}
className="w-full"

> {loading ? "Loading..." : "Submit"}
> </Button>

⸻

1️⃣2️⃣ Prohibiciones

El agente no debe:
• Crear CSS tradicional si Tailwind resuelve el caso.
• Hardcodear colores.
• Duplicar componentes base.
• Mezclar estilos con lógica.
• Crear variantes manuales en vez de usar cva si aplica.
• Romper consistencia tipográfica.

⸻

🎯 Principio Rector

La UI debe ser:
• Consistente
• Predecible
• Reutilizable
• Accesible
• Basada en sistema de diseño
• Sin lógica de negocio
• Basada en composición

Toda generación de UI debe adherirse estrictamente a estas reglas.
