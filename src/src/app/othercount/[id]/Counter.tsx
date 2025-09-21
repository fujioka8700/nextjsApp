'use client';

import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // コンポーネントがマウントされたときにlocalStorageから値を読み込む
  useEffect(() => {
    const savedCount = localStorage.getItem('count');
    if (savedCount !== null) {
      setCount(parseInt(savedCount, 10));
    }
  }, []);

  // countが変更されるたびにlocalStorageに保存する
  useEffect(() => {
    localStorage.setItem('count', count.toString());
  }, [count]);

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
