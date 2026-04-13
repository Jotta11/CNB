const EmBreve = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(14, 36, 16, 0.88)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "emBreveIn 0.6s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 clamp(24px, 6vw, 64px)",
          animation: "emBreveUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both",
        }}
      >
        {/* Badge laranja */}
        <div
          style={{
            display: "inline-block",
            background: "hsl(32, 89%, 44%)",
            color: "#fff",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(10px, 1.4vw, 13px)",
            letterSpacing: "0.35em",
            padding: "6px 20px",
            borderRadius: "999px",
            marginBottom: "clamp(14px, 2.5vw, 24px)",
          }}
        >
          EM BREVE
        </div>

        {/* Título principal */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            color: "#ffffff",
            fontSize: "clamp(56px, 13vw, 140px)",
            lineHeight: 0.9,
            letterSpacing: "0.01em",
            margin: "0 0 clamp(16px, 3vw, 28px)",
          }}
        >
          CHEGANDO
          <br />
          EM BREVE
        </h1>

        {/* Subtítulo */}
        <p
          style={{
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            color: "rgba(255,255,255,0.65)",
            fontSize: "clamp(13px, 1.8vw, 16px)",
            lineHeight: 1.7,
            fontWeight: 400,
            maxWidth: "min(460px, 85vw)",
            margin: 0,
          }}
        >
          Estamos finalizando os últimos detalhes para transformar
          <br />
          a forma de negociar na pecuária.
        </p>
      </div>

      <style>{`
        @keyframes emBreveIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes emBreveUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EmBreve;
