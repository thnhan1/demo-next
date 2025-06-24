import Image from "next/image";
import { auth } from "@/auth";
export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Please log in</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/dog.jpg" alt="dog" width={500} height={500} />
      <h1 className="text-4xl font-bold">Hello {session?.user.name}</h1>
    </div>
  );
}
