import { auth } from "@/auth";
import { SitesLogged } from "./sites-logged";
import { SitesUnLogged } from "./sites-unlogged";

export default async function Navigation() {
  const session = await auth();
  const user = session?.user;
  const userId = user?.id;

  return (
    <div className="h-full relative overflow-auto bg-muted/50">
      {userId ? <SitesLogged /> : <SitesUnLogged />}
    </div>
  );
}
