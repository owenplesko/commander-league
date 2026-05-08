import { FormInputText } from "@/features/forms/FormInputText";
import { orpc, queryClient } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useForm, type SubmitHandler } from "react-hook-form";

export const Route = createFileRoute("/_auth/initialize")({
  beforeLoad: async () => {
    const league = await queryClient.ensureQueryData(
      orpc.league.get.queryOptions(),
    );
    if (league.initialized) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

type FormData = {
  name: string;
};

function RouteComponent() {
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>();

  const mutation = useMutation(orpc.league.initialize.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    await mutation.mutateAsync({ name });
    router.navigate({ to: "/" });
  };

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <Card
        title="League Initialization"
        footer={<Button form="league-init" label="Initialize" type="submit" />}
        style={{ width: "30rem", margin: "4rem" }}
      >
        <form
          id="league-init"
          className="modalForm"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormInputText
            label="Name"
            name="name"
            placeholder="league name..."
            control={control}
          />
        </form>
      </Card>
    </div>
  );
}
