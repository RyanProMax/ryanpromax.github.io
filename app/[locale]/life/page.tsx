import type { Metadata } from 'next';
import LifeJournal from '@/components/LifeJournal';
import { Locale } from '@/locales/config';

export const metadata: Metadata = {
  title: '生活 · Life',
  description: '记录每一个重要的日子。',
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return <LifeJournal locale={locale} />;
}
