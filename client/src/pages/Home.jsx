import { useState } from "react";
import Form from "../components/Form";
import Posts from "../components/Posts";

const Home = () => {
  const [currentId, setCurrentId] = useState(null);

  return (
    <main className="home-layout">
      <section className="posts-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">COMMUNITY</span>
            <h1>Latest Memories</h1>
          </div>
          <p>Moments worth remembering, shared by the community.</p>
        </div>
        <Posts setCurrentId={setCurrentId} />
      </section>

      <Form currentId={currentId} setCurrentId={setCurrentId} />
    </main>
  );
};

export default Home;
