import { useMemo, useState } from "react";
import type { VaiTro } from "../types";
import {
  duocXemAudit, locAudit, sapXep, phanTrang, nhanViTri, validateKhoangAudit, validateTuKhoa,
  KICH_THUOC_TRANG, MAX_TU_KHOA,
  type BanGhiAudit, type BoLocAudit, type LoaiHanhDong,
} from "./auditService";
import { dinhDangThoiDiem } from "../lich-su/lichSuService";

interface Props {
  vaiTro: VaiTro;
  banGhi: BanGhiAudit[];
  trangThaiTai?: "ok" | "loi";
  onThuLai?: () => void;
  onDong: () => void;
}

const HANH_DONG: LoaiHanhDong[] = ["Gán", "Di dời", "Xóa"];

/** S07 — Màn nhật ký kiểm toán (chỉ đọc, chỉ Quản trị). */
export function NhatKyPanel({ vaiTro, banGhi, trangThaiTai = "ok", onThuLai, onDong }: Props) {
  const [nguoi, setNguoi] = useState("");
  const [hanhDong, setHanhDong] = useState<LoaiHanhDong | "">("");
  const [tuNgay, setTuNgay] = useState("");
  const [denNgay, setDenNgay] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");
  const [loc, setLoc] = useState<BoLocAudit>({});
  const [trang, setTrang] = useState(1);
  const [chieu, setChieu] = useState<"desc" | "asc">("desc");

  const loiNgay = validateKhoangAudit(tuNgay || undefined, denNgay || undefined);
  const loiTuKhoa = validateTuKhoa(tuKhoa);
  const apDungDuoc = !loiNgay && !loiTuKhoa;

  const ketQua = useMemo(() => sapXep(locAudit(banGhi, loc), chieu), [banGhi, loc, chieu]);
  const tr = useMemo(() => phanTrang(ketQua, trang), [ketQua, trang]);

  if (!duocXemAudit(vaiTro)) {
    return (
      <aside className="panel" role="dialog" aria-label="Từ chối truy cập">
        <p>Bạn không có quyền xem nhật ký kiểm toán. Khu vực này chỉ dành cho vai trò Quản trị.</p>
        <button aria-label="Quay lại Bản đồ tài sản" onClick={onDong}>← Bản đồ tài sản</button>
      </aside>
    );
  }

  function apDungLoc() {
    if (!apDungDuoc) return;
    setLoc({
      nguoi: nguoi || undefined,
      hanhDong: hanhDong || undefined,
      tuNgay: tuNgay || undefined,
      denNgay: denNgay || undefined,
      tuKhoa: tuKhoa || undefined,
    });
    setTrang(1);
  }

  function xoaLoc() {
    setNguoi(""); setHanhDong(""); setTuNgay(""); setDenNgay(""); setTuKhoa("");
    setLoc({}); setTrang(1);
  }

  const dsNguoi = [...new Set(banGhi.map((r) => r.nguoi))];

  return (
    <aside className="panel nhat-ky-panel" role="dialog" aria-label="Nhật ký kiểm toán">
      <header className="panel-header">
        <button aria-label="Quay lại Bản đồ tài sản" onClick={onDong}>← Bản đồ tài sản</button>
        <h2>Nhật ký kiểm toán</h2>
      </header>

      <div className="panel-loc" aria-label="Bộ lọc">
        <label>Người
          <select aria-label="Lọc người" value={nguoi} onChange={(e) => setNguoi(e.target.value)}>
            <option value="">Tất cả</option>
            {dsNguoi.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>Hành động
          <select aria-label="Lọc hành động" value={hanhDong} onChange={(e) => setHanhDong(e.target.value as LoaiHanhDong | "")}>
            <option value="">Tất cả</option>
            {HANH_DONG.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </label>
        <label>Từ ngày<input aria-label="Từ ngày" type="date" value={tuNgay} onChange={(e) => setTuNgay(e.target.value)} /></label>
        <label>Đến ngày<input aria-label="Đến ngày" type="date" value={denNgay} onChange={(e) => setDenNgay(e.target.value)} /></label>
        <label>Đối tượng<input aria-label="Lọc đối tượng" maxLength={MAX_TU_KHOA} value={tuKhoa} onChange={(e) => setTuKhoa(e.target.value)} /></label>
        <button onClick={apDungLoc} disabled={!apDungDuoc}>Áp dụng lọc</button>
        <button onClick={xoaLoc}>Xóa lọc</button>
        {loiNgay && <p className="loi-field" role="alert">{loiNgay}</p>}
        {loiTuKhoa && <p className="loi-field" role="alert">{loiTuKhoa}</p>}
      </div>

      {trangThaiTai === "loi" ? (
        <div className="panel-loi">
          <p>Không tải được nhật ký. Vui lòng thử lại.</p>
          <button onClick={onThuLai}>Thử lại</button>
        </div>
      ) : tr.total === 0 ? (
        <p className="panel-trong">Không có bản ghi phù hợp.</p>
      ) : (
        <>
          <p className="phan-trang-label" aria-live="polite">
            Hiển thị {tr.tu}–{tr.den} / {tr.total} bản ghi.
          </p>
          <table className="bang-audit">
            <thead>
              <tr>
                <th aria-sort={chieu === "desc" ? "descending" : "ascending"}>
                  <button onClick={() => setChieu((c) => (c === "desc" ? "asc" : "desc"))}>
                    Thời điểm {chieu === "desc" ? "↓" : "↑"}
                  </button>
                </th>
                <th>Người</th><th>Hành động</th><th>Đối tượng</th><th>Vị trí cũ→mới</th>
              </tr>
            </thead>
            <tbody>
              {tr.items.map((r, i) => (
                <tr key={i}>
                  <td>{dinhDangThoiDiem(r.thoiDiem)}</td>
                  <td>{r.nguoi}</td>
                  <td><span className={`badge badge-${r.hanhDong === "Di dời" ? "didoi" : r.hanhDong === "Xóa" ? "xoa" : "gan"}`}>{r.hanhDong}</span></td>
                  <td>{r.doiTuong}</td>
                  <td>{nhanViTri(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {tr.soTrang > 1 && (
            <nav className="phan-trang" aria-label="Phân trang">
              <button disabled={trang <= 1} onClick={() => setTrang((t) => t - 1)}>Trước</button>
              <span>Trang {trang}/{tr.soTrang}</span>
              <button disabled={trang >= tr.soTrang} onClick={() => setTrang((t) => t + 1)}>Sau</button>
            </nav>
          )}
        </>
      )}
    </aside>
  );
}

export { KICH_THUOC_TRANG };
