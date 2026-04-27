'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function DownloadProfilePDF({
  setIsPDF,
}: {
  setIsPDF: React.Dispatch<React.SetStateAction<boolean>>;
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
    setLoading(false);
  }
};

  return (
    <Button variant="outline" onClick={downloadPDF} disabled={loading}>
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Preparing PDF...' : 'Download PDF'}
    </Button>
  );
}