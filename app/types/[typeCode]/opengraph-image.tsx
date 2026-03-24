import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getTypeByCode, hasTypeImage } from "@/lib/data";
import { resolvePalette } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ typeCode: string }>;
}) {
  const { typeCode } = await params;
  const typeData = await getTypeByCode(typeCode);

  if (!typeData) {
    return new Response("Not found", { status: 404 });
  }

  const [primary, secondary, accent] = resolvePalette(
    typeData.visualProfile.colorPalette,
  );
  const imageAvailable = await hasTypeImage(typeCode);
  let imageSrc: string | null = null;

  if (imageAvailable) {
    const imagePath = join(process.cwd(), "public", "types", `${typeCode}.png`);
    const imageBase64 = await readFile(imagePath, "base64");
    imageSrc = `data:image/png;base64,${imageBase64}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(160deg, #fff9f6 0%, #f3ece6 60%, #f7f2ed 100%)",
          color: "#2b2430",
          padding: "40px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(216, 206, 201, 0.8)",
            borderRadius: "28px",
          }}
        />

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            gap: "32px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              width: "46%",
              height: "100%",
              display: "flex",
              borderRadius: "28px",
              overflow: "hidden",
              background: `linear-gradient(160deg, ${primary} 0%, ${secondary} 58%, ${accent} 100%)`,
              border: "1px solid rgba(216, 206, 201, 0.8)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                width="480"
                height="480"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  width: "100%",
                  height: "100%",
                  padding: "32px",
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04))",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.82)",
                    padding: "8px 14px",
                    fontSize: "22px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {typeData.typeCode}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "26px",
                    color: "rgba(43,36,48,0.72)",
                  }}
                >
                  Character Coming Soon
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              width: "54%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "8px 0",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#2f6f74",
                }}
              >
                Madamis Type
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "14px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "54px",
                    fontWeight: 700,
                    lineHeight: 1.15,
                  }}
                >
                  {typeData.typeName}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: "24px",
                    color: "#6d6471",
                    fontWeight: 700,
                  }}
                >
                  {typeData.typeCode}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "28px",
                  lineHeight: 1.5,
                  color: "#2b2430",
                }}
              >
                {typeData.tagline}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: "22px",
                  lineHeight: 1.7,
                  color: "#6d6471",
                }}
              >
                {typeData.summary}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {[typeData.axis.axis1, typeData.axis.axis2, typeData.axis.axis3, typeData.axis.axis4].map(
                (label) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      borderRadius: "999px",
                      background: "rgba(47,111,116,0.12)",
                      color: "#2f6f74",
                      padding: "8px 14px",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
