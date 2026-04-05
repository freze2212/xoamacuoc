export type TargetInfoItem = {
  label: string;
  value: string;
};

export type TargetTechItem = {
  tech: string;
  area: string;
  status: string;
};

export const consoleLines = [
  "[12:07:27] Khởi tạo hệ thống mở khóa...",
  "[12:07:27] Đang tải dữ liệu vòng quay...",
  "[12:07:28] Tối ưu tỷ lệ BIGWIN và SCATTER.",
  "[12:07:29] Đồng bộ các cụm máy chủ quốc tế.",
];

export const createRandomMeta = () => {
  const int = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
  const hex = (len: number) =>
    Array.from({ length: len }, () => int(0, 15).toString(16).toUpperCase()).join(
      "",
    );

  const ip = `173.16.${int(10, 99)}.${int(1, 254)}`;
  const port = int(10000, 65535);
  const phaseA = int(0, 23).toString().padStart(2, "0");
  const phaseB = int(0, 23).toString().padStart(2, "0");

  return {
    ipPort: `${ip}:${port}`,
    phaHoa: `${phaseA}H ${phaseB}H`,
    nhanHe: `X${int(1, 99)}.${int(0, 9)}`,
    scatter: `${int(1, 9)}${String.fromCharCode(65 + int(0, 25))}: Mở khóa`,
    nodeHex: `0x${hex(6)}`,
  };
};

export const createTargetInfo = (rand: ReturnType<typeof createRandomMeta>): TargetInfoItem[] => [
  { label: "IP PORT", value: rand.ipPort },
  { label: "MÃ HÓA", value: "ĐÃ MỞ KHÓA ..." },
  { label: "NHÂN HỆ SỐ", value: rand.nhanHe },
  { label: "SCATTER", value: rand.scatter },
];

export const createTargetTech = (unlockReady: boolean): TargetTechItem[] => [
  {
    tech: "CỔNG NGẪU NHIÊN TÂY Á",
    area: "INDIA",
    status: unlockReady ? "Mở khóa" : "Sẵn sàng",
  },
  {
    tech: "CỔNG NGẪU NHIÊN NAM Á",
    area: "SINGAPORE",
    status: unlockReady ? "Mở khóa" : "Sẵn sàng",
  },
  {
    tech: "CỔNG NGẪU NHIÊN CHÂU MỸ",
    area: "USA & CANADA",
    status: unlockReady ? "Mở khóa" : "Sẵn sàng",
  },
  {
    tech: "CỔNG NGẪU NHIÊN CHÂU ÂU",
    area: "GERMANY",
    status: unlockReady ? "Mở khóa" : "Sẵn sàng",
  },
];
