import type { NutKhuVuc, ViTriPin } from "./types";
import { chuoiDuongDan } from "./logic/treeModel";
import { gomCumPin } from "./logic/clustering";

interface Props {
  nodes: NutKhuVuc[];
  nutChon: NutKhuVuc | null;
  pins: ViTriPin[];
  pinLamNoi?: string | null; // mã tài sản đang được làm nổi (pulse)
  onClickTrong: (x: number, y: number) => void;
  onClickPin: (maTaiSan: string) => void;
}

/** Khung sơ đồ mặt bằng: ảnh + pin theo tọa độ %, breadcrumb, states (F09, R-S01-02/04). */
export function FloorPlanCanvas({ nodes, nutChon, pins, pinLamNoi, onClickTrong, onClickPin }: Props) {
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

  const cum = gomCumPin(pins);

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
        <img src={nutChon.soDoUrl} alt={`Sơ đồ ${nutChon.tenKhuVuc}`} className="anh-so-do" />
        {cum.map((c, i) =>
          c.soLuong === 1 ? (
            <button
              key={c.pins[0].maTaiSan}
              className={`pin pin-${c.pins[0].trangThai} ${
                pinLamNoi === c.pins[0].maTaiSan ? "pin-lam-noi" : ""
              }`}
              style={{ left: `${c.toaDoX}%`, top: `${c.toaDoY}%` }}
              aria-label={`Tài sản ${c.pins[0].maTaiSan}`}
              data-trangthai={c.pins[0].trangThai}
              onClick={(e) => {
                e.stopPropagation();
                onClickPin(c.pins[0].maTaiSan);
              }}
            >
              📍
            </button>
          ) : (
            <span
              key={`cum-${i}`}
              className="cum-pin"
              style={{ left: `${c.toaDoX}%`, top: `${c.toaDoY}%` }}
              aria-label={`Cụm ${c.soLuong} tài sản`}
            >
              ⨁ {c.soLuong}
            </span>
          ),
        )}
      </div>
    </section>
  );
}
