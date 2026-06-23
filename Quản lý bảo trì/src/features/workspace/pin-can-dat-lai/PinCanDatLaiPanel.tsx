import { nhanBoDem, THONG_BAO_KHOA, type PinCanDatLai } from "./pinCanDatLaiService";
import "./pinCanDatLai.css";

interface Props {
  /** Danh sách pin "cần đặt lại" (đã lọc trạng thái CanDatLai). */
  danhSach: PinCanDatLai[];
  /** Trạng thái tải — "loi" hiện thông báo + Thử lại. */
  trangThaiTai?: "ok" | "loi";
  /** Mã tài sản đang rời danh sách (animation fade+collapse). */
  dangRoi?: string | null;
  onThuLai?: () => void;
  /** Bấm [Đặt lại vị trí] trên một item (chỉ khi pin không khóa). */
  onDatLai: (pin: PinCanDatLai) => void;
  onDong: () => void;
}

/** S05 — Panel "Danh sách pin cần đặt lại" (slide-in từ phải). */
export function PinCanDatLaiPanel({
  danhSach,
  trangThaiTai = "ok",
  dangRoi = null,
  onThuLai,
  onDatLai,
  onDong,
}: Props) {
  return (
    <aside className="pin-cdl-panel" role="dialog" aria-label="Danh sách pin cần đặt lại">
      <header className="pin-cdl-header">
        <button className="pin-cdl-quay-lai" aria-label="Quay lại Bản đồ tài sản" onClick={onDong}>
          ←
        </button>
        <h2>Pin cần đặt lại vị trí</h2>
      </header>

      {trangThaiTai === "loi" ? (
        <div className="pin-cdl-loi" role="alert">
          <p>Không tải được danh sách pin cần đặt lại</p>
          <button onClick={onThuLai}>Thử lại</button>
        </div>
      ) : danhSach.length === 0 ? (
        <div className="pin-cdl-trong">
          <span className="pin-cdl-minh-hoa" aria-hidden="true">
            ✓
          </span>
          <p>Không có pin nào cần đặt lại vị trí</p>
          <p className="phu">Mọi pin đều nằm đúng trong vùng sơ đồ.</p>
          <button onClick={onDong}>Đóng</button>
        </div>
      ) : (
        <>
          <p className="pin-cdl-bo-dem" aria-live="polite">
            {nhanBoDem(danhSach.length)}
          </p>
          <ul className="pin-cdl-ds" aria-label="Danh sách pin cần đặt lại">
            {danhSach.map((pin) => (
              <li
                key={pin.maTaiSan}
                className={`pin-cdl-muc${dangRoi === pin.maTaiSan ? " dang-roi" : ""}`}
              >
                <div className="pin-cdl-muc-noi-dung">
                  <div className="pin-cdl-muc-ten" title={`${pin.maTaiSan} · ${pin.tenTaiSan}`}>
                    {pin.maTaiSan} · {pin.tenTaiSan}
                  </div>
                  <div className="pin-cdl-muc-duongdan" title={pin.duongDanKhuVuc}>
                    {pin.duongDanKhuVuc}
                  </div>
                  <div className="pin-cdl-muc-sodo" title={pin.tenSoDo}>
                    Sơ đồ: {pin.tenSoDo}
                  </div>
                  {pin.dangKhoa && (
                    <p className="pin-cdl-canh-bao-khoa" role="status">
                      {THONG_BAO_KHOA}
                    </p>
                  )}
                </div>
                <button
                  className="pin-cdl-nut"
                  onClick={() => onDatLai(pin)}
                  disabled={pin.dangKhoa}
                  aria-label={`Đặt lại vị trí ${pin.maTaiSan}`}
                >
                  Đặt lại vị trí
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
