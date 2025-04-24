import WhiteBoard from "components/WhiteBoard";
import { auth } from "../auth";

export default async function Home() {
  const session = await auth();

  return <WhiteBoard session={session} />;
}
