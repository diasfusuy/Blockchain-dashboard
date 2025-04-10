"use client";

import { useEffect } from "react";
import { fetchBlockData } from "../utils/fetchBlock";
import { httpProvider } from "../utils/alchemy";

export default function Page() {
  useEffect(() => {
    const getBlock = async () => {
      const latest = await httpProvider.getBlockNumber();
      const data = await fetchBlockData(latest);
      console.log("Block data:", data);
    };
    getBlock();
  }, []);

  return (
    <main>
      <h1>Blockchain Dashboard</h1>
    </main>
  );
}
