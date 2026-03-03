import classes from "./SmallButton.module.css";

export function SmallButton() {
  return (
    <button className={classes["small-button"]}>
      <i className="pi pi-times" />
    </button>
  );
}
