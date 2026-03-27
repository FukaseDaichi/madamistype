import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getTypeByCode, hasChibiImage } from "@/lib/data";
import { resolvePalette } from "@/lib/site";

const NOIR = "#0D0B08";
const PAPER = "#F0E8D5";
const PAPER_DARK = "#E2D6BE";
const INK = "#1A1208";
const RED = "#A63A34";
const AMBER = "#D4820A";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function colorWithAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((digit) => `${digit}${digit}`)
          .join("")
      : normalized;

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function getTypeNameFontSize(typeName: string) {
  if (typeName.length <= 4) {
    return 104;
  }

  if (typeName.length <= 6) {
    return 90;
  }

  return 76;
}

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

  const [primary, secondary = primary, accent = secondary] = resolvePalette(
    typeData.visualProfile.colorPalette,
  );
  const chibiAvailable = await hasChibiImage(typeCode);
  const typeNameFontSize = getTypeNameFontSize(typeData.typeName);

  let imageSrc: string | null = null;

  if (chibiAvailable) {
    const imagePath = join(
      process.cwd(),
      "public",
      "types",
      `${typeCode}_chibi.png`,
    );
    const imageBase64 = await readFile(imagePath, "base64");
    imageSrc = `data:image/png;base64,${imageBase64}`;
  }

  return new ImageResponse(
    (
      <div
        lang="ja-JP"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          padding: "34px",
          background: `
            radial-gradient(circle at 14% 18%, ${colorWithAlpha(primary, 0.28)} 0%, transparent 34%),
            radial-gradient(circle at 84% 80%, ${colorWithAlpha(secondary, 0.18)} 0%, transparent 30%),
            linear-gradient(145deg, ${NOIR} 0%, #15110d 52%, #080705 100%)
          `,
          color: PAPER,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "18px",
            display: "flex",
            borderRadius: "28px",
            border: `1px solid ${colorWithAlpha(PAPER, 0.18)}`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "34px",
            left: "46px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "17px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: colorWithAlpha(PAPER, 0.86),
            }}
          >
            Madamis Type Diagnosis
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: colorWithAlpha(PAPER, 0.46),
            }}
          >
            X Share Card / Character-First OGP
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            gap: "28px",
            paddingTop: "54px",
          }}
        >
          <div
            style={{
              width: "44%",
              height: "100%",
              display: "flex",
              position: "relative",
              overflow: "hidden",
              borderRadius: "28px",
              border: `1px solid ${colorWithAlpha(PAPER, 0.14)}`,
              background: `
                linear-gradient(180deg, ${colorWithAlpha(PAPER, 0.08)} 0%, ${colorWithAlpha(NOIR, 0.12)} 100%),
                radial-gradient(circle at 50% 16%, ${colorWithAlpha(accent, 0.18)} 0%, transparent 48%)
              `,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "18px",
                display: "flex",
                borderRadius: "20px",
                border: `1px solid ${colorWithAlpha(primary, 0.28)}`,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "22px",
                left: "22px",
                display: "flex",
                borderRadius: "999px",
                border: `1px solid ${colorWithAlpha(PAPER, 0.12)}`,
                background: colorWithAlpha(NOIR, 0.42),
                padding: "8px 14px",
                fontSize: "15px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: colorWithAlpha(PAPER, 0.88),
              }}
            >
              Character Visual
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "22px",
                display: "flex",
                fontSize: "128px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                lineHeight: 1,
                color: colorWithAlpha(PAPER, 0.08),
              }}
            >
              {typeData.typeCode}
            </div>

            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                padding: "52px 28px 16px",
                position: "relative",
              }}
            >
              {imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageSrc}
                  alt=""
                  width="528"
                  height="528"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    objectPosition: "center bottom",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    gap: "10px",
                    padding: "26px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontSize: "82px",
                      lineHeight: 1,
                      letterSpacing: "0.08em",
                      color: colorWithAlpha(PAPER, 0.84),
                    }}
                  >
                    {typeData.typeCode}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: "18px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: colorWithAlpha(PAPER, 0.52),
                    }}
                  >
                    Character Visual Pending
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              width: "56%",
              height: "100%",
              display: "flex",
              position: "relative",
              overflow: "hidden",
              borderRadius: "32px",
              background: `linear-gradient(180deg, ${PAPER} 0%, ${PAPER_DARK} 100%)`,
              color: INK,
              boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "12px",
                display: "flex",
                borderRadius: "24px",
                border: `1px solid ${colorWithAlpha(INK, 0.14)}`,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "34px",
                top: "26px",
                bottom: "26px",
                display: "flex",
                width: "1px",
                background: colorWithAlpha(RED, 0.24),
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "36px",
                left: "48px",
                right: "48px",
                display: "flex",
                height: "6px",
                borderRadius: "999px",
                background: `linear-gradient(90deg, ${primary} 0%, ${secondary} 60%, ${accent} 100%)`,
                opacity: 0.78,
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "34px",
                right: "34px",
                display: "flex",
                transform: "rotate(-8deg)",
                border: `3px solid ${colorWithAlpha(RED, 0.82)}`,
                borderRadius: "14px",
                color: RED,
                padding: "9px 16px 7px",
                fontSize: "22px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              Type File
            </div>

            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "74px 48px 42px 78px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: "16px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: colorWithAlpha(INK, 0.68),
                  }}
                >
                  Archived Character Profile
                </div>

                <div
                  style={{
                    display: "flex",
                    maxWidth: "88%",
                    fontSize: `${typeNameFontSize}px`,
                    lineHeight: 1.04,
                    color: INK,
                  }}
                >
                  {typeData.typeName}
                </div>
              </div>

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
                    width: "96px",
                    height: "2px",
                    background: colorWithAlpha(INK, 0.16),
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "999px",
                      background: INK,
                      color: AMBER,
                      padding: "12px 20px 10px",
                      fontSize: "30px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                    }}
                  >
                    {typeData.typeCode}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      fontSize: "18px",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: colorWithAlpha(INK, 0.56),
                    }}
                  >
                    Madamis Type Diagnosis
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
