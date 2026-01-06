'use client';

import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, DollarSign } from 'lucide-react';

type Props = {
  name: 'mail' | 'phone' | 'map' | 'clock' | 'dollar';
  isPDF: boolean;
};

export default function PdfSafeIcon({ name, isPDF }: Props) {
  if (isPDF) {
    return (
      <Image
        src={`/pdf-icons/${name}.png`}
        alt={name}
        width={16}
        height={16}
      />
    );
  }

  switch (name) {
    case 'mail':
      return <Mail className="w-4 h-4" />;
    case 'phone':
      return <Phone className="w-4 h-4" />;
    case 'map':
      return <MapPin className="w-4 h-4" />;
    case 'clock':
      return <Clock className="w-4 h-4" />;
    case 'dollar':
      return <DollarSign className="w-4 h-4" />;
    default:
      return null;
  }
}
