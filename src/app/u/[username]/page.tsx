import { Suspense } from 'react';
import SendMessage from './SendMessage';

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Content params={params} />
    </Suspense>
  );
}

async function Content({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <SendMessage username={username} />;
}
