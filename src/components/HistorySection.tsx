"use client"
import { useState, useEffect } from 'react';
import { Prediction } from '@/app/dashboard/page';

interface HistorySectionProps {
  predictionHistory: Prediction[];
  clearHistory: () => void;
}

function HistorySection({ predictionHistory: localHistory, clearHistory }: HistorySectionProps) {
  const [serverHistory, setServerHistory] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/predict", { method: "GET" });
      if (!res.ok) throw new Error("Failed to fetch history");
      const data = await res.json();
      setServerHistory(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
 
  const combinedHistory = [...serverHistory, ...localHistory];
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">Prediction History</h2>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-500">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6">Prediction History</h2>
        <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
        <button 
          onClick={fetchHistory} 
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (combinedHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg  p-6 text-center">
        <h2 className="text-2xl font-semibold mb-6 text-green-600 text-start">Prediction History</h2>
        <p className="text-gray-500">No prediction history available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg  p-6">
      <div className="flex flex-col mb-6 w-full">
        <h2 className="text-2xl font-semibold text-green-600 text-start">Prediction History</h2>
        <div className="flex space-x-2 w-full">
          <button
            onClick={fetchHistory}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm w-full"
          >
            Refresh
          </button>
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm w-full"
          >
            Clear Local History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combinedHistory.map((item,i) => (
          <div key={i} className="border-[0.00012px] border-black/10 rounded-lg overflow-hidden">
            <div className="h-48 overflow-hidden bg-gray-200">
              <img
                src={`${process.env.ENDPOINT || "http://localhost:5000"}/storage/${item.image_path || item.imageUrl}`}
                alt={item.plant_name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `/images/default.png`;
                }}
              />
            </div>
            <div className="p-4">
              <div className="flex flex-col justify-between items-start mb-2">
                <h3 className="font-semibold text-green-700">{item.plant_name}</h3>
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              </div>
              <div className="text-sm mb-2">
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <span className="font-medium">{(item.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <p className="line-clamp-3" title={item.benefit}>{item.benefit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistorySection;