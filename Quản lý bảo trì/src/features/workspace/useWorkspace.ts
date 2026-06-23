import { useCallback, useMemo, useState } from "react";
import type { NutKhuVuc, TaiSan, ViTriPin, VaiTro } from "./types";
import { nutKhuVucMau, taiSanMau, viTriPinMau } from "./sampleData";
import { ganViTri } from "./logic/assign";
import { goViTri, xoaNut, demAnhHuongXoa } from "./logic/remove";
import { chuyenNut } from "./logic/move";
import { taoBanGhiKiemToan, type BanGhiKiemToan, type HanhDongKiemToan } from "./logic/audit";

export interface TrangThaiWorkspace {
  nodes: NutKhuVuc[];
  taiSan: TaiSan[];
  pins: ViTriPin[];
  auditLog: BanGhiKiemToan[];
  vaiTro: VaiTro;
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
  const [vaiTro] = useState<VaiTro>(vaiTroBanDau);

  const taiSanDangKhoa = useMemo(
    () => new Set(pins.filter((p) => p.trangThai === "DangKhoa").map((p) => p.maTaiSan)),
    [pins],
  );

  const ghiAudit = useCallback(
    (hanhDong: HanhDongKiemToan, doiTuong: string) => {
      setAuditLog((log) => [...log, taoBanGhiKiemToan(NGUOI_HIEN_TAI, hanhDong, doiTuong, now())]);
    },
    [now],
  );

  /** Gán vị trí → trả thông báo (toast/lỗi) cho UI. */
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

  return { nodes, taiSan, pins, auditLog, vaiTro, gan, go, xoa, chuyen, anhHuongXoa };
}
