
import Login from '../modules/login'

// Export a simple route config that mirrors how Routes/Route from react-router expect elements
export type AppRoute = {
    path: string
    element: React.ReactElement
}

export const routes: AppRoute[] = [
    { path: '/', element: <Login /> },
]

export default routes
