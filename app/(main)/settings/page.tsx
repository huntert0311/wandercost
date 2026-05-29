import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { Avatar } from "@/components/ui/Avatar";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: authUser.id } });
  if (!user) redirect("/login");

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-lg font-semibold text-gray-900 mb-6">Settings</h1>

      <div className="border rounded-xl p-6 mb-4" style={{ borderWidth: "0.5px" }}>
        <div className="flex items-center gap-4">
          <Avatar src={user.avatar_url} username={user.username} size={56} />
          <div>
            <p className="font-medium text-gray-900">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="border rounded-xl divide-y" style={{ borderWidth: "0.5px" }}>
        <div className="p-4 text-sm text-gray-400">
          Profile editing coming soon.
        </div>
      </div>

      <form action={logout} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-lg py-2 text-sm font-medium text-red-500 border transition hover:bg-red-50"
          style={{ borderWidth: "0.5px", borderColor: "#fca5a5" }}
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
