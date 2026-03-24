import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at top left, rgba(201,123,146,0.25), transparent 36%), linear-gradient(160deg, #fff9f6 0%, #f3ece6 100%)",
          color: "#2b2430",
          padding: "44px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "760px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#2f6f74",
              fontWeight: 700,
            }}
          >
            Madamis Type
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              fontWeight: 700,
              lineHeight: 1.15,
            }}
          >
            マダミスタイプ診断
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "28px",
              lineHeight: 1.6,
              color: "#6d6471",
            }}
          >
            32問の答えから、卓上での立ち回りを4軸16タイプで見える化する。
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
          }}
        >
          {["32 Questions", "4 Axes", "16 Types"].map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                borderRadius: "999px",
                padding: "10px 16px",
                background: "rgba(255,255,255,0.74)",
                fontSize: "20px",
                color: "#2f6f74",
                fontWeight: 700,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
