import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

export default function AdminRoute() {
  const { isAuthenticated, type, entity } = useAppSelector((state) => state.auth)

  if (!isAuthenticated || type !== 'user' || !entity?.isAdmin) {
    return <Navigate to="/feed" replace />
  }

  return <Outlet />
}
