import { useMemo, useRef, useState } from "react";
import { chuoiDuongDan } from "../logic/treeModel";
import {
  tinhPhamVi,
  uocTinhSoDong,
  chuoiUocTinh,
  dungBangBaoCao,
  sinhNoiDungFile,
  taoBlobBaoCao,
  chuoiThanhCong,
  chuanHoaCot,
  COT_CHUAN,
  COT_MAC_DINH,
  THONG_BAO_RONG,
  TEN_FILE_MAC_DINH,
  type NguonDuLieu,
  type CauHinhPhamVi,
  type LoaiPhamVi,
  type KhoaCot,
} from "./xuatBaoCaoService";
import "./xuatBaoCao.css";

interface Props {
  nguon: NguonDuLieu;
  /** Nút khu vực đang chọn ở S01 (null = không có) — quyết định mặc định phạm vi. */
  maNutDangChon?: string | null;
  /** Mã tài sản khớp bộ lọc S01 hiện tại (cho phạm vi "theo bộ lọc"). */
  maTaiSanLoc?: string[];
  /** Đóng modal, fade về S01 (R-S08-08). */
  onDong: () => void;
  /**
   * Tải file về máy. Mặc định dùng URL.createObjectURL + thẻ <a>.
   * Cho phép inject trong test.
   */
  onTaiFile?: (blob: Blob, tenFile: string) => void;
}

function taiFileMacDinh(blob: Blob, tenFile: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = tenFile;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** S08 — Modal Xuất báo cáo / kiểm kê: chọn phạm vi + cột, ước tính số dòng, xuất file. */
export function XuatBaoCaoModal({
  nguon,
  maNutDangChon = null,
  maTaiSanLoc = [],
  onDong,
  onTaiFile = taiFileMacDinh,
}: Props) {
  const coNutDangChon = !!maNutDangChon;
  const [loaiPhamVi, setLoaiPhamVi] = useState<LoaiPhamVi>(
    coNutDangChon ? "theo_khu_vuc" : "toan_bo",
  );
  const [gomKhuCon, setGomKhuCon] = useState(true);
  const [cotChon, setCotChon] = useState<KhoaCot[]>(COT_MAC_DINH);
  const [thongBaoThanhCong, setThongBaoThanhCong] = useState<string | null>(null);
  const [dangDong, setDangDong] = useState(false);
  const nhomPhamViRef = useRef<HTMLFieldSetElement>(null);

  const cauHinh: CauHinhPhamVi = useMemo(
    () => ({
      loai: loaiPhamVi,
      maNut: maNutDangChon,
      gomKhuCon,
      maTaiSanLoc,
    }),
    [loaiPhamVi, maNutDangChon, gomKhuCon, maTaiSanLoc],
  );

  const soDong = useMemo(() => uocTinhSoDong(nguon, cauHinh), [nguon, cauHinh]);
  const cotHopLe = chuanHoaCot(cotChon);
  const rong = soDong === 0;
  const coTheXuat = !rong && cotHopLe.length > 0 && !thongBaoThanhCong;

  function dongMuot() {
    setDangDong(true);
    window.setTimeout(onDong, 150);
  }

  function toggleCot(khoa: KhoaCot) {
    setCotChon((c) => (c.includes(khoa) ? c.filter((k) => k !== khoa) : [...c, khoa]));
  }

  function xuat() {
    const ds = tinhPhamVi(nguon, cauHinh);
    if (ds.length === 0 || cotHopLe.length === 0) return;
    const bang = dungBangBaoCao(ds, cotHopLe, nguon);
    const blob = taoBlobBaoCao(sinhNoiDungFile(bang));
    onTaiFile(blob, TEN_FILE_MAC_DINH);
    setThongBaoThanhCong(`${chuoiThanhCong(ds.length)}. (${TEN_FILE_MAC_DINH})`);
  }

  function doiPhamVi() {
    // CTA "Đổi phạm vi" từ trạng thái rỗng → focus về nhóm Phạm vi (TC-S08-22).
    nhomPhamViRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  }

  return (
    <div
      className={`xbc-lop-nen${dangDong ? " xbc-dong" : ""}`}
      onClick={dongMuot}
    >
      <div
        className="xbc-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Xuất báo cáo / kiểm kê"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Xuất báo cáo / kiểm kê</h2>

        <fieldset className="xbc-nhom" ref={nhomPhamViRef} aria-label="Phạm vi xuất">
          <legend>Phạm vi xuất</legend>

          <label>
            <input
              type="radio"
              name="xbc-pham-vi"
              checked={loaiPhamVi === "toan_bo"}
              onChange={() => setLoaiPhamVi("toan_bo")}
            />
            Toàn bộ tài sản
          </label>

          <label className={coNutDangChon ? "" : "xbc-khoa"}>
            <input
              type="radio"
              name="xbc-pham-vi"
              disabled={!coNutDangChon}
              checked={loaiPhamVi === "theo_khu_vuc"}
              onChange={() => setLoaiPhamVi("theo_khu_vuc")}
            />
            Theo khu vực đang chọn
          </label>
          {loaiPhamVi === "theo_khu_vuc" && coNutDangChon && (
            <>
              <p className="xbc-breadcrumb">{chuoiDuongDan(nguon.nodes, maNutDangChon!)}</p>
              <label className="xbc-gom-con">
                <input
                  type="checkbox"
                  checked={gomKhuCon}
                  onChange={(e) => setGomKhuCon(e.target.checked)}
                />
                Gồm cả các khu vực con
              </label>
            </>
          )}

          <label>
            <input
              type="radio"
              name="xbc-pham-vi"
              checked={loaiPhamVi === "theo_bo_loc"}
              onChange={() => setLoaiPhamVi("theo_bo_loc")}
            />
            Theo bộ lọc hiện tại
          </label>
        </fieldset>

        <fieldset className="xbc-nhom" aria-label="Cột xuất">
          <legend>Cột xuất</legend>
          {COT_CHUAN.map((c) => (
            <label key={c.khoa}>
              <input
                type="checkbox"
                checked={cotChon.includes(c.khoa)}
                onChange={() => toggleCot(c.khoa)}
              />
              {c.nhan}
            </label>
          ))}
          {cotHopLe.length === 0 && (
            <p className="xbc-loi" role="alert">Chọn ít nhất một cột để xuất.</p>
          )}
        </fieldset>

        {rong ? (
          <div className="xbc-rong" role="status">
            <p>{THONG_BAO_RONG}</p>
            <button type="button" onClick={doiPhamVi}>Đổi phạm vi</button>
          </div>
        ) : (
          <p className="xbc-uoc-tinh" aria-live="polite">{chuoiUocTinh(soDong)}</p>
        )}

        {rong && (
          <p className="xbc-loi" role="note">Phạm vi không có dữ liệu</p>
        )}

        {thongBaoThanhCong && (
          <p className="xbc-thanh-cong" role="status">{thongBaoThanhCong}</p>
        )}

        <div className="xbc-nut">
          <button type="button" onClick={dongMuot}>Đóng</button>
          <button
            type="button"
            className="xbc-cta"
            disabled={!coTheXuat}
            title={rong ? "Phạm vi không có dữ liệu" : undefined}
            onClick={xuat}
          >
            Xuất Excel
          </button>
        </div>
      </div>
    </div>
  );
}
