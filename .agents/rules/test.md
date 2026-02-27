---
trigger: always_on
---
🧪 Regla General para Tests Unitarios

(Obligatoria — Basada en Arquitectura Modular + MVVM + Clean Architecture)

Los tests deben respetar estrictamente la separación por capas del proyecto:

modules/
 ├── domain
 ├── data
 └── presentation

Cada capa tiene reglas específicas de testeo.

⸻

1️⃣ Estructura de Tests

Los tests deben ubicarse junto a la capa correspondiente o en una carpeta __tests__ dentro del módulo.

Ejemplo recomendado:

auth/
├── domain/
│   ├── usecases/
│   │   ├── LoginUseCase.ts
│   │   └── __tests__/
│   │       └── LoginUseCase.spec.ts
│
├── data/
│   ├── repositories/
│   │   ├── AuthRepositoryImpl.ts
│   │   └── __tests__/
│   │       └── AuthRepositoryImpl.spec.ts
│
└── presentation/
    ├── viewmodels/
    │   ├── LoginViewModel.ts
    │   └── __tests__/
    │       └── LoginViewModel.spec.ts


⸻

2️⃣ Regla: Tests del Dominio

Qué se testea
	•	UseCases
	•	Reglas de negocio
	•	Transformaciones puras
	•	Validaciones

Qué NO se testea
	•	UI
	•	APIs reales
	•	Librerías externas

Ejemplo: LoginUseCase

describe("LoginUseCase", () => {
  it("debe llamar al repositorio con email y password", async () => {
    const mockRepository = {
      login: jest.fn().mockResolvedValue({ id: 1 })
    } as any;

    const useCase = new LoginUseCase(mockRepository);

    await useCase.execute("test@mail.com", "1234");

    expect(mockRepository.login).toHaveBeenCalledWith(
      "test@mail.com",
      "1234"
    );
  });
});

Principio

El dominio se testea con mocks simples.
No se usa DI container en unit tests.

⸻

3️⃣ Regla: Tests de Data

Qué se testea
	•	Implementaciones concretas
	•	Mappers
	•	Integración con API mockeada

Qué NO se testea
	•	Lógica de negocio
	•	Estado de UI

Ejemplo:

describe("AuthRepositoryImpl", () => {
  it("debe delegar en AuthApi", async () => {
    const mockApi = {
      login: jest.fn().mockResolvedValue({ id: 1 })
    };

    const repo = new AuthRepositoryImpl(mockApi as any);

    await repo.login("a", "b");

    expect(mockApi.login).toHaveBeenCalled();
  });
});


⸻

4️⃣ Regla: Tests de ViewModel (MobX)

Qué se testea
	•	Cambios de estado
	•	Transiciones (loading → false)
	•	Interacción con UseCases

Qué NO se testea
	•	Render de componentes
	•	Estilos
	•	Routing

Ejemplo:

describe("LoginViewModel", () => {
  it("debe activar loading durante login", async () => {
    const mockUseCase = {
      execute: jest.fn().mockResolvedValue(undefined)
    };

    const vm = new LoginViewModel(mockUseCase as any);

    const promise = vm.login();

    expect(vm.loading).toBe(true);

    await promise;

    expect(vm.loading).toBe(false);
  });
});

Principio

Se testea el estado observable directamente.
No se necesita React para testear ViewModels.

⸻

5️⃣ Regla: Tests de Componentes

Solo se testean:
	•	Render condicional
	•	Interacción de eventos
	•	Integración con props

Nunca:
	•	Lógica de negocio
	•	Estado MobX interno
	•	API calls

Ejemplo:

render(
  <LoginForm
    email="test"
    loading={false}
    onSubmit={mockSubmit}
  />
);

fireEvent.click(screen.getByText("Login"));

expect(mockSubmit).toHaveBeenCalled();


⸻

6️⃣ Regla: No Usar el Container en Unit Tests

❌ Incorrecto:

const vm = container.get(LoginViewModel);

✔ Correcto:

const vm = new LoginViewModel(mockUseCase);

Los tests deben ser aislados.
El container solo se usa en integración.

⸻

7️⃣ Regla: Cobertura por Capa

Capa	¿Debe tener tests?	Tipo
domain	Sí (obligatorio)	Unit
data	Sí	Unit
presentation/viewmodels	Sí	Unit
UI components	Opcional	Render tests
DI container	No	No unitarios


⸻

8️⃣ Regla de Mockeo

Siempre mockear:
	•	Repositorios en UseCases
	•	UseCases en ViewModels
	•	APIs en Data

Nunca mockear:
	•	Entidades
	•	Casos de uso al testear dominio
	•	MobX internamente

⸻

9️⃣ Flujo de Testeo Correcto

UseCase  →  mock Repository
ViewModel → mock UseCase
RepositoryImpl → mock API
Component → mock props


⸻

🔟 Principio Rector

Cada capa se testea en aislamiento.
	•	El dominio debe poder testearse sin React.
	•	El ViewModel debe poder testearse sin UI.
	•	La UI debe poder testearse sin lógica de negocio.
	•	No hay dependencia del container en unit tests.

El objetivo es mantener:
	•	Tests rápidos
	•	Tests deterministas
	•	Tests independientes
	•	Alta confiabilidad arquitectónica