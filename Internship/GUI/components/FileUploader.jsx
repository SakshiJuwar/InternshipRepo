'use client';
import { useState } from 'react';

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file before uploading');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null); // Reset error state on new upload

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        throw new Error('File upload failed');
      }

      const data = await res.json();
      setUploading(false);
      alert(data.message);

      // Clear file input after successful upload
      setFile(null);
    } catch (err) {
      setUploading(false);
      setError(err.message); // Set error message if something goes wrong
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <div className="w-full">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-8 w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex justify-center mb-3">
        <button
          onClick={handleUpload}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded"
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </div>
      <div className="h-[3px] bg-gray-700 my-6 w-full rounded" />
      {/* Instructions Section */}
      <div className="text-sm text-gray-700 font-medium leading-relaxed">
        <h3><strong>Instructions : </strong></h3> <br></br>
        <p className="mb-2"> 1. Only PDF files are supported.</p>
        <p className="mb-2"> 2. The chatbot will analyze your file content and provide answers.</p>
        <p> 3. After uploading, you can start chatting with your document on the right.</p>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
}