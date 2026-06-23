// Ảnh sơ đồ mặt bằng MẪU — SVG data-URI tự chứa (không cần file ngoài).
// Dùng cho dữ liệu mẫu và làm fallback khi ảnh thật không tải được.

function svgDataUri(tieuDe: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="#eef2f7"/>
  <g stroke="#cdd6e2" stroke-width="1">
    ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 50}" y1="0" x2="${i * 50}" y2="800"/>`).join("")}
    ${Array.from({ length: 16 }, (_, i) => `<line x1="0" y1="${i * 50}" x2="1200" y2="${i * 50}"/>`).join("")}
  </g>
  <g fill="none" stroke="#9aa8bd" stroke-width="4">
    <rect x="60" y="60" width="480" height="320" rx="6"/>
    <rect x="600" y="60" width="540" height="320" rx="6"/>
    <rect x="60" y="440" width="700" height="300" rx="6"/>
    <rect x="820" y="440" width="320" height="300" rx="6"/>
  </g>
  <g fill="#5a6573" font-family="system-ui, sans-serif" font-size="22">
    <text x="80" y="100">Khu A</text>
    <text x="620" y="100">Khu B</text>
    <text x="80" y="480">Khu C</text>
    <text x="840" y="480">Kho</text>
  </g>
  <text x="600" y="770" fill="#8a94a6" font-family="system-ui, sans-serif" font-size="20" text-anchor="middle">${tieuDe}</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Ảnh sơ đồ mẫu dùng chung cho dữ liệu mẫu. */
export const SO_DO_MAU = svgDataUri("Sơ đồ mặt bằng (mẫu)");

/** Ảnh fallback khi ảnh thật lỗi tải. */
export const SO_DO_FALLBACK = svgDataUri("Chưa tải được ảnh — hiển thị sơ đồ mẫu");
