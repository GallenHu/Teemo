import { auth } from "@/auth";
import { SitesLogged } from "./sites-logged";
import { SitesUnLogged } from "./sites-unlogged";

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;

  return (
    <div className="h-full relative overflow-auto bg-muted/50">
      <div
        className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 min-h-[300px] text-left"
        style={{ width: "var(--icon-box-width)" }}
      >
        {userId ? <SitesLogged /> : <SitesUnLogged />}
      </div>
    </div>
  );
}
