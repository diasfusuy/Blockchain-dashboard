"use client";
import { wsProvider } from "../utils/alchemy.js";
import { useEffect, useState } from "react";
import { fetchBlockData } from "../utils/fetchBlock.js";
import { httpProvider } from "../utils/alchemy.js";

export default function Page() {

  const[blocks, setBlocks] = useState([]);

  useEffect(() => {
    const loadBlocks = async () => {
      const latest = await httpProvider.getBlockNumber();
      const blockNumbers = Array.from({ length: 10 }, (_, i) => latest - i);     

      const blockData = await Promise.all(
        blockNumbers.map((n) => fetchBlockData(n))
      );
      setBlocks(blockData);

      console.log("🧱 Latest 10 blocks:", blockData);
    };

    const handleNewBlock = async (blockNumber) => {
      console.log("🧱 New block mined:", blockNumber);
      const newBlockData = await fetchBlockData(blockNumber);
      setBlocks(prev => [newBlockData, ...prev.slice(0, 9)]);
    };

    loadBlocks();
    wsProvider.on("block", handleNewBlock);

    return () => {
      wsProvider.off("block", handleNewBlock);
    };
  }, []);


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-serif text-sky-600">Blockchain Dashboard</h1>  
      <ul className="border-4 p-8 mt-4 rounded-2xl bg-slate-200">
        {blocks.map((block) => (
          <li key={block.number} className="border p-4 rounded-xl text-indigo-400 py-4 mt4 hover:bg-blue-200 transition-colors duration-100">
            <span className="font-semibold">Block #{block.number}</span> — LINK Volume: {block.erc20Volume.toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}