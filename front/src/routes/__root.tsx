import classes from "./__root.module.css";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={classes.page}>
      <Outlet />
    </div>
  );
}
