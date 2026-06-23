import { useState } from "react";
import type { NutKhuVuc, VaiTro } from "./types";
import { layNutCon } from "./logic/treeModel";

interface Props {
  nodes: NutKhuVuc[];
  nutChon: string | null;
  onChon: (maNut: string) => void;
  vaiTro: VaiTro;
  onMenu?: (maNut: string, hanhDong: "them-con" | "sua" | "xoa" | "anh-so-do") => void;
  /** Kéo-thả nút (chỉ Quản trị, F05) — thả `keo` vào làm con của `dich`. */
  onChuyen?: (keo: string, dich: string) => void;
}

/** Cây khu vực đệ quy, không giới hạn cấp (F04, R-S01-01). */
export function AreaTree({ nodes, nutChon, onChon, vaiTro, onMenu, onChuyen }: Props) {
  const goc = layNutCon(nodes, null);
  return (
    <ul className="cay-khu-vuc" role="tree" aria-label="Cây khu vực">
      {goc.map((n) => (
        <NhanhCay
          key={n.maNut}
          node={n}
          nodes={nodes}
          nutChon={nutChon}
          onChon={onChon}
          vaiTro={vaiTro}
          onMenu={onMenu}
          onChuyen={onChuyen}
        />
      ))}
    </ul>
  );
}

function NhanhCay({ node, nodes, nutChon, onChon, vaiTro, onMenu, onChuyen }: Props & { node: NutKhuVuc }) {
  const con = layNutCon(nodes, node.maNut);
  const coCon = con.length > 0;
  const [mo, setMo] = useState(false);
  const keoThaDuoc = vaiTro === "QuanTri" && !!onChuyen;

  return (
    <li role="treeitem" aria-expanded={coCon ? mo : undefined} aria-selected={nutChon === node.maNut}>
      <div
        className="nut-hang"
        draggable={keoThaDuoc}
        onDragStart={(e) => keoThaDuoc && e.dataTransfer.setData("text/plain", node.maNut)}
        onDragOver={(e) => keoThaDuoc && e.preventDefault()}
        onDrop={(e) => {
          if (!keoThaDuoc) return;
          e.preventDefault();
          const keo = e.dataTransfer.getData("text/plain");
          if (keo && keo !== node.maNut) onChuyen!(keo, node.maNut);
        }}
      >
        {coCon ? (
          <button
            className="nut-toggle"
            aria-label={mo ? `Đóng ${node.tenKhuVuc}` : `Mở ${node.tenKhuVuc}`}
            onClick={() => setMo((v) => !v)}
          >
            {mo ? "▾" : "▸"}
          </button>
        ) : (
          <span className="nut-toggle-trong" aria-hidden="true">
            •
          </span>
        )}
        <button
          className={`nut-ten ${nutChon === node.maNut ? "dang-chon" : ""}`}
          onClick={() => onChon(node.maNut)}
        >
          {node.tenKhuVuc}
        </button>
        {vaiTro === "QuanTri" && onMenu && (
          <span className="nut-menu">
            <button aria-label={`Menu ${node.tenKhuVuc}`} onClick={() => onMenu(node.maNut, "sua")}>
              ⋮
            </button>
          </span>
        )}
      </div>
      {coCon && mo && (
        <ul role="group">
          {con.map((c) => (
            <NhanhCay
              key={c.maNut}
              node={c}
              nodes={nodes}
              nutChon={nutChon}
              onChon={onChon}
              vaiTro={vaiTro}
              onMenu={onMenu}
              onChuyen={onChuyen}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
