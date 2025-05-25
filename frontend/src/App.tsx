import { RouterProvider, createBrowserRouter } from 'react-router'
import TodosPage from './pages/todos'

const router = createBrowserRouter([
  {
    path: '/',
    element: <TodosPage />,
    // children: [...] // 他のページがあればここに追加
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
