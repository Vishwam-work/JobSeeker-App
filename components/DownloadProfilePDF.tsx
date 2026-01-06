'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function DownloadProfilePDF() {
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

      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const container = document.getElementById('profile-review-ui');
      if (!container) return;

      await waitForImages(container);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();

      const pages = ['pdf-page-1', 'pdf-page-2'];

      for (let i = 0; i < pages.length; i++) {
        const page = document.getElementById(pages[i]);
        if (!page) continue;

        const canvas = await html2canvas(page, {
          scale: 2,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const height = (canvas.height * width) / canvas.width;

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      }

      pdf.save('profile.pdf');
    } catch (err) {
      console.error(err);
      alert('PDF download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={downloadPDF}
      disabled={loading}
    >
      <Download className="w-4 h-4 mr-2" />
      {loading ? 'Preparing PDF...' : 'Download PDF'}
    </Button>
  );
}
