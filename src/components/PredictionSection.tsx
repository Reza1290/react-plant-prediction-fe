"use client"
import { useState, ChangeEvent, FormEvent, useEffect, useRef, useCallback } from 'react';
import { PredictionResult } from '@/app/dashboard/page';
import Webcam from 'react-webcam';

interface PredictionSectionProps {
  addPrediction: (prediction: PredictionResult, imageUrl: string) => void;
}

function PredictionSection({ addPrediction }: PredictionSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // Default to back camera
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
      setSelectedFile(dataURLtoFile(imageSrc, 'captured_image.jpeg'));
      setResult(null);
      setError(null);
      setIsCameraOpen(false); // Close camera after capturing
    }
  }, [webcamRef, dataURLtoFile]);

  

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
      setIsCameraOpen(false); // Close camera if file is selected
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Prediction failed");

      const data = await res.json();
      setResult(data);
      return data;
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCamera = () => {
    setIsCameraOpen(true);
    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setError(null);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleSwitchCamera = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const videoConstraints = {
    facingMode: facingMode,
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Plant Prediction</h2>

      {!isCameraOpen && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          <button
            type="button"
            className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleOpenCamera}
          >
            Take a Photo
          </button>

          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Selected Image Preview:</p>
              <div className="w-full flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 max-w-full object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || isLoading}
            className={`w-full py-2 px-4 rounded-md ${
              !selectedFile || isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
        </form>
      )}

      {isCameraOpen && (
        <div className="space-y-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
            <button
              onClick={capture}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.38-.605.928-.605 1.504a3.7 3.7 0 003.907 3.907 6.729 6.729 0 01-2.17 2.283m4.772 0a6.729 6.729 0 01-2.17-2.283 3.7 3.7 0 003.907-3.907c.576-.576 1.124-1.124 1.504-1.504a2.31 2.31 0 011.059-1.646 6.48 6.48 0 00-3.477 3.97A6.48 6.48 0 009.74 9.916c.38.38.604.928.604 1.504a2.31 2.31 0 01-1.646 1.059m0 0a6.729 6.729 0 013.97-3.477 6.48 6.48 0 00-3.97 3.477c-.17.17-.318.343-.438.523a2.31 2.31 0 01-1.059 1.646m6.48 6.48 0 003.477-3.97c.17-.17.318-.343.438-.523a2.31 2.31 0 011.646-1.059m-3.477 3.97a6.729 6.729 0 012.17 2.283 3.7 3.7 0 00-3.907 3.907c-.576.576-1.124 1.124-1.504 1.504a2.31 2.31 0 01-1.059 1.646 6.48 6.48 0 003.477-3.97m1.404-3.175c.38-.38.605-.928.605-1.504a3.7 3.7 0 00-3.907-3.907 6.729 6.729 0 012.17-2.283m-4.772 0a6.729 6.729 0 012.17 2.283 3.7 3.7 0 00-3.907 3.907c-.576.576-1.124 1.124-1.504 1.504a2.31 2.31 0 011.646 1.059m0 0a6.48 6.48 0 003.97-3.477c.17-.17.318-.343.438-.523a2.31 2.31 0 011.059 1.646m-3.97 3.477a6.48 6.48 0 003.97-3.477c-.17.17-.318.343-.438.523a2.31 2.31 0 01-1.646 1.059" />
              </svg>
            </button>
            {Webcam.length > 0 && (
              <button
                onClick={handleSwitchCamera}
                className="absolute top-4 right-4 bg-gray-800 bg-opacity-50 hover:bg-gray-900 text-white rounded-md p-2 shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a8.083 8.083 0 00-3.827-4.116M19.5 12c0 1.232.046 2.453.138 3.662a8.083 8.083 0 01-3.827 4.116M5.25 12c0-1.232.046-2.453.138-3.662a8.083 8.083 0 013.827-4.116M5.25 12c0 1.232-.046 2.453-.138 3.662a8.083 8.083 0 013.827 4.116m-1.8-4.09l-7.14 2.834a6.002 6.002 0 00-1.72 3.415m15.9-4.09l7.14 2.834a6.002 6.002 0 011.72 3.415M4.5 12a12.75 12.75 0 0015 0m-15 0a12.75 12.75 0 0115 0" />
                </svg>
              </button>
            )}
          </div>
          <button
            onClick={handleCloseCamera}
            className="w-full py-2 px-4 rounded-md bg-gray-400 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Prediction Results</h3>

          <div className="mb-4">
            <h4 className="font-bold text-lg text-green-700">{result.plant_name}</h4>
            <div className="flex items-center mt-2">
              <div className="w-full">
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-600"
                    style={{ width: `${result.confidence * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-right block mt-1">
                  Confidence: {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium">Benefits:</h4>
            <p className="text-gray-700 mt-1">{result.benefit}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionSection;