import styles from "../page.module.css";
import Link from "next/link";
import Image from "next/image";

const HOST = process.env.HOST || "http://localhost:3000";

async function getProducts({ id }) {
  const res = await fetch(`${HOST}/${id}.json`);
  const products = await res.json();

  return products;
}

const Product = async ({ params }) => {
  const { id } = await params; // ここでURLからIDを取得
  const product = await getProducts({ id });

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>商品ID: {product.id}</h1>
        {/* <img src={product.image} alt={product.name} width="300" height="400"/> */}
        <Image
          src={product.image}
          alt={product.name}
          width="300"
          height="400"
        />
        <p>{product.name}</p>
        <br></br>
        <Link href="/products">商品一覧に戻る</Link>
      </main>
    </div>
  );
};

export default Product;
