"use client";
import { wsProvider } from "../utils/alchemy.js";
import { useEffect, useState } from "react";
import { fetchBlockData } from "../utils/fetchBlock.js";
import { httpProvider } from "../utils/alchemy.js";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
import GasFeeCorrelationChart from "../components/gasFeeCorrelationChart.js";

export default function Page() {

  const[blocks, setBlocks] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const chartData = blocks
  .filter(Boolean)     
  .reverse()         
  .map((block) => ({    
    blockNumber: block.number,
    erc20Volume: block.erc20Volume, 
    baseFeePerGas: block.baseFeePerGas.toString(),
    gasRatio: block.gasRatio,
  }));

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
    <div className="grid grid-cols-2 gap-6 min-h-screen bg-gradient-to-r from-slate-200 to-slate-100">
    
       <div className="col-span-2 flex flex-col items-center">
            <h1 className="text-3xl font-serif text-sky-600 mt-16">Blockchain Dashboard</h1>  
          <ul className="border-4 p-8 mt-4 rounded-2xl bg-slate-200">
            {blocks.filter(Boolean).map((block) => (
              <li key={block.number} className="border p-4 rounded-xl text-indigo-400 py-4 mt4 hover:bg-blue-200 transition-colors duration-100">
                <span className="font-semibold">Block #{block.number}</span> — LINK Volume: {block.erc20Volume.toLocaleString()}
              </li>
            ))}
          </ul>
          <h6 className="text-center text-sm text-gray-700 mt-4 max-w-xl">
            1.1 The dashboard above shows the latest 10 blocks on the Chainlink blockchain along with their ERC20 transfer volume.
          </h6>
      </div>
      <div className="mt-8 flex flex-col items-center" >
      <h1 className="text-xl font-semibold text-center text-sky-600 mb-2">ERC20 Volume</h1>
      {isClient && (
        <LineChart data={chartData} width={750} height={300} className="mt-6">
        <XAxis dataKey="blockNumber" tick={{ fontSize: 12 }}/>
        <YAxis tickFormatter={(value) => Intl.NumberFormat('en', { notation: "compact" }).format(value)} tick={{ fontSize: 12 }}/>
        <Tooltip formatter={(value) => Intl.NumberFormat('en').format(value)} />
        <Line type="monotone" dataKey="erc20Volume" stroke="#8884d8" dot={{ r: 3 }} />
      </LineChart>
      )}
       <h6 className="text-center text-sm text-gray-700 mt-4 max-w-md">
          2.1 This chart shows the LINK token volume per block over the last 10 blocks.
       </h6>
      </div>
      <div className="mt-8 flex flex-col items-center" >
        <h1 className="text-xl font-semibold text-center text-sky-600 mb-2">Base Fee Per Gas</h1>
      {isClient && (
              <LineChart data={chartData} width={750} height={300} className="mt-6">
                <XAxis dataKey="blockNumber" tick={{ fontSize: 12 }}/>
                <YAxis tickFormatter={(value) => Intl.NumberFormat('en', { notation: "compact" }).format(value)} tick={{ fontSize: 12 }}/>
                <Tooltip formatter={(value) => Intl.NumberFormat('en').format(value)} />
                <Line type="monotone" dataKey="baseFeePerGas" stroke="#8884d8" dot={{ r: 3 }} />
              </LineChart>
        )}
         <h6 className="text-center text-sm text-gray-700 mt-4 max-w-md">
            2.2 Displays the base fee per gas unit for recent blocks. Useful for estimating gas costs.
          </h6>
        </div>
        <div className="mt-16 flex flex-col items-center" >
          <h1 className="text-xl font-semibold text-center text-sky-600 mb-2">Gas Ratio</h1>
        {isClient && (
              <LineChart data={chartData} width={750} height={300} className="mt-6">
                <XAxis dataKey="blockNumber" tick={{ fontSize: 12 }}/>
                <YAxis tickFormatter={(value) => Intl.NumberFormat('en', { notation: "compact" }).format(value)} tick={{ fontSize: 12 }}/>
                <Tooltip formatter={(value) => Intl.NumberFormat('en').format(value)} />
                <Line type="monotone" dataKey="gasRatio" stroke="#8884d8" dot={{ r: 3 }} />
              </LineChart>
        )}
           <h6 className="text-center text-sm text-gray-700 mt-4 max-w-md">
              2.3 Shows the gas used vs. gas limit ratio to indicate network congestion.
           </h6>
        </div>
        <div className="flex flex-col items-center mt-8">
        <GasFeeCorrelationChart data={chartData} />
        <h6 className="text-center text-sm text-gray-700 mt-1 max-w-md">
           2.4 Visualizes the correlation between gas usage and base fee across recent blocks.
        </h6>
        </div>
    
    </div>
  );  
}