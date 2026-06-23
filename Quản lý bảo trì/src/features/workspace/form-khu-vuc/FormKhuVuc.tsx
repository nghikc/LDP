import { useMemo, useState } from "react";
import type { NutKhuVuc } from "../types";
import { chuoiDuongDan } from "../logic/treeModel";
import { locNutChaHopLe } from "./khuVucService";
import { validateForm, validateTen, formHopLe, type DuLieuForm, type LoiForm } from "./validateKhuVuc";

const LOAI_KHU_VUC = ["Site", "Tòa", "Tầng", "Phòng", "Khu"];

interface Props {
  nodes: NutKhuVuc[];
  /** Có giá trị = chế độ Sửa (nút đang sửa); undefined = chế độ Tạo. */
  nutSua?: NutKhuVuc;
  /** Nút cha đặt sẵn khi Tạo ("Thêm con"); null = gốc. */
  nutChaMacDinh?: string | null;
  onLuu: (data: DuLieuForm) => void;
  onDong: () => void;
}

/** Modal Tạo/Sửa nút khu vực dùng chung (S02, F01/F02). */
export function FormKhuVuc({ nodes, nutSua, nutChaMacDinh = null, onLuu, onDong }: Props) {
  const laSua = !!nutSua;
  const [ten, setTen] = useState(nutSua?.tenKhuVuc ?? "");
  const [ma, setMa] = useState(nutSua?.maKhuVuc ?? "");
  const [loai, setLoai] = useState(nutSua?.loaiKhuVuc ?? "");
  const [nutCha, setNutCha] = useState<string | null>(nutSua?.nutCha ?? nutChaMacDinh);
  const [loi, setLoi] = useState<LoiForm>({});
  const [hoiBo, setHoiBo] = useState(false);

  const data: DuLieuForm = { ten, ma, loai, nutCha };
  const choHopLe = useMemo(() => locNutChaHopLe(nodes, nutSua?.maNut), [nodes, nutSua]);
  const banDau = useMemo(
    () => ({
      ten: nutSua?.tenKhuVuc ?? "",
      ma: nutSua?.maKhuVuc ?? "",
      loai: nutSua?.loaiKhuVuc ?? "",
      nutCha: nutSua?.nutCha ?? nutChaMacDinh,
    }),
    [nutSua, nutChaMacDinh],
  );
  const daSua = ten !== banDau.ten || ma !== banDau.ma || loai !== banDau.loai || nutCha !== banDau.nutCha;
  const luuVoHieu = !!validateTen(ten);

  function thuLuu() {
    const l = validateForm(data, nodes, nutSua?.maNut);
    setLoi(l);
    if (formHopLe(l)) onLuu(data);
  }

  function thuDong() {
    if (daSua) setHoiBo(true);
    else onDong();
  }

  return (
    <div className="lop-noi" role="dialog" aria-label={laSua ? "Sửa khu vực" : "Thêm khu vực"}>
      <div className="form-khu-vuc">
        <h2>{laSua ? "Sửa khu vực" : "Thêm khu vực"}</h2>

        <label>
          Tên khu vực *
          <input
            value={ten}
            onChange={(e) => setTen(e.target.value)}
            aria-invalid={!!loi.ten}
            aria-describedby={loi.ten ? "loi-ten" : undefined}
          />
        </label>
        {loi.ten && <p id="loi-ten" className="loi-field" role="alert">{loi.ten}</p>}

        <label>
          Mã khu vực
          <input value={ma} onChange={(e) => setMa(e.target.value)} aria-invalid={!!loi.ma} />
        </label>
        {loi.ma && <p className="loi-field" role="alert">{loi.ma}</p>}

        <label>
          Loại khu vực
          <select value={loai} onChange={(e) => setLoai(e.target.value)}>
            <option value="">(Không chọn)</option>
            {LOAI_KHU_VUC.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nút cha
          <select
            value={nutCha ?? ""}
            onChange={(e) => setNutCha(e.target.value || null)}
            aria-invalid={!!loi.nutCha}
          >
            <option value="">(Gốc — không có nút cha)</option>
            {choHopLe.map((n) => (
              <option key={n.maNut} value={n.maNut}>
                {chuoiDuongDan(nodes, n.maNut)}
              </option>
            ))}
          </select>
        </label>
        {loi.nutCha && <p className="loi-field" role="alert">{loi.nutCha}</p>}

        <div className="form-nut">
          <button onClick={thuDong}>Hủy</button>
          <button className="cta" disabled={luuVoHieu} onClick={thuLuu}>
            Lưu
          </button>
        </div>
      </div>

      {hoiBo && (
        <div className="lop-noi" role="dialog" aria-label="Xác nhận bỏ thay đổi">
          <div className="xoa-dialog">
            <p>Bỏ thay đổi chưa lưu?</p>
            <div className="xoa-nut">
              <button onClick={() => setHoiBo(false)}>Ở lại</button>
              <button className="nguy-hiem" onClick={onDong}>
                Bỏ thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
