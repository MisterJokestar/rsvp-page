"use client";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full md:w-100 p-4 md:m-4 bg-gray-200 md:rounded-lg">
        <h1> Welcome! </h1>
        <a href="/events/1"> Event 1 </a> <br />
        <a href="/events/2"> Event 2 </a>
      </div>
    </div>
  );
}
