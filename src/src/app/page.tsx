export default function Home() {
  return (
    <div>
      <div className="container">
        <nav>
          <div className="title">私のポートフォリオ</div>
          <div>
            <form action="#">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </form>
          </div>
        </nav>
        <section>
          <div className="content">
            <h1></h1>
          </div>
        </section>
      </div>
    </div>
  );
}
