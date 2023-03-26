import Dashboard from "./views/dashboard/Dashboard";

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
]

export default routes
