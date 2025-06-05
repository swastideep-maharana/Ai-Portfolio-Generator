"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Portfolio {
  _id: string;
  name: string;
  role: string;
  createdAt: string;
  output: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setLoading(true);
      fetch("/api/portfolio/list")
        .then((res) => res.json())
        .then((data) => {
          setPortfolios(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated")
    return <p>Please sign in to view your portfolios.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Saved Portfolios</h1>
      {loading ? (
        <p>Loading portfolios...</p>
      ) : portfolios.length === 0 ? (
        <p>
          No saved portfolios yet. Create one{" "}
          <Link href="/upload">
            <a className="text-blue-600 underline">here</a>
          </Link>
          .
        </p>
      ) : (
        <ul className="space-y-4">
          {portfolios.map((p) => (
            <li
              key={p._id}
              className="border rounded p-4 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="text-gray-600">{p.role}</p>
              <p className="text-sm text-gray-400">
                Created at: {new Date(p.createdAt).toLocaleString()}
              </p>
              <Link href={`/dashboard/${p._id}`}>
                <a className="text-blue-600 underline mt-2 block">
                  View Details
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
