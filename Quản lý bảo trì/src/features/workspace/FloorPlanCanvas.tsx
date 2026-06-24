import { useEffect, useRef, useState } from "react";
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
  /** Kéo-thả vị trí sang tọa độ mới trong cùng sơ đồ. */
  onDiChuyenViTri?: (maTaiSans: string[], xCu: number, yCu: number, xMoi: number, yMoi: number) => void;
}

interface TrangThaiKeo { maTaiSans: string[]; xCu: number; yCu: number; x: number; y: number; moved: boolean; }

const kep = (v: number) => Math.min(100, Math.max(0, v));

/** Khung sơ đồ mặt bằng: ảnh + pin theo tọa độ %, breadcrumb, states (F09, R-S01-02/04). */
export function FloorPlanCanvas({ nodes, nutChon, pins, pinLamNoi, onClickTrong, onClickViTri, tenViTri, onDiChuyenViTri }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const vuaKeoRef = useRef(false);
  const [keo, setKeo] = useState<TrangThaiKeo | null>(null);
  // Tỉ lệ khung của ảnh thật → hộp chứa khớp tỉ lệ ảnh, pin định vị theo hộp (dính đúng điểm khi co giãn).
  const [tyLeAnh, setTyLeAnh] = useState("3 / 2");

  useEffect(() => {
    if (!keo) return;
    function di(e: MouseEvent) {
      const r = canvasRef.current?.getBoundingClientRect();
      if (!r || !r.width || !r.height) return;
      const x = kep(((e.clientX - r.left) / r.width) * 100);
      const y = kep(((e.clientY - r.top) / r.height) * 100);
      setKeo((k) => (k ? { ...k, x, y, moved: k.moved || Math.abs(x - k.xCu) > 0.5 || Math.abs(y - k.yCu) > 0.5 } : k));
    }
    function tha() {
      setKeo((k) => {
        if (k && k.moved && onDiChuyenViTri) {
          vuaKeoRef.current = true; // chặn click mở popup ngay sau khi kéo
          onDiChuyenViTri(k.maTaiSans, k.xCu, k.yCu, k.x, k.y);
        }
        return null;
      });
    }
    window.addEventListener("mousemove", di);
    window.addEventListener("mouseup", tha);
    return () => {
      window.removeEventListener("mousemove", di);
      window.removeEventListener("mouseup", tha);
    };
  }, [keo !== null, onDiChuyenViTri]);

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
      <div className="canvas-anh">
       <div
        ref={canvasRef}
        className="so-do-box"
        data-testid="khung-so-do"
        role="application"
        aria-label={`Sơ đồ ${nutChon.tenKhuVuc}`}
        style={{ aspectRatio: tyLeAnh }}
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
          onLoad={(e) => {
            const im = e.currentTarget;
            if (im.naturalWidth && im.naturalHeight) setTyLeAnh(`${im.naturalWidth} / ${im.naturalHeight}`);
          }}
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
          const dangKeo = keo && keo.xCu === c.toaDoX && keo.yCu === c.toaDoY;
          const x = dangKeo ? keo!.x : c.toaDoX;
          const y = dangKeo ? keo!.y : c.toaDoY;
          return (
            <button
              key={nhieu ? `vt-${i}` : c.pins[0].maTaiSan}
              className={`pin pin-${c.pins[0].trangThai} ${lamNoi ? "pin-lam-noi" : ""} ${nhieu ? "pin-cum" : ""} ${dangKeo ? "pin-dang-keo" : ""} ${onDiChuyenViTri ? "pin-keo-duoc" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={moTa}
              data-trangthai={c.pins[0].trangThai}
              onMouseDown={(e) => {
                if (!onDiChuyenViTri || e.button !== 0) return;
                e.stopPropagation();
                setKeo({ maTaiSans: dsMa, xCu: c.toaDoX, yCu: c.toaDoY, x: c.toaDoX, y: c.toaDoY, moved: false });
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (vuaKeoRef.current) { vuaKeoRef.current = false; return; } // vừa kéo xong → không mở popup
                onClickViTri(dsMa, c.toaDoX, c.toaDoY);
              }}
            >
              <span className="pin-cham" aria-hidden="true">{c.pins.length}</span>
              <span className="pin-nhan">{nhan}</span>
            </button>
          );
        })}
       </div>
        <div className="chu-thich-mau" onClick={(e) => e.stopPropagation()} aria-label="Chú thích màu vị trí">
          <span><i className="ct-cham ct-binhthuong" /> Bình thường</span>
          <span><i className="ct-cham ct-khoa" /> Đang khóa</span>
          <span><i className="ct-cham ct-datlai" /> Cần đặt lại</span>
        </div>
      </div>
    </section>
  );
}
