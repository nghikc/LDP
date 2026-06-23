import type { NutKhuVuc, ViTriPin } from "./types";
import { chuoiDuongDan } from "./logic/treeModel";
import { gomCumPin, gomTheoViTri, NGUONG_GOM_CUM } from "./logic/clustering";
import { SO_DO_FALLBACK } from "./soDoPlaceholder";

interface Props {
  nodes: NutKhuVuc[];
  nutChon: NutKhuVuc | null;
  pins: ViTriPin[];
  pinLamNoi?: string | null; // mã tài sản đang được làm nổi (pulse)
  onClickTrong: (x: number, y: number) => void;
  /** Click một vị trí → trả danh sách mã tài sản + tọa độ vị trí đó. */
  onClickViTri: (maTaiSans: string[], x: number, y: number) => void;
  /** Tên đặt cho một vị trí (nếu có) theo tọa độ. */
  tenViTri?: (x: number, y: number) => string | undefined;
}

/** Khung sơ đồ mặt bằng: ảnh + pin theo tọa độ %, breadcrumb, states (F09, R-S01-02/04). */
export function FloorPlanCanvas({ nodes, nutChon, pins, pinLamNoi, onClickTrong, onClickViTri, tenViTri }: Props) {
  if (!nutChon) {
    return (
      <section className="canvas" aria-label="Sơ đồ mặt bằng">
        <p className="canvas-trong">Chọn một khu vực để xem sơ đồ.</p>
      </section>
    );
  }

  const breadcrumb = chuoiDuongDan(nodes, nutChon.maNut);

  if (!nutChon.soDoUrl) {
    return (
      <section className="canvas" aria-label="Sơ đồ mặt bằng">
        <nav className="breadcrumb" aria-label="Đường dẫn khu vực">
          {breadcrumb}
        </nav>
        <div className="canvas-trong" data-testid="chua-co-so-do">
          <p>Chưa có sơ đồ</p>
          <button className="cta">Tải ảnh sơ đồ</button>
        </div>
      </section>
    );
  }

  // Khi quá đông (>500) thì gom cụm theo lân cận; bình thường gom theo đúng vị trí (nhiều tài sản/1 vị trí).
  const dongPin = pins.length > NGUONG_GOM_CUM;
  const cum = dongPin
    ? gomCumPin(pins).map((c) => ({ toaDoX: c.toaDoX, toaDoY: c.toaDoY, pins: c.pins }))
    : gomTheoViTri(pins);

  return (
    <section className="canvas" aria-label="Sơ đồ mặt bằng">
      <nav className="breadcrumb" aria-label="Đường dẫn khu vực">
        {breadcrumb}
      </nav>
      <div
        className="canvas-anh"
        data-testid="khung-so-do"
        role="application"
        aria-label={`Sơ đồ ${nutChon.tenKhuVuc}`}
        onClick={(e) => {
          const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          onClickTrong(x, y);
        }}
      >
        <img
          src={nutChon.soDoUrl}
          alt={`Sơ đồ ${nutChon.tenKhuVuc}`}
          className="anh-so-do"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== SO_DO_FALLBACK) img.src = SO_DO_FALLBACK;
          }}
        />
        {cum.map((c, i) => {
          const dsMa = c.pins.map((p) => p.maTaiSan);
          const lamNoi = !!pinLamNoi && dsMa.includes(pinLamNoi);
          const nhieu = c.pins.length > 1;
          const ten = tenViTri?.(c.toaDoX, c.toaDoY);
          // Nhãn nhất quán: tên vị trí (nếu đặt) → mã tài sản (nếu 1) → "N tài sản".
          const nhan = ten ?? (nhieu ? `${c.pins.length} tài sản` : c.pins[0].maTaiSan);
          const moTa = ten ? `Vị trí ${ten}` : nhieu ? `Vị trí ${c.pins.length} tài sản` : `Tài sản ${c.pins[0].maTaiSan}`;
          return (
            <button
              key={nhieu ? `vt-${i}` : c.pins[0].maTaiSan}
              className={`pin pin-${c.pins[0].trangThai} ${lamNoi ? "pin-lam-noi" : ""} ${nhieu ? "pin-cum" : ""}`}
              style={{ left: `${c.toaDoX}%`, top: `${c.toaDoY}%` }}
              aria-label={moTa}
              data-trangthai={c.pins[0].trangThai}
              onClick={(e) => {
                e.stopPropagation();
                onClickViTri(dsMa, c.toaDoX, c.toaDoY);
              }}
            >
              <span className="pin-cham" aria-hidden="true">{c.pins.length}</span>
              <span className="pin-nhan">{nhan}</span>
            </button>
          );
        })}
        <div className="chu-thich-mau" onClick={(e) => e.stopPropagation()} aria-label="Chú thích màu vị trí">
          <span><i className="ct-cham ct-binhthuong" /> Bình thường</span>
          <span><i className="ct-cham ct-khoa" /> Đang khóa</span>
          <span><i className="ct-cham ct-datlai" /> Cần đặt lại</span>
        </div>
      </div>
    </section>
  );
}
