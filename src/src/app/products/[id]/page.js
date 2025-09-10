const Product = async ({params}) => {
    const { id } = await params; // ここでURLからIDを取得

    return (
        <div>
            <h1>商品ID: {id}</h1>
            <p>このページはID {id} の商品に関する情報です。</p>
        </div>
    );
}

export default Product;