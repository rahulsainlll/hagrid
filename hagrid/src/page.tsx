"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LoaderCircleIcon } from 'lucide-react';
import Spline from "@splinetool/react-spline";

export default function Home() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      setIsSearching(true);
      const timeout = setTimeout(() => {
        setIsSearching(false);
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  };

  const demoCards = [
    {
      title: "Transaction #1",
      description: "A sample transaction on the Arweave network",
      id: "abc123",
    },
    {
      title: "Smart Contract",
      description: "Example of a deployed smart contract",
      id: "def456",
    },
    {
      title: "Data Storage",
      description: "Permanent data storage example",
      id: "ghi789i",
    },
  ];

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-black">
      <div className="w-full h-[130%] absolute touch-none pointer-events-none bg-gradient-to-b from-black/20 to-black top-0 left-0 z-10" />
      <Spline
        scene="https://prod.spline.design/RgYcaxSqePgtGoNa/scene.splinecode"
        className="scale-[200%]"
      />

      <div
        className={`absolute ${
          isSearching ? "top-[45%]" : "top-[50%]"
        } transition-all duration-700 left-[50%] -translate-x-1/2 -translate-y-1/2 pb-16 text-white flex items-center justify-center flex-col w-full max-w-4xl h-fit z-30`}
      >
        <div
          className={`
            smooth-transition duration-700 ease-in-out 
            ${isSearching ? "scale-[0.8] opacity-60" : "scale-100 opacity-100"}
          `}
        >
          <h1
            className={
              "text-7xl md:text-8xl uppercase leading-tight tracking-tighter text-center font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent"
            }
          >
            Hagrid
          </h1>

          <p
            className={
              "max-w-2xl font-semibold text-center text-lg md:text-xl text-neutral-300 mb-8"
            }
          >
            Search, Explore and Index the Data of the Arweave Ecosystem
          </p>
        </div>

        <div className="relative z-40 w-full max-w-md mb-12">
          {!isSearching ? (
            <div className="relative flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for transaction"
                className="relative z-10 w-full px-4 py-2 bg-transparent shadow-2xl outline-none animate-in fade-in-0 focus:border-neutral-500 placeholder-neutral-400 smooth-transition"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="absolute w-full h-full mx-0 transition-all border-2 bg-neutral-200 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-neutral-600" />
              <button
                type="button"
                className="absolute top-[50%] hover:text-white focus:text-white text-neutral-400 -translate-y-1/2 right-4 smooth-transition"
                onClick={handleSearch}
              >
                <Search size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-purple-300 animate-in fade-in-0">
              <LoaderCircleIcon className="animate-spin" />
              <p className="text-center">Searching for "{query}"...</p>
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
          {demoCards.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              description={card.description}
              link={card.id}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

type CardType = {
  description: string;
  title: string;
  link: string;
};

const Card = ({ description, title, link }: CardType) => {
  return (
    <div className="p-4 transition-all duration-300 bg-opacity-50 border rounded-lg bg-neutral-900 backdrop-blur-lg border-neutral-700 hover:border-purple-500">
      <h3 className="mb-1 text-lg font-semibold text-purple-300">{title}</h3>
      <a
        href={link}
        target="_blank"
        className="block mb-2 text-xs text-neutral-500"
        rel="noreferrer"
      >
        Link {link}
      </a>
      <p className="text-sm text-neutral-300">{description}</p>
    </div>
  );
};

