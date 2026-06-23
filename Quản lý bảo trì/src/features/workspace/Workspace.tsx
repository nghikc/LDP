import { useMemo, useState } from "react";
import { useWorkspace } from "./useWorkspace";
import { AreaTree } from "./AreaTree";
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { timTaiSan } from "./logic/search";
import { taiSanChuaCoViTri } from "./logic/assign";
import { wordingXacNhanXoa } from "./logic/remove";
import { locPinTheoTrangThai } from "./logic/clustering";
import { chuoiDuongDan } from "./logic/treeModel";
import type { TrangThaiPin, VaiTro } from "./types";
import { FormKhuVuc } from "./form-khu-vuc/FormKhuVuc";
import { DiDoiForm } from "./di-doi/DiDoiForm";
import { LichSuPanel } from "./lich-su/LichSuPanel";
import { NhatKyPanel } from "./nhat-ky/NhatKyPanel";
import type { BanGhiAudit, LoaiHanhDong } from "./nhat-ky/auditService";
import { QuanLySoDoModal } from "./quan-ly-so-do/QuanLySoDoModal";
import type { SoDoMatBang } from "./quan-ly-so-do/quanLySoDoService";
import { PinCanDatLaiPanel } from "./pin-can-dat-lai/PinCanDatLaiPanel";
import type { PinCanDatLai } from "./pin-can-dat-lai/pinCanDatLaiService";
import { XuatBaoCaoModal } from "./xuat-bao-cao/XuatBaoCaoModal";
import { SO_DO_MAU } from "./soDoPlaceholder";
import "./workspace.css";

interface DraftGan { x: number; y: number; maTaiSan: string | null; }
interface FormKVState { nutSua?: string; nutChaMacDinh?: string | null; }

const NHAN_HANH_DONG_AUDIT: Record<string, LoaiHanhDong> = {
  "gan-vi-tri": "Gán",
  "di-doi": "Di dời",
  "go-vi-tri": "Xóa",
  "xoa-khu-vuc": "Xóa",
};

export function Workspace({ vaiTro: vaiTroProp }: { vaiTro?: VaiTro } = {}) {
  const ws = useWorkspace(vaiTroProp ?? "QuanTri");
  const { nodes, taiSan, pins, vaiTro } = ws;

  const [nutChon, setNutChon] = useState<string | null>(null);
  const [tuKhoa, setTuKhoa] = useState("");
  const [pinLamNoi, setPinLamNoi] = useState<string | null>(null);
  const [thongBaoTraCuu, setThongBaoTraCuu] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftGan | null>(null);
  const [pinPopup, setPinPopup] = useState<string | null>(null);
  const [goConfirm, setGoConfirm] = useState<string | null>(null);
  const [xoaDialog, setXoaDialog] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [locPin, setLocPin] = useState<TrangThaiPin | "tat-ca">("tat-ca");

  // Vệ tinh
  const [formKV, setFormKV] = useState<FormKVState | null>(null);
  const [soDoNut, setSoDoNut] = useState<string | null>(null);
  const [diDoi, setDiDoi] = useState<{ taiSanDon?: string } | null>(null);
  const [lichSuCua, setLichSuCua] = useState<{ ma: string; ten: string } | null>(null);
  const [moS05, setMoS05] = useState(false);
  const [moS07, setMoS07] = useState(false);
  const [moS08, setMoS08] = useState(false);
  const [pinDangRoi, setPinDangRoi] = useState<string | null>(null);

  const nodeChon = useMemo(() => nodes.find((n) => n.maNut === nutChon) ?? null, [nodes, nutChon]);
  const goiY = useMemo(() => (tuKhoa ? timTaiSan(taiSan, tuKhoa) : []), [taiSan, tuKhoa]);
  const taiSanGanDuoc = useMemo(() => taiSanChuaCoViTri(taiSan, pins), [taiSan, pins]);
  const pinTrongNut = useMemo(() => {
    const cua = pins.filter((p) => p.maNut === nutChon);
    return locPin === "tat-ca" ? cua : locPinTheoTrangThai(cua, locPin);
  }, [pins, nutChon, locPin]);

  const banGhiAudit: BanGhiAudit[] = useMemo(
    () => ws.auditLog.map((a) => ({
      thoiDiem: a.thoiDiem,
      nguoi: a.nguoiThucHien,
      hanhDong: NHAN_HANH_DONG_AUDIT[a.hanhDong] ?? "Gán",
      doiTuong: a.doiTuong,
      viTriCu: a.viTriCu,
      viTriMoi: a.viTriMoi,
    })),
    [ws.auditLog],
  );

  const dsPinCanDatLai: PinCanDatLai[] = useMemo(
    () => pins.filter((p) => p.trangThai === "CanDatLai").map((p) => ({
      maTaiSan: p.maTaiSan,
      tenTaiSan: taiSan.find((t) => t.maTaiSan === p.maTaiSan)?.ten ?? p.maTaiSan,
      duongDanKhuVuc: chuoiDuongDan(nodes, p.maNut),
      tenSoDo: nodes.find((n) => n.maNut === p.maNut)?.tenKhuVuc ?? "",
      maNut: p.maNut,
      dangKhoa: false,
    })),
    [pins, taiSan, nodes],
  );

  function chonKetQua(maTaiSan: string) {
    const pin = pins.find((p) => p.maTaiSan === maTaiSan);
    if (!pin) { setThongBaoTraCuu("Chưa gán vị trí"); return; }
    setNutChon(pin.maNut); setPinLamNoi(maTaiSan); setThongBaoTraCuu(null); setTuKhoa("");
  }

  function xacNhanGan() {
    if (!draft || !nodeChon) return;
    const kq = ws.gan(draft.maTaiSan, nodeChon.maNut, draft.x, draft.y);
    if (kq.ok) { setToast(kq.toast!); setDraft(null); } else setSnackbar(kq.loi!);
  }

  function xacNhanGo(maTaiSan: string) {
    const kq = ws.go(maTaiSan);
    if (kq.ok) { setToast(kq.toast!); setGoConfirm(null); setPinPopup(null); }
    else { setSnackbar(kq.loi!); setGoConfirm(null); }
  }

  function xacNhanXoa(maNut: string) {
    const kq = ws.xoa(maNut); setToast(kq.toast!); setXoaDialog(null);
    if (nutChon === maNut) setNutChon(null);
  }

  function keoTha(keo: string, dich: string) {
    const kq = ws.chuyen(keo, dich);
    if (!kq.ok) setSnackbar(kq.loi!);
  }

  function xuLyMenu(maNut: string, hanhDong: "them-con" | "sua" | "xoa" | "anh-so-do") {
    if (hanhDong === "them-con") setFormKV({ nutChaMacDinh: maNut });
    else if (hanhDong === "sua") setFormKV({ nutSua: maNut });
    else if (hanhDong === "anh-so-do") setSoDoNut(maNut);
    else if (hanhDong === "xoa") setXoaDialog(maNut);
  }

  function luuFormKV(data: Parameters<typeof ws.themNut>[0]) {
    const kq = formKV?.nutSua ? ws.suaNut(formKV.nutSua, data) : ws.themNut(data);
    setToast(kq.toast!); setFormKV(null);
  }

  function datLaiPin(pin: PinCanDatLai) {
    setPinDangRoi(pin.maTaiSan);
    const kq = ws.datLaiPin(pin.maTaiSan, pin.maNut, 50, 50);
    if (kq.ok) setToast("Đã đặt lại vị trí pin.");
    else setSnackbar(kq.loi!);
    setTimeout(() => setPinDangRoi(null), 0);
  }

  const soCanDatLai = dsPinCanDatLai.length;
  const soDoHienTai: SoDoMatBang | undefined = useMemo(() => {
    if (!soDoNut) return undefined;
    const n = nodes.find((x) => x.maNut === soDoNut);
    return n?.soDoUrl ? { tenFile: n.soDoUrl, kichThuocByte: 0, rongPx: 1920, caoPx: 1080 } : undefined;
  }, [soDoNut, nodes]);

  return (
    <div className="workspace" data-testid="workspace">
      <header className="ws-header">
        <h1>Bản đồ tài sản</h1>
        <div className="o-tra-cuu">
          <label htmlFor="tra-cuu">Tra cứu tài sản</label>
          <input id="tra-cuu" type="search" placeholder="Tra cứu mã/tên tài sản..." value={tuKhoa} maxLength={100}
            onChange={(e) => { setTuKhoa(e.target.value); setThongBaoTraCuu(null); }} />
          {tuKhoa && (
            <ul className="goi-y" role="listbox" aria-label="Kết quả tra cứu">
              {goiY.length === 0 ? <li className="goi-y-trong">Không tìm thấy tài sản.</li>
                : goiY.map((t) => (
                  <li key={t.maTaiSan}><button onClick={() => chonKetQua(t.maTaiSan)}>{t.maTaiSan} · {t.ten}</button></li>
                ))}
            </ul>
          )}
          {thongBaoTraCuu && <p className="tra-cuu-thong-bao">{thongBaoTraCuu}</p>}
        </div>
        {vaiTro === "QuanTri" && (
          <button type="button" className="nut-nhat-ky" onClick={() => setMoS07(true)}>Nhật ký kiểm toán</button>
        )}
      </header>

      <div className="ws-body">
        <aside className="ws-cay">
          {vaiTro === "QuanTri" && (
            <button className="cta them-khu-vuc" onClick={() => setFormKV({ nutChaMacDinh: nutChon ?? null })}>+ Thêm khu vực</button>
          )}
          {nodes.length === 0 ? (
            <div className="cay-trong">
              <p>Chưa có khu vực nào.</p>
              {vaiTro === "QuanTri" && <button className="cta" onClick={() => setFormKV({ nutChaMacDinh: null })}>Tạo khu vực đầu tiên</button>}
            </div>
          ) : (
            <AreaTree nodes={nodes} nutChon={nutChon}
              onChon={(m) => { setNutChon(m); setPinLamNoi(null); }}
              vaiTro={vaiTro} onMenu={xuLyMenu} onChuyen={keoTha} />
          )}
        </aside>

        <main className="ws-canvas">
          {nodeChon?.soDoUrl && (
            <div className="thanh-cong-cu">
              <label>Lọc pin
                <select aria-label="Lọc pin theo trạng thái" value={locPin} onChange={(e) => setLocPin(e.target.value as TrangThaiPin | "tat-ca")}>
                  <option value="tat-ca">Tất cả</option>
                  <option value="DaGanViTri">Đã gán vị trí</option>
                  <option value="DangKhoa">Đang khóa</option>
                  <option value="CanDatLai">Cần đặt lại</option>
                </select>
              </label>
              <button type="button" onClick={() => setDiDoi({})}>Di dời hàng loạt</button>
              <button type="button" onClick={() => setMoS08(true)}>Xuất báo cáo</button>
            </div>
          )}
          <FloorPlanCanvas nodes={nodes} nutChon={nodeChon} pins={pinTrongNut} pinLamNoi={pinLamNoi}
            onClickTrong={(x, y) => nodeChon?.soDoUrl && setDraft({ x, y, maTaiSan: null })}
            onClickPin={(m) => setPinPopup(m)} />
          {soCanDatLai > 0 && (
            <button className="dai-canh-bao" aria-label={`${soCanDatLai} pin cần đặt lại vị trí`} onClick={() => setMoS05(true)}>
              ⚠ {soCanDatLai} pin cần đặt lại vị trí
            </button>
          )}
        </main>
      </div>

      {draft && (
        <div className="lop-noi" role="dialog" aria-label="Gán vị trí tài sản">
          <div className="o-gan">
            <h2>Gán vị trí tại điểm đã chọn</h2>
            <ul role="listbox" aria-label="Tài sản chưa có vị trí">
              {taiSanGanDuoc.map((t) => (
                <li key={t.maTaiSan}>
                  <label><input type="radio" name="tai-san-gan" checked={draft.maTaiSan === t.maTaiSan}
                    onChange={() => setDraft({ ...draft, maTaiSan: t.maTaiSan })} />{t.maTaiSan} · {t.ten}</label>
                </li>
              ))}
            </ul>
            <div className="o-gan-nut">
              <button onClick={() => setDraft(null)}>Hủy</button>
              <button className="cta" disabled={!draft.maTaiSan} onClick={xacNhanGan}>Gán vị trí</button>
            </div>
          </div>
        </div>
      )}

      {pinPopup && (
        <div className="lop-noi" role="dialog" aria-label="Chi tiết tài sản">
          <div className="pin-popup">
            <h2>{pinPopup}</h2>
            <button onClick={() => { setLichSuCua({ ma: pinPopup, ten: taiSan.find((t) => t.maTaiSan === pinPopup)?.ten ?? pinPopup }); setPinPopup(null); }}>Xem lịch sử</button>
            <button onClick={() => { setDiDoi({ taiSanDon: pinPopup }); setPinPopup(null); }}>Di dời</button>
            <button className="nguy-hiem" onClick={() => setGoConfirm(pinPopup)}>Gỡ vị trí</button>
            <button onClick={() => setPinPopup(null)}>Đóng</button>
          </div>
        </div>
      )}

      {goConfirm && (
        <div className="lop-noi" role="dialog" aria-label="Xác nhận gỡ vị trí">
          <div className="xoa-dialog">
            <p>Gỡ vị trí tài sản {goConfirm}? Tài sản sẽ về "chưa có vị trí".</p>
            <div className="xoa-nut">
              <button onClick={() => setGoConfirm(null)}>Hủy</button>
              <button className="nguy-hiem" onClick={() => xacNhanGo(goConfirm)}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {xoaDialog && vaiTro === "QuanTri" && (
        <div className="lop-noi" role="dialog" aria-label="Xác nhận xóa khu vực">
          <div className="xoa-dialog">
            <p>{wordingXacNhanXoa(ws.anhHuongXoa(xoaDialog))}</p>
            <div className="xoa-nut">
              <button onClick={() => setXoaDialog(null)}>Hủy</button>
              <button className="nguy-hiem" onClick={() => xacNhanXoa(xoaDialog)}>Tiếp tục</button>
            </div>
          </div>
        </div>
      )}

      {/* S02 — Form khu vực */}
      {formKV && (
        <FormKhuVuc nodes={nodes}
          nutSua={formKV.nutSua ? nodes.find((n) => n.maNut === formKV.nutSua) : undefined}
          nutChaMacDinh={formKV.nutChaMacDinh ?? null}
          onLuu={luuFormKV} onDong={() => setFormKV(null)} />
      )}

      {/* S03 — Quản lý ảnh sơ đồ */}
      {soDoNut && (
        <QuanLySoDoModal nodes={nodes} maNut={soDoNut} soDo={soDoHienTai} pins={pins} nguoi={ws.nguoi}
          onTaiLen={(kq) => { if (kq.ok && kq.soDo) { ws.apDungSoDo(soDoNut, SO_DO_MAU); setToast("Đã tải lên sơ đồ."); setSoDoNut(null); } }}
          onThay={(kq) => { if (kq.ok && kq.soDo) { ws.apDungSoDo(soDoNut, SO_DO_MAU, kq.pins); setToast("Đã thay sơ đồ."); setSoDoNut(null); } }}
          onXoa={(kq) => { ws.apDungSoDo(soDoNut, undefined, kq.pins); setToast("Đã xóa sơ đồ."); setSoDoNut(null); }}
          onDatLaiNgay={() => { setSoDoNut(null); setMoS05(true); }}
          onDong={() => setSoDoNut(null)} />
      )}

      {/* S04 — Di dời */}
      {diDoi && (
        <DiDoiForm nodes={nodes} taiSan={taiSan} pins={pins} nguoi={ws.nguoi} taiSanDon={diDoi.taiSanDon}
          onXong={(kq) => { ws.apDungDiDoi(kq); setToast(`Đã di dời ${kq.soLuong} tài sản.`); setDiDoi(null); }}
          onDong={() => setDiDoi(null)} />
      )}

      {/* S05 — Pin cần đặt lại */}
      {moS05 && (
        <PinCanDatLaiPanel danhSach={dsPinCanDatLai} dangRoi={pinDangRoi}
          onDatLai={datLaiPin} onDong={() => setMoS05(false)} />
      )}

      {/* S06 — Lịch sử di chuyển */}
      {lichSuCua && (
        <LichSuPanel maTaiSan={lichSuCua.ma} tenTaiSan={lichSuCua.ten}
          banGhi={ws.lichSu[lichSuCua.ma] ?? []} onDong={() => setLichSuCua(null)} />
      )}

      {/* S07 — Nhật ký kiểm toán */}
      {moS07 && (
        <NhatKyPanel vaiTro={vaiTro} banGhi={banGhiAudit} onDong={() => setMoS07(false)} />
      )}

      {/* S08 — Xuất báo cáo */}
      {moS08 && (
        <XuatBaoCaoModal nguon={{ nodes, taiSan, pins, lichSu: ws.lichSu }} maNutDangChon={nutChon}
          onDong={() => setMoS08(false)} />
      )}

      {toast && <div className="toast" role="status" onAnimationEnd={() => setToast(null)}>{toast}</div>}
      {snackbar && <div className="snackbar" role="alert" onClick={() => setSnackbar(null)}>{snackbar}</div>}
    </div>
  );
}
