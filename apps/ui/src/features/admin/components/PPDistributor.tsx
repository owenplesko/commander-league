import { FormInputNumber } from "@/features/forms/FormInputNumber";
import { FormMultiSelect } from "@/features/forms/FormMultiSelect";
import { orpc } from "@/lib/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormData = {
  increment: number;
  userIds: string[];
};

export function PPDistributor() {
  const { data: members } = useQuery(orpc.member.list.queryOptions());
  const mutation = useMutation(
    orpc.member.incrementPackPoints.mutationOptions(),
  );

  const { control, handleSubmit, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async ({ increment, userIds }) => {
    await mutation.mutateAsync({ increment, userIds });
    reset();
  };

  return (
    <Card title="Distribute Pack Points">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="pp-increment"
        style={{ display: "flex", gap: "0.5rem" }}
      >
        <FormInputNumber
          name="increment"
          control={control}
          placeholder="increment"
        />
        <FormMultiSelect
          name="userIds"
          control={control}
          options={members}
          optionLabel="user.name"
          optionValue="user.id"
          placeholder="members"
        />
        <Button label="Send" type="submit" />
      </form>
    </Card>
  );
}
