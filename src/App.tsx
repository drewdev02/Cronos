
import { Route, Routes } from 'react-router-dom'
import routes, { RouteConfig, RouteChild } from './routes'

export default function App() {
  return (
    <Routes>
      {routes.map((route: RouteConfig) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child: RouteChild, index: number) => (
            <Route
              key={child.path || `index-${index}`}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}
    </Routes>
  )
}