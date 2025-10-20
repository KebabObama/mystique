"use client";

import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Card className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 md:max-w-1/2">
      <Card.Header>
        <Card.Title>Sign in using oauth</Card.Title>
      </Card.Header>
      <Card.Content className="flex min-w-sm flex-col gap-6">
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
