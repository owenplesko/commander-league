import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_league/user/$userId/collection')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/_league/user/$userId/collection"!</div>
}
