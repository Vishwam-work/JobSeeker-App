'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function DownloadProfilePDF({
  setIsPDF,
  setIsDownloading,
}: {
  setIsPDF: React.Dispatch<React.SetStateAction<boolean>>;
   setIsDownloading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const waitForImages = async (container: HTMLElement) => {
    const images = Array.from(container.querySelectorAll('img'));

    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve(true);
            else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(true);
            }
          })
      )
    );
  };

 const downloadPDF = async () => {
  try {
    setLoading(true);
    setIsDownloading(true);
    setIsPDF(true);

    await new Promise((r) => setTimeout(r, 800));

    const html2pdf = (await import('html2pdf.js')).default;

    const element = document.getElementById('profile-review-ui');

    if (!element) return;

    const opt = {
      margin: 10,
      filename: 'profile.pdf',
      image: {
        type: 'jpeg' as 'jpeg',
        quality: 1,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: 'mm' as 'mm',
        format: 'a4' as 'a4',
        orientation: 'portrait' as 'portrait',
      },
    };

    await html2pdf().set(opt).from(element).save();
  } finally {
    setIsPDF(false);
    setIsDownloading(false);
    setLoading(false);
  }
};

 return (
  <>
    {loading && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700 font-medium">Generating PDF...</span>
        </div>
      </div>
    )}

    <Button variant="outline" onClick={downloadPDF} disabled={loading}>
      <Download className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Preparing PDF...' : 'Download PDF'}
    </Button>
  </>
);
}