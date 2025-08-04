export const dateFormat = (datetimeString: string): string => {
  const date = new Date(datetimeString);
  const bulanIndo = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const tgl = date.getDate().toString().padStart(2, "0");
  const bln = bulanIndo[date.getMonth()];
  const thn = date.getFullYear();
  const jam = date.getHours().toString().padStart(2, "0");
  const mnt = date.getMinutes().toString().padStart(2, "0");

  return `${tgl} ${bln} ${thn} ${jam}:${mnt}`;
};
