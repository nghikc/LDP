import { useMemo, useState } from "react";
import {
  sapXepGiamDan, locTheoKhoang, validateKhoang, nhanViTriCu, nhanLyDo, dinhDangThoiDiem,
  type BanGhiLichSu,
} from "./lichSuService";

interface Props {
  maTaiSan: string;
  tenTaiSan: string;
  banGhi: BanGhiLichSu[];
  trangThaiTai?: "ok" | "loi";
  onThuLai?: () => void;
  onDong: () => void;
}

/** S06 — Panel lịch sử di chuyển (chỉ đọc, timeline mới-nhất-trên-cùng). */
export function LichSuPanel({ maTaiSan, tenTaiSan, banGhi, trangThaiTai = "ok", onThuLai, onDong }: Props) {
  const [tu, setTu] = useState("");
  const [den, setDen] = useState("");
  const [apDung, setApDung] = useState<{ tu: string; den: string } | null>(null);
  const [loiKhoang, setLoiKhoang] = useState<string | undefined>();

  const hienThi = useMemo(() => {
    const loc = apDung ? locTheoKhoang(banGhi, apDung.tu || undefined, apDung.den || undefined) : banGhi;
    return sapXepGiamDan(loc);
  }, [banGhi, apDung]);

  function apDungLoc() {
    const e = validateKhoang(tu || undefined, den || undefined);
    setLoiKhoang(e);
    if (!e) setApDung({ tu, den });
  }

  function xoaLoc() {
    setTu(""); setDen(""); setApDung(null); setLoiKhoang(undefined);
  }

  return (
    <aside className="panel lich-su-panel" role="dialog" aria-label="Lịch sử di chuyển">
      <header className="panel-header">
        <button aria-label="Quay lại Bản đồ tài sản" onClick={onDong}>←</button>
        <h2>{maTaiSan} · {tenTaiSan}</h2>
      </header>

      <div className="panel-loc">
        <label>Từ ngày<input type="date" value={tu} onChange={(e) => setTu(e.target.value)} /></label>
        <label>Đến ngày<input type="date" value={den} onChange={(e) => setDen(e.target.value)} /></label>
        <button onClick={apDungLoc}>Áp dụng</button>
        <button onClick={xoaLoc}>Xóa lọc</button>
        {loiKhoang && <p className="loi-field" role="alert">{loiKhoang}</p>}
      </div>

      {trangThaiTai === "loi" ? (
        <div className="panel-loi">
          <p>Không tải được lịch sử.</p>
          <button onClick={onThuLai}>Thử lại</button>
        </div>
      ) : banGhi.length === 0 ? (
        <div className="panel-trong">
          <p>Tài sản chưa có lần di chuyển nào.</p>
          <p className="phu">Mọi thay đổi vị trí sẽ được ghi lại và hiện ở đây.</p>
        </div>
      ) : hienThi.length === 0 ? (
        <div className="panel-trong">
          <p>Không có lần di chuyển nào trong khoảng đã chọn.</p>
          <button onClick={xoaLoc}>Xóa lọc</button>
        </div>
      ) : (
        <ol className="timeline" aria-label="Dòng thời gian di chuyển">
          {hienThi.map((b, i) => (
            <li key={i} className="timeline-muc">
              <time>{dinhDangThoiDiem(b.thoiDiem)}</time>
              <span className="tl-nguoi">{b.nguoi}</span>
              <span className="tl-vitri">{nhanViTriCu(b)} → {b.viTriMoi}</span>
              <span className="tl-lydo">{nhanLyDo(b)}</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
