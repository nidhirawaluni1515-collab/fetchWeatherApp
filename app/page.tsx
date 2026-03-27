export default function Home() {
  return (
    <>
      <div>
        <div className="home-card">
          <span className="home-icon">🌤️</span>
          <h1 className="home-title">Weather App</h1>
          <a href="/weather" className="home-btn">Get Started</a>
        </div>
      </div>
    </>
  );
}