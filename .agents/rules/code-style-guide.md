---
trigger: always_on
---

📐 Regla General de Arquitectura

Todo nuevo feature debe seguir estrictamente esta estructura basada en:
• Arquitectura modular
• Separación por capas (Domain / Data / Presentation)
• MVVM
• Inversión de dependencias
• InversifyJS para DI
• MobX únicamente en Presentation

⸻

1️⃣ Regla: El Dominio Define Contratos, Nunca Implementaciones

✔ Obligatorio
• Los repositorios en domain deben ser abstractos.
• No deben depender de librerías externas.
• No deben conocer HTTP, MobX, React, AsyncStorage, etc.

Patrón obligatorio

export abstract class AuthRepository {
abstract login(email: string, password: string): Promise<User>;
}

⸻

2️⃣ Regla: Data Implementa el Dominio

✔ Obligatorio
• Las implementaciones concretas viven en data.
• Deben extender el contrato definido en domain.
• No deben contener lógica de negocio.
• Solo delegan a APIs, SDKs o storage.

Patrón obligatorio

export class AuthRepositoryImpl extends AuthRepository {
constructor(private api: AuthApi) {
super();
}

async login(email: string, password: string) {
return this.api.login(email, password);
}
}

⸻

3️⃣ Regla: Los Casos de Uso Orquestan el Dominio

✔ Obligatorio
• Cada acción del negocio debe representarse con un UseCase.
• El UseCase depende solo de interfaces del dominio.
• No conoce implementaciones concretas.

Patrón obligatorio

export class LoginUseCase {
constructor(private repository: AuthRepository) {}

execute(email: string, password: string) {
return this.repository.login(email, password);
}
}

⸻

4️⃣ Regla: ViewModel = Estado + Coordinación (MVVM)

✔ Obligatorio
• Solo la capa presentation puede usar MobX.
• El ViewModel nunca accede directamente a APIs.
• El ViewModel solo ejecuta UseCases.
• Debe usar makeAutoObservable.

Patrón obligatorio

import { makeAutoObservable } from "mobx";

export class LoginViewModel {
email = '';
password = '';
loading = false;

constructor(
private readonly loginUseCase: LoginUseCase
) {
makeAutoObservable(this);
}

async login() {
this.loading = true;
await this.loginUseCase.execute(this.email, this.password);
this.loading = false;
}
}

⸻

5️⃣ Regla: Las Screens No Contienen Lógica

✔ Obligatorio
• Las pantallas solo renderizan.
• No ejecutan lógica de negocio.
• Obtienen el ViewModel vía DI.

Patrón obligatorio

const vm = useInjection(LoginViewModel);

return (
<LoginForm
loading={vm.loading}
onSubmit={() => vm.login()}
/>
);

⸻

6️⃣ Regla: Toda Dependencia Se Resuelve en el Container

✔ Obligatorio
• No se permite new fuera del container.
• Toda implementación concreta se registra en Inversify.
• Las dependencias deben resolverse en cadena.

Patrón obligatorio

import { Container } from "inversify";

export const container = new Container({
defaultScope: "Singleton",
});

container.bind<AuthRepository>(AuthRepository)
.toDynamicValue((ctx) => {
const api = ctx.container.get(AuthApi);
return new AuthRepositoryImpl(api);
});

container.bind(LoginUseCase)
.toDynamicValue((ctx) => {
const repo = ctx.container.get(AuthRepository);
return new LoginUseCase(repo);
});

container.bind(LoginViewModel)
.toDynamicValue((ctx) => {
const useCase = ctx.container.get(LoginUseCase);
return new LoginViewModel(useCase);
});

⸻

🚫 Reglas Prohibidas

El agente no debe:
• Instanciar repositorios manualmente en ViewModels.
• Llamar APIs desde ViewModels.
• Usar MobX fuera de presentation.
• Saltarse UseCases.
• Acceder directamente a implementaciones concretas.
• Mezclar lógica de negocio con UI.

⸻

🧱 Flujo Obligatorio de Dependencias

Screen
↓
ViewModel
↓
UseCase
↓
Repository (abstract)
↓
RepositoryImpl
↓
API

⸻

🎯 Principio Fundamental

Toda nueva funcionalidad debe respetar:
• Dependencias hacia adentro (Clean Architecture)
• Dominio independiente
• UI desacoplada
• DI centralizada
• Lógica testeable sin Framework
