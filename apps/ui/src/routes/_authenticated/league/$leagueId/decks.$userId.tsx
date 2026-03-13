import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/league/$leagueId/decks/$userId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/league/$leagueId/decks"!</div>
}
