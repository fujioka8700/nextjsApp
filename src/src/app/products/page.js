'use client';
import Link from 'next/link';
import styles from './page.module.css';

export default function ProductsList() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h2 className={styles.title}>商品一覧</h2>
                <ul>
                    <li>
                        <Link href='/products/smartphone'>スマートフォン</Link>
                    </li>
                    <li>商品B</li>
                    <li>商品C</li>
                </ul>
            </main>
        </div>
    );
}
