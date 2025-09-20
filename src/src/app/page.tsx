'use client';

import { useState, useEffect } from 'react';
import styles from './styles/toggle.module.css';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // localStorageから初期状態を読み込む
  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // スイッチの切り替えハンドラー
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    // bodyのクラスを切り替える
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div>
      <div className="container">
        <nav>
          <div className="title">私のポートフォリオ</div>
          <div>
            <form action="#">
              <label className={styles.switch}>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                />
                <span className={styles.slider}></span>
              </label>
            </form>
          </div>
        </nav>
        <section>
          <div className="content">
            <h1>Hiroshiのポートフォリオ🚀</h1>
            <h3>プログラミングと電気工事のハイブリッド</h3>
            <p>
              こんにちは、Hiroshiです。普段は電気工事士として車で現場を回り、暮らしを支える仕事をしています。💻
              休日や仕事終わりは、場所を問わずノートパソコンを開いてプログラミングに没頭しています。
              Web開発を中心に、新しい技術を学ぶのが好きです。家でも外でも、コードを書くことが最高の楽しみです。
              色々な視点から物事を捉え、常に新しい挑戦を続けています。
            </p>
            <button className="primary-btn">問い合わせ</button>
          </div>
        </section>
      </div>
    </div>
  );
}
