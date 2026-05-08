import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/initialize')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/initialize"!</div>
}
