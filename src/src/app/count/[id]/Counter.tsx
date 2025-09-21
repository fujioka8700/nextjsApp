'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Counter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCount = parseInt(searchParams.get('count') || '0', 10);

  const [count, setCount] = useState(initialCount);

  // countが変更されたらURLを更新
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('count', count.toString());

    router.push(`?${newSearchParams.toString()}`);
  }, [count, router, searchParams]);

  const increment = () => setCount(count + 1);
  const decrement = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  return (
    <div>
      <p>
        現在のカウント: <span>{count}</span>
      </p>
      <button onClick={increment}>カウントアップ</button>
      <button onClick={decrement}>カウントダウン</button>
    </div>
  );
}
