import { useRef, useState } from "react";
import type { NutKhuVuc, ViTriPin } from "../types";
import { chuoiDuongDan } from "../logic/treeModel";
import { tuFile } from "./validateImage";
import {
  taiLenSoDo,
  thaySoDo,
  xoaSoDo,
  type SoDoMatBang,
  type KetQuaTaiLen,
  type KetQuaThay,
  type KetQuaXoa,
} from "./quanLySoDoService";
import "./quanLySoDo.css";

interface Props {
  nodes: NutKhuVuc[];
  maNut: string;
  soDo: SoDoMatBang | undefined;
  pins: ViTriPin[];
  nguoi: string;
  now?: () => string;
  /** Đọc kích thước thật của file (test inject). Mặc định 1920×1080. */
  docKichThuoc?: (file: File) => { rongPx: number; caoPx: number };
  onTaiLen: (kq: KetQuaTaiLen) => void;
  onThay: (kq: KetQuaThay) => void;
  onXoa: (kq: KetQuaXoa) => void;
  /** Điều hướng sang S05 (Danh sách pin cần đặt lại). */
  onDatLaiNgay: () => void;
  onDong: () => void;
}

function dinhDangMB(byte: number): string {
  return `${(byte / (1024 * 1024)).toFixed(1)} MB`;
}

/** Modal S03 — quản lý ảnh sơ đồ mặt bằng của một nút khu vực (chỉ Quản trị). */
export function QuanLySoDoModal({
  nodes, maNut, soDo, pins, nguoi,
  now = () => "2026-06-22T10:00:00Z",
  docKichThuoc = () => ({ rongPx: 1920, caoPx: 1080 }),
  onTaiLen, onThay, onXoa, onDatLaiNgay, onDong,
}: Props) {
  const [loi, setLoi] = useState<string | undefined>();
  const [keoVao, setKeoVao] = useState(false);
  const [xacNhanThay, setXacNhanThay] = useState(false);
  const [xacNhanXoa, setXacNhanXoa] = useState(false);
  const [bannerTran, setBannerTran] = useState<number>(0);
  const fileThayRef = useRef<File | null>(null);

  const duongDan = chuoiDuongDan(nodes, maNut);
  const pinCuaNut = pins.filter((p) => p.maNut === maNut);
  const soPin = pinCuaNut.length;

  function xuLyTaiLen(file: File) {
    setLoi(undefined);
    const { rongPx, caoPx } = docKichThuoc(file);
    const kq = taiLenSoDo({
      soDoHienTai: soDo, file: tuFile(file), rongPx, caoPx, maNut, nguoi, thoiDiem: now(),
    });
    if (!kq.ok) {
      setLoi(kq.loi);
      return;
    }
    onTaiLen(kq);
  }

  function chonFileThay(file: File) {
    setLoi(undefined);
    if (soPin > 0) {
      fileThayRef.current = file;
      setXacNhanThay(true);
    } else {
      thucHienThay(file);
    }
  }

  function thucHienThay(file: File) {
    if (!soDo) return;
    const { rongPx, caoPx } = docKichThuoc(file);
    const kq = thaySoDo({
      soDoHienTai: soDo, pins: pinCuaNut, file: tuFile(file), rongPx, caoPx, maNut, nguoi, thoiDiem: now(),
    });
    setXacNhanThay(false);
    fileThayRef.current = null;
    if (!kq.ok) {
      setLoi(kq.loi);
      return;
    }
    const soTran = kq.pinCanDatLai?.length ?? 0;
    setBannerTran(soTran);
    onThay(kq);
  }

  function batDauXoa() {
    if (soPin > 0) {
      setXacNhanXoa(true);
    } else {
      thucHienXoa();
    }
  }

  function thucHienXoa() {
    const kq = xoaSoDo({ pins, maNut, nguoi, thoiDiem: now() });
    setXacNhanXoa(false);
    onXoa(kq);
  }

  return (
    <div className="sodo-lop-phu" role="dialog" aria-modal="true" aria-label="Quản lý ảnh sơ đồ mặt bằng">
      <div className="sodo-modal">
        <div className="sodo-tieu-de">
          <h2 id="sodo-tieu-de">Quản lý ảnh sơ đồ mặt bằng</h2>
          <button className="sodo-dong" aria-label="Đóng" onClick={onDong}>
            ✕
          </button>
        </div>
        <p className="sodo-breadcrumb">{duongDan}</p>

        {!soDo && (
          <div>
            <div
              className={`sodo-dropzone${keoVao ? " keo-vao" : ""}${loi ? " co-loi" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setKeoVao(true); }}
              onDragLeave={() => setKeoVao(false)}
              onDrop={(e) => {
                e.preventDefault();
                setKeoVao(false);
                const f = e.dataTransfer.files?.[0];
                if (f) xuLyTaiLen(f);
              }}
            >
              <p>Kéo &amp; thả ảnh vào đây hoặc</p>
              <label className="sodo-nhan-chon">
                Chọn ảnh
                <input
                  className="sodo-input-file"
                  type="file"
                  accept="image/png,image/jpeg"
                  aria-label="Chọn ảnh sơ đồ để tải lên"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) xuLyTaiLen(f);
                  }}
                />
              </label>
              <p className="sodo-dropzone-huong-dan">
                PNG hoặc JPG, tối đa 10 MB, 1 ảnh mỗi khu vực
              </p>
            </div>
            {loi && <p className="sodo-loi" role="alert">{loi}</p>}
          </div>
        )}

        {soDo && (
          <div>
            <img
              className="sodo-preview-anh"
              src={`#${soDo.tenFile}`}
              alt={`Sơ đồ mặt bằng ${duongDan}`}
            />
            <p className="sodo-metadata">
              <span className="sodo-ten-file" title={soDo.tenFile}>{soDo.tenFile}</span>
              {" · "}{dinhDangMB(soDo.kichThuocByte)}{" · "}{soDo.rongPx}×{soDo.caoPx}
            </p>
            <p className="sodo-so-pin">{soPin} pin đang đặt trên sơ đồ này</p>

            {bannerTran > 0 && (
              <div className="sodo-banner-tran" role="alert">
                <span>
                  {bannerTran} pin nằm ngoài vùng ảnh mới được đánh dấu &apos;cần đặt lại vị trí&apos;.
                </span>
                <button className="sodo-btn cta" onClick={onDatLaiNgay}>Đặt lại ngay</button>
              </div>
            )}

            {loi && <p className="sodo-loi" role="alert">{loi}</p>}

            <div className="sodo-nut-hang">
              <label className="sodo-nhan-chon">
                Thay ảnh
                <input
                  className="sodo-input-file"
                  type="file"
                  accept="image/png,image/jpeg"
                  aria-label="Chọn ảnh mới để thay"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) chonFileThay(f);
                  }}
                />
              </label>
              <button className="sodo-btn nguy-hiem" onClick={batDauXoa}>
                Xóa ảnh
              </button>
            </div>
          </div>
        )}
      </div>

      {xacNhanThay && (
        <div className="sodo-dialog-lop" role="dialog" aria-modal="true" aria-label="Xác nhận thay ảnh">
          <div className="sodo-dialog">
            <p>
              Sơ đồ này đang có {soPin} pin. Hệ thống giữ nguyên vị trí tương đối của pin trên ảnh mới.
              Pin nằm ngoài vùng ảnh mới sẽ được đánh dấu &apos;cần đặt lại&apos;. Tiếp tục thay?
            </p>
            <div className="sodo-nut-hang">
              <button
                className="sodo-btn"
                onClick={() => { setXacNhanThay(false); fileThayRef.current = null; }}
              >
                Hủy
              </button>
              <button
                className="sodo-btn cta"
                onClick={() => fileThayRef.current && thucHienThay(fileThayRef.current)}
              >
                Tiếp tục thay
              </button>
            </div>
          </div>
        </div>
      )}

      {xacNhanXoa && (
        <div className="sodo-dialog-lop" role="dialog" aria-modal="true" aria-label="Xác nhận xóa ảnh">
          <div className="sodo-dialog">
            <p>
              Xóa ảnh sẽ gỡ vị trí của {soPin} tài sản (về &apos;chưa có vị trí&apos;).
              Hồ sơ tài sản được giữ nguyên. Tiếp tục?
            </p>
            <div className="sodo-nut-hang">
              <button className="sodo-btn" onClick={() => setXacNhanXoa(false)}>Hủy</button>
              <button className="sodo-btn nguy-hiem" onClick={thucHienXoa}>Xóa ảnh</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
