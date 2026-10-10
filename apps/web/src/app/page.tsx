export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--border-color)",
          borderRadius: "8px",
          padding: "2.5rem 2rem",
          boxShadow: "0 2px 8px rgba(59, 30, 8, 0.06)",
        }}
      >
        <header style={{ marginBottom: "1.5rem" }}>
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              marginBottom: "0.5rem",
            }}
          >
            Phase 0 Foundation
          </p>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: 700,
              color: "var(--text-main)",
              lineHeight: 1.2,
            }}
          >
            CoCollaber
          </h1>
        </header>

        <section style={{ marginBottom: "2rem" }}>
          <blockquote
            style={{
              fontSize: "1.125rem",
              fontWeight: 500,
              fontStyle: "italic",
              color: "var(--text-main)",
              borderLeft: "3px solid var(--surface-highlight)",
              paddingLeft: "1rem",
              margin: "1.5rem 0",
              textAlign: "left",
            }}
          >
            &ldquo;What opportunity are you looking for, and what opportunity can you offer?&rdquo;
          </blockquote>

          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              textAlign: "left",
            }}
          >
            CoCollaber is an open, global, domain-agnostic opportunity and collaboration ecosystem.
            The foundational repository skeleton is established and verified. Application features
            will be introduced starting in Phase 1 following verified architectural blueprints.
          </p>
        </section>

        <footer
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8125rem",
            color: "var(--text-muted)",
          }}
        >
          <span>People &harr; Opportunities &harr; People</span>
          <span>Status: Verified Baseline</span>
        </footer>
      </div>
    </main>
  );
}
