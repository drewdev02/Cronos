import { ServiceIdentifier } from 'inversify'
import { container } from '../di/container'

export function useInjection<T>(serviceIdentifier: ServiceIdentifier<T>): T {
  return container.get<T>(serviceIdentifier)
}
