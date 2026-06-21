import { FormInputTextArea } from "@/features/forms/FormInputTextArea";
import { orpc } from "@/lib/client";
import { CreatePackOfferingSchema } from "@commander-league/contract/schemas";
import { isDefinedError } from "@orpc/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

type FormData = {
  config: string;
};

export function PackOfferings() {
  const mutation = useMutation(orpc.pack.setOfferings.mutationOptions());
  const { data } = useSuspenseQuery(orpc.pack.listOfferings.queryOptions());
  const createOfferings = data.map((o) => ({
    packId: o.pack.id,
    cost: o.cost,
  }));

  const { control, handleSubmit, reset, setError } = useForm<FormData>({
    defaultValues: {
      config: PackOfferingsCodec.encode(createOfferings),
    },
  });

  const onSubmit: SubmitHandler<FormData> = async ({ config }) => {
    const offerings = PackOfferingsCodec.decode(config);
    await mutation.mutateAsync(offerings, {
      onError(err) {
        if (isDefinedError(err))
          setError("config", {
            message: `unknown pack ids: "${err.data.unknown.join('", "')}"`,
          });
      },
    });
  };

  const footer = (
    <>
      <Button
        label={mutation.isSuccess ? "Saved" : "Save"}
        icon={mutation.isSuccess ? PrimeIcons.CHECK : undefined}
        type="submit"
        form="pack-offerings"
        loading={mutation.isPending}
      />
      <Button
        label="Reset"
        severity="danger"
        style={{ marginLeft: "0.5em" }}
        onClick={() => reset()}
        disabled={mutation.isPending}
      />
    </>
  );

  return (
    <Card title="PackOfferings" footer={footer}>
      <form
        id="pack-offerings"
        className="modalForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInputTextArea
          name="config"
          control={control}
          rules={{
            validate: (val) => {
              const { error } = PackOfferingsCodec.safeDecode(val);
              return error ? z.prettifyError(error) : true;
            },
          }}
        />
      </form>
    </Card>
  );
}

const PackOfferingsCodec = z.codec(
  z.string(),
  CreatePackOfferingSchema.array(),
  {
    encode(packOfferings) {
      return packOfferings.map((o) => `${o.packId}: ${o.cost}`).join("\n");
    },
    decode(input, ctx) {
      const lines = input.trim().split("\n").filter(Boolean);
      const offerings: z.infer<typeof CreatePackOfferingSchema>[] = [];

      for (const line of lines) {
        const match = line.match(/^\s*(\S+)\s*:\s*(\S+)/);
        if (!match) {
          ctx.issues.push({
            code: "custom",
            message: `Failed to parse line "${line}"`,
            input,
          });
          continue;
        }

        const [, packId, cost] = match;
        const { data, success } = CreatePackOfferingSchema.safeParse({
          packId,
          cost,
        });

        if (!success) {
          ctx.issues.push({
            code: "custom",
            message: `Failed to parse line "${line}"`,
            input,
          });
          continue;
        }

        offerings.push(data);
      }

      return offerings;
    },
  },
);
