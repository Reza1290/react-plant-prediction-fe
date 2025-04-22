'use client'
import HistorySection from '@/components/HistorySection';
import Navbar from '@/components/Navbar';
import PredictionSection from '@/components/PredictionSection';
import { useState, useEffect } from 'react';

export interface Prediction {
  id: number;
  plant_name: string;
  benefit: string;
  confidence: number;
  image_path: string;
  timestamp: string;
  user_id: number;
  imageUrl?: string; 
}

export interface PredictionResult {
  plant_name: string;
  benefit: string;
  confidence: number;
  image_path?: string;
  imageUrl?: string; 
}

function Page() {
  const [activeTab, setActiveTab] = useState<'predict' | 'history'>('predict');
  const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('predictionHistory');
    if (savedHistory) {
      setPredictionHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
  }, [predictionHistory]);

  const addPrediction = (prediction: PredictionResult, imageUrl: string) => {
    const newPrediction: Prediction = {
      id: Date.now(),
      plant_name: prediction.plant_name,
      benefit: prediction.benefit,
      confidence: prediction.confidence,
      image_path: prediction.image_path || '',
      imageUrl: imageUrl, 
      timestamp: new Date().toLocaleString(),
      user_id: 1 
    };
    setPredictionHistory([newPrediction, ...predictionHistory]);
  };

  const clearHistory = () => {
    setPredictionHistory([]);
  };

  return (
    <div className="max-h-screen min-h-screen max-w-md mx-auto flex flex-col justify-between relative">
      <main className="container mx-auto px-4 py-8 pb-20">
        {activeTab === 'predict' ? (
          <PredictionSection addPrediction={addPrediction} />
        ) : (
          <HistorySection 
            predictionHistory={predictionHistory} 
            clearHistory={clearHistory} 
          />
        )}
      </main>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default Page;