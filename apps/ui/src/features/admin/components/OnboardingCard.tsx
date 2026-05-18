import { UserBadge } from "@/features/common/components/UserBadge";
import { orpc } from "@/lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export function OnboardingCard() {
  const { data: users } = useSuspenseQuery(
    orpc.user.list.queryOptions({ input: { isMember: "false" } }),
  );

  const mutation = useMutation(orpc.member.create.mutationOptions());

  return (
    <Card title="Onboarding">
      {users.length === 0 ? (
        <span>nobody to onboard...</span>
      ) : (
        <ul>
          {users.map((user) => (
            <li style={{ display: "flex", placeContent: "space-between" }}>
              <UserBadge user={user} />
              <Button
                label="Onboard User"
                onClick={() => {
                  mutation.mutate({ userId: user.id });
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
