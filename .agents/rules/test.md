---
trigger: always_on
---

🧪 Regla General para Tests Unitarios (Vitest)

(Obligatoria — Basada en Arquitectura Modular + MVVM + Clean Architecture)

El runner de tests estándar es [Vitest](https://vitest.dev/). Todos los tests deben escribirse usando la API de Vitest (`describe`, `it`, `expect`, `vi`).

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



Ejemplo: LoginUseCase (Vitest, usando mock externo)

// __tests__/MockAuthRepository.ts
import type { AuthRepository } from '../../repositories/AuthRepository'
import { vi } from 'vitest'

export class MockAuthRepository implements AuthRepository {
  login = vi.fn().mockResolvedValue({ id: 1 })
}

// __tests__/LoginUseCase.spec.ts
import { describe, it, expect } from 'vitest'
import { LoginUseCase } from '../LoginUseCase'
import { MockAuthRepository } from './MockAuthRepository'

describe("LoginUseCase", () => {
  it("debe llamar al repositorio con email y password", async () => {
    const mockRepository = new MockAuthRepository()
    const useCase = new LoginUseCase(mockRepository)
    await useCase.execute("test@mail.com", "1234")
    expect(mockRepository.login).toHaveBeenCalledWith(
      "test@mail.com",
      "1234"
    )
  })
})

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


describe("AuthRepositoryImpl", () => {

Ejemplo:

// __tests__/MockAuthApi.ts
import type { AuthApi } from '../../api/AuthApi'
import { vi } from 'vitest'

export class MockAuthApi implements AuthApi {
  login = vi.fn().mockResolvedValue({ id: 1 })
}

// __tests__/AuthRepositoryImpl.spec.ts
import { describe, it, expect } from 'vitest'
import { AuthRepositoryImpl } from '../AuthRepositoryImpl'
import { MockAuthApi } from './MockAuthApi'

describe("AuthRepositoryImpl", () => {
  it("debe delegar en AuthApi", async () => {
    const mockApi = new MockAuthApi()
    const repo = new AuthRepositoryImpl(mockApi)
    await repo.login("a", "b")
    expect(mockApi.login).toHaveBeenCalled()
  })
})


⸻

4️⃣ Regla: Tests de ViewModel (MobX)

Qué se testea

	1️⃣ Estructura de Tests y Mocks

	Los tests deben ubicarse junto a la capa correspondiente o en una carpeta __tests__ dentro del módulo.

	Los mocks NO deben declararse inline dentro de los tests. En su lugar, crea implementaciones de mocks en archivos separados dentro de la carpeta __tests__, cumpliendo el contrato de la interfaz correspondiente.

	Ejemplo recomendado:

	•	Cambios de estado
	•	Transiciones (loading → false)
	•	Interacción con UseCases

Qué NO se testea
	•	Render de componentes
Ejemplo:

	Ejemplo:

	// __tests__/MockLoginUseCase.ts
	import type { LoginUseCase } from '../../usecases/LoginUseCase'
	import { vi } from 'vitest'

	export class MockLoginUseCase implements LoginUseCase {
	  execute = vi.fn().mockResolvedValue(undefined)
	}

	// __tests__/LoginViewModel.spec.ts
	import { describe, it, expect } from 'vitest'
	import { LoginViewModel } from '../LoginViewModel'
	import { MockLoginUseCase } from './MockLoginUseCase'

describe("LoginViewModel", () => {
	  it("debe activar loading durante login", async () => {
	    const mockUseCase = new MockLoginUseCase()
	    const vm = new LoginViewModel(mockUseCase)
	    const promise = vm.login()
	    expect(vm.loading).toBe(true)
	    await promise
	    expect(vm.loading).toBe(false)
	  })
	})
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

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

it('llama onSubmit al hacer click', () => {
	const mockSubmit = vi.fn()
	render(
		<LoginForm
			email="test"
			loading={false}
			onSubmit={mockSubmit}
		/>
	)
	fireEvent.click(screen.getByText("Login"))
	expect(mockSubmit).toHaveBeenCalled()
})


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