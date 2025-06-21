export default function Contact() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">Contact</h1>
      <div className="text-gray-600">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa officia, consectetur, quisquam molestiae dolorum aut iure assumenda magni ullam aliquam, rem quis maiores dicta facilis voluptatum illum libero impedit accusamus?</div>
      <div className="mt-4">
        <form className="flex flex-col gap-4">  
          <input className="p-2 border border-gray-300 rounded-md" type="text" placeholder="Name" />
          <input className="p-2 border border-gray-300 rounded-md" type="email" placeholder="Email" />
          <textarea className="p-2 border border-gray-300 rounded-md" placeholder="Message" />
          <button className="bg-blue-500 text-white p-2 rounded-md" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}