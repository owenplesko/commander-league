import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_league/trades')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/_league/trades"!</div>
}
