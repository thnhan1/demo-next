import Image from "next/image";
export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src="/dog.jpg" alt="dog" width={500} height={500} />
      <h1 className="text-4xl font-bold">Hello</h1>
    </div>
  )
}