import { ConfirmDialog } from "primereact/confirmdialog";
import classes from "./__root.module.css";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className={classes.page}>
      <Outlet />
      <ConfirmDialog resizable={false} draggable={false} />
    </div>
  );
}
