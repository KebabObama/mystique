"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Card className="md:max-w-1/2">
      <Card.Header>
        <Card.Title>Sign</Card.Title>
      </Card.Header>
      <Card.Content className="flex min-w-sm flex-col">
        <Button
          onClick={async () => {
            setLoading(true);
            try {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
              });
            } catch (err: any) {}
            setLoading(false);
          }}
          disabled={loading}
        >
          Google
        </Button>

        <Button
          onClick={async () => {
            setLoading(true);
            try {
              await authClient.signIn.social({
                provider: "github",
                callbackURL: "/dashboard",
              });
            } catch (err: any) {}
            setLoading(false);
          }}
          disabled={loading}
        >
          GitHub
        </Button>
      </Card.Content>
    </Card>
  );
};
