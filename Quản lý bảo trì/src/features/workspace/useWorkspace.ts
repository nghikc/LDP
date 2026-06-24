import { useCallback, useMemo, useRef, useState } from "react";
import type { NutKhuVuc, TaiSan, ViTriPin, VaiTro } from "./types";
import { nutKhuVucMau, taiSanMau, viTriPinMau } from "./sampleData";
import { ganViTri } from "./logic/assign";
import { goViTri, xoaNut, demAnhHuongXoa } from "./logic/remove";
import { chuyenNut } from "./logic/move";
import { chuoiDuongDan } from "./logic/treeModel";
import { taoBanGhiKiemToan, type BanGhiKiemToan, type HanhDongKiemToan } from "./logic/audit";
import { taoNut as taoNutSv, suaNut as suaNutSv } from "./form-khu-vuc/khuVucService";
import type { DuLieuForm } from "./form-khu-vuc/validateKhuVuc";
import type { KetQuaDiDoi } from "./di-doi/diDoiService";
import { datLaiToaDo } from "./pin-can-dat-lai/pinCanDatLaiService";
import type { BanGhiLichSu } from "./lich-su/lichSuService";

export type LichSuTheoTaiSan = Record<string, BanGhiLichSu[]>;

/** Khóa định danh một vị trí trên sơ đồ theo nút + tọa độ. */
export function khoaViTri(maNut: string, x: number, y: number): string {
  return `${maNut}:${x}:${y}`;
}

const NGUOI_HIEN_TAI = "giangnb";

export function useWorkspace(
  vaiTroBanDau: VaiTro = "QuanTri",
  now: () => string = () => "2026-06-23T10:00:00Z",
) {
  const [nodes, setNodes] = useState<NutKhuVuc[]>(nutKhuVucMau);
  const [taiSan] = useState<TaiSan[]>(taiSanMau);
  const [pins, setPins] = useState<ViTriPin[]>(viTriPinMau);
  const [auditLog, setAuditLog] = useState<BanGhiKiemToan[]>([]);
  const [lichSu, setLichSu] = useState<LichSuTheoTaiSan>({});
  const [viTriTen, setViTriTen] = useState<Record<string, string>>({});
  const [vaiTro] = useState<VaiTro>(vaiTroBanDau);
  const demId = useRef(0);

  const taiSanDangKhoa = useMemo(
    () => new Set(pins.filter((p) => p.trangThai === "DangKhoa").map((p) => p.maTaiSan)),
    [pins],
  );

  const ghiAudit = useCallback(
    (hanhDong: HanhDongKiemToan, doiTuong: string, extra?: Partial<BanGhiKiemToan>) => {
      setAuditLog((log) => [...log, { ...taoBanGhiKiemToan(NGUOI_HIEN_TAI, hanhDong, doiTuong, now()), ...extra }]);
    },
    [now],
  );

  const gan = useCallback(
    (maTaiSan: string | null, maNut: string, x: number, y: number) => {
      const kq = ganViTri(maTaiSan, maNut, x, y, taiSanDangKhoa);
      if (kq.ok && kq.pin) {
        setPins((ps) => [...ps, kq.pin!]);
        ghiAudit("gan-vi-tri", maTaiSan!);
        return { ok: true, toast: "Đã gán vị trí cho tài sản." };
      }
      return { ok: false, loi: kq.loi };
    },
    [taiSanDangKhoa, ghiAudit],
  );

  /** Gán NHIỀU tài sản vào cùng một vị trí (x,y) trên sơ đồ của nút. */
  const ganNhieu = useCallback(
    (maTaiSans: string[], maNut: string, x: number, y: number) => {
      const moi: ViTriPin[] = [];
      for (const ma of maTaiSans) {
        const kq = ganViTri(ma, maNut, x, y, taiSanDangKhoa);
        if (kq.ok && kq.pin) {
          moi.push(kq.pin);
          ghiAudit("gan-vi-tri", ma);
        }
      }
      if (moi.length === 0) return { ok: false, loi: "Không gán được tài sản nào." };
      setPins((ps) => [...ps, ...moi]);
      const toast = moi.length === 1 ? "Đã gán vị trí cho tài sản." : `Đã gán vị trí cho ${moi.length} tài sản.`;
      return { ok: true, soLuong: moi.length, toast };
    },
    [taiSanDangKhoa, ghiAudit],
  );

  const go = useCallback(
    (maTaiSan: string) => {
      const kq = goViTri(pins, maTaiSan);
      if (kq.ok && kq.pins) {
        setPins(kq.pins);
        ghiAudit("go-vi-tri", maTaiSan);
        return { ok: true, toast: "Đã gỡ vị trí." };
      }
      return { ok: false, loi: kq.loi };
    },
    [pins, ghiAudit],
  );

  const xoa = useCallback(
    (maNut: string) => {
      const kq = xoaNut(nodes, pins, maNut);
      setNodes(kq.nodes);
      setPins(kq.pins);
      ghiAudit("xoa-khu-vuc", maNut);
      return { ok: true, toast: "Đã xóa khu vực" };
    },
    [nodes, pins, ghiAudit],
  );

  const chuyen = useCallback(
    (maNut: string, maChaMoi: string) => {
      const kq = chuyenNut(nodes, maNut, maChaMoi);
      if (kq.ok && kq.nodes) {
        setNodes(kq.nodes);
        return { ok: true };
      }
      return { ok: false, loi: kq.loi };
    },
    [nodes],
  );

  const anhHuongXoa = useCallback((maNut: string) => demAnhHuongXoa(nodes, pins, maNut), [nodes, pins]);

  /** Đặt/đổi tên một vị trí (theo nút + tọa độ); tên rỗng = xóa tên. */
  const datTenViTri = useCallback((maNut: string, x: number, y: number, ten: string) => {
    const key = khoaViTri(maNut, x, y);
    setViTriTen((m) => {
      const n = { ...m };
      if (ten.trim()) n[key] = ten.trim();
      else delete n[key];
      return n;
    });
  }, []);

  const layTenViTri = useCallback(
    (maNut: string, x: number, y: number) => viTriTen[khoaViTri(maNut, x, y)],
    [viTriTen],
  );

  /** Kéo-thả: dời mọi pin tại (xCu,yCu) trong nút sang (xMoi,yMoi); tên vị trí đi theo. */
  const dichChuyenViTri = useCallback((maNut: string, xCu: number, yCu: number, xMoi: number, yMoi: number) => {
    setPins((ps) =>
      ps.map((p) =>
        p.maNut === maNut && p.toaDoX === xCu && p.toaDoY === yCu ? { ...p, toaDoX: xMoi, toaDoY: yMoi } : p,
      ),
    );
    setViTriTen((m) => {
      const kCu = khoaViTri(maNut, xCu, yCu);
      if (!m[kCu]) return m;
      const n = { ...m };
      n[khoaViTri(maNut, xMoi, yMoi)] = m[kCu];
      delete n[kCu];
      return n;
    });
  }, []);

  // ---- S02: tạo / sửa nút khu vực ----
  const themNut = useCallback(
    (data: DuLieuForm) => {
      const maNut = `nut-${++demId.current}`;
      setNodes((ns) => taoNutSv(ns, maNut, data));
      ghiAudit("xoa-khu-vuc", maNut); // dùng chung nhật ký thao tác cấu trúc
      return { ok: true, toast: "Đã thêm khu vực." };
    },
    [ghiAudit],
  );

  const suaNut = useCallback(
    (maNut: string, data: DuLieuForm) => {
      setNodes((ns) => suaNutSv(ns, maNut, data));
      return { ok: true, toast: "Đã cập nhật khu vực." };
    },
    [],
  );

  // ---- S04: áp kết quả di dời (pins + lịch sử + audit) ----
  const apDungDiDoi = useCallback(
    (kq: KetQuaDiDoi) => {
      if (!kq.ok || !kq.pins) return;
      setPins(kq.pins);
      if (kq.lichSu) {
        setLichSu((ls) => {
          const moi = { ...ls };
          for (const l of kq.lichSu!) {
            const bg: BanGhiLichSu = {
              thoiDiem: l.thoiDiem,
              nguoi: l.nguoi,
              viTriCu: chuoiDuongDan(nodes, l.viTriCu) || l.viTriCu,
              viTriMoi: chuoiDuongDan(nodes, l.viTriMoi) || l.viTriMoi,
              lyDo: l.lyDo,
            };
            moi[l.maTaiSan] = [...(moi[l.maTaiSan] ?? []), bg];
          }
          return moi;
        });
      }
      if (kq.audit) setAuditLog((log) => [...log, ...kq.audit!]);
    },
    [nodes],
  );

  // ---- S03: áp thay đổi sơ đồ (soDoUrl trên nút + pins khi thay/xóa) ----
  const apDungSoDo = useCallback((maNut: string, soDoUrl: string | undefined, pinsMoi?: ViTriPin[]) => {
    setNodes((ns) => ns.map((n) => (n.maNut === maNut ? { ...n, soDoUrl } : n)));
    if (pinsMoi) setPins(pinsMoi);
  }, []);

  // ---- S05: đặt lại tọa độ pin ----
  const datLaiPin = useCallback(
    (maTaiSan: string, maNut: string, x: number, y: number) => {
      const dangKhoa = taiSanDangKhoa.has(maTaiSan);
      const kq = datLaiToaDo({ maTaiSan, maNut }, x, y, dangKhoa);
      if (!kq.ok) return { ok: false, loi: kq.loi };
      setPins((ps) =>
        ps.map((p) =>
          p.maTaiSan === maTaiSan ? { ...p, toaDoX: x, toaDoY: y, trangThai: "DaGanViTri" } : p,
        ),
      );
      ghiAudit("gan-vi-tri", maTaiSan);
      return { ok: true };
    },
    [taiSanDangKhoa, ghiAudit],
  );

  return {
    nodes, taiSan, pins, auditLog, lichSu, viTriTen, vaiTro, nguoi: NGUOI_HIEN_TAI,
    gan, ganNhieu, go, xoa, chuyen, anhHuongXoa,
    themNut, suaNut, apDungDiDoi, apDungSoDo, datLaiPin, datTenViTri, layTenViTri, dichChuyenViTri,
  };
}
