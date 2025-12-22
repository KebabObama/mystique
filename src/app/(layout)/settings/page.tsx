import { UpdateUserAvatar } from "@/components/settings/update-profile-avatar";
import { UpdateProfileEmail } from "@/components/settings/update-profile-email";
import { UpdateProfileName } from "@/components/settings/update-profile-name";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="flex w-full flex-col flex-wrap gap-6">
      <UpdateUserAvatar />
      <UpdateProfileName user={session?.user!} />
      <UpdateProfileEmail user={session?.user!} />
    </div>
  );
};
