import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { orpc } from "../../../lib/client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FormInputText } from "../../forms/FormInputText";
import { useEffect } from "react";

type FormData = {
  name: string;
};

type Props = {
  leagueId: number;
  visible: boolean;
  onHide: () => void;
};

export function LeagueSettingsModal({ leagueId, visible, onHide }: Props) {
  const { data: league } = useSuspenseQuery(
    orpc.league.get.queryOptions({ input: { leagueId } }),
  );

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { name: league.name },
  });

  const saveMutation = useMutation(orpc.league.update.mutationOptions());

  const onSubmit: SubmitHandler<FormData> = async ({ name }) => {
    await saveMutation.mutateAsync({ leagueId: league.id, name });
    onHide();
  };

  useEffect(() => {
    if (!visible) reset();
  }, [visible]);

  return (
    <Dialog
      header="League Settings"
      visible={visible}
      onHide={onHide}
      style={{ width: "40rem" }}
      draggable={false}
      resizable={false}
      footer={<Button label="Save" type="submit" form="league-settings" />}
      modal
    >
      <form
        className="form"
        id="league-settings"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputText
          name="name"
          label="League Name"
          placeholder="league name..."
          rules={{ required: true, minLength: 3, maxLength: 20 }}
          control={control}
        />
      </form>
    </Dialog>
  );
}
