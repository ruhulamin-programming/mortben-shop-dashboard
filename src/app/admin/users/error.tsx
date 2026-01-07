"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface ErrorMoviePageProps {
  error: Error;
  reset: () => void;
}

export default function ErrorMoviePage({ error, reset }: ErrorMoviePageProps) {
  useEffect(() => {
    console.error("Error on page:", error);
    // You might want to log the error to a server or perform other error handling here
  }, [error]);

  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-center items-center min-h-[70vh]">
      <h2 className="text-3xl mb-4">Something went wrong in {pathname}!</h2>
      <div className="flex gap-3">
        <button
          className="border px-4 py-1 rounded-md bg-green-400 hover:bg-blue-500 mt-4"
          onClick={() => reset()}
        >
          Try again
        </button>
        <Link
          href="/admin/overview"
          className="border px-4 py-1 rounded-md bg-green-400 hover:bg-blue-500 mt-4"
        >
          Home Page
        </Link>
      </div>
    </div>
  );
}
