import { useMemo, useState } from "react";
import type { NutKhuVuc, TaiSan, ViTriPin } from "../types";
import { chuoiDuongDan } from "../logic/treeModel";
import {
  diDoiLo,
  taiSanCoViTri,
  taiSanTrongNut,
  catLyDo,
  MAX_LY_DO,
  type KetQuaDiDoi,
} from "./diDoiService";

interface Props {
  nodes: NutKhuVuc[];
  taiSan: TaiSan[];
  pins: ViTriPin[];
  taiSanDangKhoa?: Set<string>;
  /** Có giá trị = di dời ĐƠN (mở từ popup pin), ẩn bộ chọn nguồn. */
  taiSanDon?: string;
  nguoi: string;
  now?: () => string;
  onXong: (kq: KetQuaDiDoi) => void;
  onDong: () => void;
}

type CheDoNguon = "le" | "vi-tri-cu";

/** Form di dời tài sản (S04, F12/F13) — đơn & hàng loạt, chọn lẻ hoặc cả vị trí cũ. */
export function DiDoiForm({
  nodes, taiSan, pins, taiSanDangKhoa = new Set(), taiSanDon, nguoi,
  now = () => "2026-06-23T14:30:00Z", onXong, onDong,
}: Props) {
  const laDon = !!taiSanDon;
  const [cheDo, setCheDo] = useState<CheDoNguon>("le");
  const [chon, setChon] = useState<string[]>(taiSanDon ? [taiSanDon] : []);
  const [nutNguon, setNutNguon] = useState<string | null>(null);
  const [maNutDich, setMaNutDich] = useState<string | null>(null);
  const [lyDo, setLyDo] = useState("");
  const [hoiKhoa, setHoiKhoa] = useState<string[] | null>(null);

  const dsCoViTri = useMemo(() => taiSanCoViTri(taiSan, pins), [taiSan, pins]);
  const nguonRong = cheDo === "vi-tri-cu" && nutNguon !== null && taiSanTrongNut(pins, nutNguon).length === 0;

  // Tài sản trong lô: đơn = cố định; hàng loạt lẻ = tick; cả vị trí cũ = lấy hết trong nút.
  const lo = useMemo(() => {
    if (laDon) return [taiSanDon!];
    if (cheDo === "vi-tri-cu") return nutNguon ? taiSanTrongNut(pins, nutNguon) : [];
    return chon;
  }, [laDon, taiSanDon, cheDo, nutNguon, pins, chon]);

  const soChon = lo.length;
  const coTheDiDoi = soChon > 0 && !!maNutDich;

  function thucHien(boQuaKhoa = false) {
    const kq = diDoiLo({
      pins, maTaiSans: lo, maNutDich, nguoi, thoiDiem: now(), lyDo, taiSanDangKhoa, boQuaKhoa,
    });
    if (kq.canHoiKhoa) {
      setHoiKhoa(kq.canHoiKhoa);
      return;
    }
    setHoiKhoa(null);
    onXong(kq);
  }

  function toggle(maTaiSan: string) {
    setChon((c) => (c.includes(maTaiSan) ? c.filter((m) => m !== maTaiSan) : [...c, maTaiSan]));
  }

  return (
    <div className="lop-noi" role="dialog" aria-label="Di dời tài sản">
      <div className="di-doi-form">
        <h2>Di dời tài sản</h2>

        {!laDon && (
          <div className="che-do-nguon" role="radiogroup" aria-label="Cách lấy nguồn">
            <label>
              <input type="radio" checked={cheDo === "le"} onChange={() => setCheDo("le")} /> Chọn tài sản lẻ
            </label>
            <label>
              <input type="radio" checked={cheDo === "vi-tri-cu"} onChange={() => setCheDo("vi-tri-cu")} /> Chọn cả vị trí cũ (lấy hết)
            </label>
          </div>
        )}

        {!laDon && cheDo === "le" && (
          <ul className="ds-tai-san" role="listbox" aria-label="Tài sản đã có vị trí">
            {dsCoViTri.map((t) => {
              const khoa = taiSanDangKhoa.has(t.maTaiSan);
              return (
                <li key={t.maTaiSan}>
                  <label>
                    <input
                      type="checkbox"
                      checked={chon.includes(t.maTaiSan)}
                      disabled={khoa}
                      onChange={() => toggle(t.maTaiSan)}
                    />
                    {t.maTaiSan} · {t.ten}
                    {khoa && <span className="nhan-khoa"> 🔒 đang được người khác chỉnh sửa</span>}
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {!laDon && cheDo === "vi-tri-cu" && (
          <label>
            Vị trí nguồn
            <select aria-label="Vị trí nguồn" value={nutNguon ?? ""} onChange={(e) => setNutNguon(e.target.value || null)}>
              <option value="">(Chọn khu vực nguồn)</option>
              {nodes.map((n) => (
                <option key={n.maNut} value={n.maNut}>{chuoiDuongDan(nodes, n.maNut)}</option>
              ))}
            </select>
          </label>
        )}

        {nguonRong && <p className="loi-field" role="alert">Vị trí này không có tài sản để di dời.</p>}

        <p className="bo-dem-chon" aria-live="polite">{soChon} tài sản đã chọn</p>

        <label>
          Khu vực đích *
          <select aria-label="Khu vực đích" value={maNutDich ?? ""} onChange={(e) => setMaNutDich(e.target.value || null)}>
            <option value="">(Chọn khu vực đích)</option>
            {nodes.map((n) => (
              <option key={n.maNut} value={n.maNut}>{chuoiDuongDan(nodes, n.maNut)}</option>
            ))}
          </select>
        </label>

        <label>
          Lý do (tùy chọn)
          <textarea
            aria-label="Lý do di dời"
            value={lyDo}
            maxLength={MAX_LY_DO}
            onChange={(e) => setLyDo(catLyDo(e.target.value))}
          />
        </label>
        <p className="bo-dem-ky-tu">{lyDo.length}/{MAX_LY_DO}</p>

        {soChon === 0 && !laDon && cheDo === "le" && (
          <p className="goi-y-chon">Chọn ít nhất một tài sản để di dời.</p>
        )}

        <div className="form-nut">
          <button onClick={onDong}>Hủy</button>
          <button className="cta" disabled={!coTheDiDoi} onClick={() => thucHien(false)}>
            Di dời ({soChon})
          </button>
        </div>
      </div>

      {hoiKhoa && (
        <div className="lop-noi" role="dialog" aria-label="Tài sản bị khóa">
          <div className="xoa-dialog">
            <p>
              {hoiKhoa.length} tài sản đang bị khóa. Bỏ qua và tiếp tục với {soChon - hoiKhoa.length} tài sản còn lại?
            </p>
            <div className="xoa-nut">
              <button onClick={() => { setHoiKhoa(null); onDong(); }}>Hủy</button>
              <button className="cta" onClick={() => thucHien(true)}>Tiếp tục</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
