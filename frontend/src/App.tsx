import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Header />

      <main
        style={{
          minHeight: "100vh",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
        className="bg-light-gray"
      >
        <section
          style={{
            maxWidth: "48rem",
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
            className="text-primary-blue"
          >
            Social <span className="text-accent-yellow">Drive</span>
          </h1>

          <p style={{ marginTop: "0.75rem" }} className="text-dark">
            Logo kleuren preview
          </p>

          <div
            style={{
              marginTop: "2rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "1rem",
            }}
          >
            <div
              style={{
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "white",
                fontWeight: "600",
              }}
              className="bg-primary-blue"
            >
              primaryBlue
              <br />
              <span style={{ fontSize: "0.75rem" }}>#0043A8</span>
            </div>
            <div
              style={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontWeight: "600",
              }}
              className="bg-accent-yellow text-dark"
            >
              accentYellow
              <br />
              <span style={{ fontSize: "0.75rem" }}>#FDB812</span>
            </div>
            <div
              style={{
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "white",
                fontWeight: "600",
              }}
              className="bg-light-blue"
            >
              lightBlue
              <br />
              <span style={{ fontSize: "0.75rem" }}>#2E8FDB</span>
            </div>
            <div
              style={{
                borderRadius: "0.5rem",
                padding: "1rem",
                color: "white",
                fontWeight: "600",
              }}
              className="bg-dark"
            >
              dark
              <br />
              <span style={{ fontSize: "0.75rem" }}>#001A3D</span>
            </div>
            <div
              style={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontWeight: "600",
                border: "1px solid rgba(0, 26, 61, 0.2)",
              }}
              className="bg-light-gray text-dark"
            >
              lightGray
              <br />
              <span style={{ fontSize: "0.75rem" }}>#F5F5F5</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
