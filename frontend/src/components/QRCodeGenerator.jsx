import React, { useState } from 'react';

export default function QRCodeGenerator({ homeNumber, onGenerate }) {
  const [qrData, setQrData] = useState(homeNumber || '');

  const generateQR = () => {
    if (qrData.trim()) {
      // In a real implementation, you would use a QR code library like qrcode.js
      // For now, we'll create a simple visual representation
      const qrCodeData = {
        homeNumber: qrData,
        timestamp: new Date().toISOString(),
        type: 'house_verification'
      };
      
      if (onGenerate) {
        onGenerate(qrCodeData);
      }
      
      // Create a simple QR-like visual
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 200;
      canvas.height = 200;
      
      // Simple QR-like pattern
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 200);
      
      // Add some squares to simulate QR code
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if ((i + j) % 3 === 0) {
            ctx.fillRect(i * 10, j * 10, 8, 8);
          }
        }
      }
      
      // Add home number text
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(qrData, 100, 190);
      
      // Convert to data URL
      const dataURL = canvas.toDataURL();
      
      // Create download link
      const link = document.createElement('a');
      link.download = `QR_${qrData}.png`;
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Generate QR Code</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Home Number
          </label>
          <input
            type="text"
            placeholder="Enter home number (e.g., HOME001)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={qrData}
            onChange={(e) => setQrData(e.target.value)}
          />
        </div>
        
        <button
          onClick={generateQR}
          className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          📱 Generate & Download QR Code
        </button>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">QR Code Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Print the QR code and place it on the house number plate</li>
            <li>• Workers will scan this QR code to verify house visits</li>
            <li>• Each scan earns 5 golden points for the worker</li>
            <li>• Admin can track which houses have been visited</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
