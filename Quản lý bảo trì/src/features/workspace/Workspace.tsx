import { useMemo, useState } from "react";
import { useWorkspace } from "./useWorkspace";
import { AreaTree } from "./AreaTree";
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { timTaiSan } from "./logic/search";
import { taiSanChuaCoViTri } from "./logic/assign";
import { wordingXacNhanXoa } from "./logic/remove";
import { locPinTheoTrangThai } from "./logic/clustering";
import type { TrangThaiPin, VaiTro } from "./types";
import "./workspace.css";

interface DraftGan {
  x: number;
  y: number;
  maTaiSan: string | null;
}

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

  const nodeChon = useMemo(() => nodes.find((n) => n.maNut === nutChon) ?? null, [nodes, nutChon]);
  const goiY = useMemo(() => (tuKhoa ? timTaiSan(taiSan, tuKhoa) : []), [taiSan, tuKhoa]);
  const taiSanGanDuoc = useMemo(() => taiSanChuaCoViTri(taiSan, pins), [taiSan, pins]);
  const pinTrongNut = useMemo(() => {
    const cua = pins.filter((p) => p.maNut === nutChon);
    return locPin === "tat-ca" ? cua : locPinTheoTrangThai(cua, locPin);
  }, [pins, nutChon, locPin]);

  function chonKetQua(maTaiSan: string) {
    const pin = pins.find((p) => p.maTaiSan === maTaiSan);
    if (!pin) {
      setThongBaoTraCuu("Chưa gán vị trí");
      return;
    }
    setNutChon(pin.maNut);
    setPinLamNoi(maTaiSan);
    setThongBaoTraCuu(null);
    setTuKhoa("");
  }

  function xacNhanGan() {
    if (!draft || !nodeChon) return;
    const kq = ws.gan(draft.maTaiSan, nodeChon.maNut, draft.x, draft.y);
    if (kq.ok) {
      setToast(kq.toast!);
      setDraft(null);
    } else {
      setSnackbar(kq.loi!);
    }
  }

  function xacNhanGo(maTaiSan: string) {
    const kq = ws.go(maTaiSan);
    if (kq.ok) {
      setToast(kq.toast!);
      setGoConfirm(null);
      setPinPopup(null);
    } else {
      setSnackbar(kq.loi!);
      setGoConfirm(null);
    }
  }

  function xacNhanXoa(maNut: string) {
    const kq = ws.xoa(maNut);
    setToast(kq.toast!);
    setXoaDialog(null);
    if (nutChon === maNut) setNutChon(null);
  }

  function keoTha(keo: string, dich: string) {
    const kq = ws.chuyen(keo, dich);
    if (!kq.ok) setSnackbar(kq.loi!);
  }

  const soCanDatLai = pins.filter((p) => p.trangThai === "CanDatLai").length;

  return (
    <div className="workspace" data-testid="workspace">
      <header className="ws-header">
        <h1>Bản đồ tài sản</h1>
        <div className="o-tra-cuu">
          <label htmlFor="tra-cuu">Tra cứu tài sản</label>
          <input
            id="tra-cuu"
            type="search"
            placeholder="Tra cứu mã/tên tài sản..."
            value={tuKhoa}
            maxLength={100}
            onChange={(e) => {
              setTuKhoa(e.target.value);
              setThongBaoTraCuu(null);
            }}
          />
          {tuKhoa && (
            <ul className="goi-y" role="listbox" aria-label="Kết quả tra cứu">
              {goiY.length === 0 ? (
                <li className="goi-y-trong">Không tìm thấy tài sản.</li>
              ) : (
                goiY.map((t) => (
                  <li key={t.maTaiSan}>
                    <button onClick={() => chonKetQua(t.maTaiSan)}>
                      {t.maTaiSan} · {t.ten}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
          {thongBaoTraCuu && <p className="tra-cuu-thong-bao">{thongBaoTraCuu}</p>}
        </div>
      </header>

      <div className="ws-body">
        <aside className="ws-cay">
          {vaiTro === "QuanTri" && <button className="cta them-khu-vuc">+ Thêm khu vực</button>}
          {nodes.length === 0 ? (
            <div className="cay-trong">
              <p>Chưa có khu vực nào.</p>
              {vaiTro === "QuanTri" && <button className="cta">Tạo khu vực đầu tiên</button>}
            </div>
          ) : (
            <AreaTree
              nodes={nodes}
              nutChon={nutChon}
              onChon={(m) => {
                setNutChon(m);
                setPinLamNoi(null);
              }}
              vaiTro={vaiTro}
              onMenu={(m) => setXoaDialog(m)}
              onChuyen={keoTha}
            />
          )}
        </aside>

        <main className="ws-canvas">
          {nodeChon?.soDoUrl && (
            <div className="thanh-cong-cu">
              <label>
                Lọc pin
                <select
                  aria-label="Lọc pin theo trạng thái"
                  value={locPin}
                  onChange={(e) => setLocPin(e.target.value as TrangThaiPin | "tat-ca")}
                >
                  <option value="tat-ca">Tất cả</option>
                  <option value="DaGanViTri">Đã gán vị trí</option>
                  <option value="DangKhoa">Đang khóa</option>
                  <option value="CanDatLai">Cần đặt lại</option>
                </select>
              </label>
              <button type="button">Di dời hàng loạt</button>
              <button type="button">Xuất báo cáo</button>
            </div>
          )}
          <FloorPlanCanvas
            nodes={nodes}
            nutChon={nodeChon}
            pins={pinTrongNut}
            pinLamNoi={pinLamNoi}
            onClickTrong={(x, y) => nodeChon?.soDoUrl && setDraft({ x, y, maTaiSan: null })}
            onClickPin={(m) => setPinPopup(m)}
          />
          {soCanDatLai > 0 && (
            <button className="dai-canh-bao" aria-label={`${soCanDatLai} pin cần đặt lại vị trí`}>
              ⚠ {soCanDatLai} pin cần đặt lại vị trí
            </button>
          )}
        </main>
      </div>

      {/* Ô chọn tài sản khi gán (TC-14..19) */}
      {draft && (
        <div className="lop-noi" role="dialog" aria-label="Gán vị trí tài sản">
          <div className="o-gan">
            <h2>Gán vị trí tại điểm đã chọn</h2>
            <ul role="listbox" aria-label="Tài sản chưa có vị trí">
              {taiSanGanDuoc.map((t) => (
                <li key={t.maTaiSan}>
                  <label>
                    <input
                      type="radio"
                      name="tai-san-gan"
                      checked={draft.maTaiSan === t.maTaiSan}
                      onChange={() => setDraft({ ...draft, maTaiSan: t.maTaiSan })}
                    />
                    {t.maTaiSan} · {t.ten}
                  </label>
                </li>
              ))}
            </ul>
            <div className="o-gan-nut">
              <button onClick={() => setDraft(null)}>Hủy</button>
              <button className="cta" disabled={!draft.maTaiSan} onClick={xacNhanGan}>
                Gán vị trí
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup chi tiết pin (TC-23..26) */}
      {pinPopup && (
        <div className="lop-noi" role="dialog" aria-label="Chi tiết tài sản">
          <div className="pin-popup">
            <h2>{pinPopup}</h2>
            <button>Xem lịch sử</button>
            <button>Di dời</button>
            <button className="nguy-hiem" onClick={() => setGoConfirm(pinPopup)}>
              Gỡ vị trí
            </button>
            <button onClick={() => setPinPopup(null)}>Đóng</button>
          </div>
        </div>
      )}

      {/* Dialog xác nhận gỡ vị trí (R-S01-07, TC-23/26) */}
      {goConfirm && (
        <div className="lop-noi" role="dialog" aria-label="Xác nhận gỡ vị trí">
          <div className="xoa-dialog">
            <p>Gỡ vị trí tài sản {goConfirm}? Tài sản sẽ về "chưa có vị trí".</p>
            <div className="xoa-nut">
              <button onClick={() => setGoConfirm(null)}>Hủy</button>
              <button className="nguy-hiem" onClick={() => xacNhanGo(goConfirm)}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog xác nhận xóa nút (TC-37..40) */}
      {xoaDialog && vaiTro === "QuanTri" && (
        <div className="lop-noi" role="dialog" aria-label="Xác nhận xóa khu vực">
          <div className="xoa-dialog">
            <p>{wordingXacNhanXoa(ws.anhHuongXoa(xoaDialog))}</p>
            <div className="xoa-nut">
              <button onClick={() => setXoaDialog(null)}>Hủy</button>
              <button className="nguy-hiem" onClick={() => xacNhanXoa(xoaDialog)}>
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast" role="status" onAnimationEnd={() => setToast(null)}>
          {toast}
        </div>
      )}
      {snackbar && (
        <div className="snackbar" role="alert" onClick={() => setSnackbar(null)}>
          {snackbar}
        </div>
      )}
    </div>
  );
}
