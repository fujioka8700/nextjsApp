import Link from 'next/link';
import Counter from './Counter';

const Count = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  return (
    <div>
      <h1>カウントするページ {id}</h1>
      <Counter />
      <p>
        <Link href="/">ホームに戻る</Link>
      </p>
    </div>
  );
};

export default Count;
