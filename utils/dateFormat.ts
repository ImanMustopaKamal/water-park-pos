export const dateFormat = async (datetimeString: string): Promise<string> => {
  const date = new Date(datetimeString);
  const bulanIndo = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  // const bulanIndo = [
  //   "Januari",
  //   "Februari",
  //   "Maret",
  //   "April",
  //   "Mei",
  //   "Juni",
  //   "Juli",
  //   "Agustus",
  //   "September",
  //   "Oktober",
  //   "November",
  //   "Desember",
  // ];

  const tanggal = date.getDate().toString().padStart(2, "0");
  const bulan = bulanIndo[date.getMonth()];
  const tahun = date.getFullYear();

  const jam = date.getHours().toString().padStart(2, "0");
  const menit = date.getMinutes().toString().padStart(2, "0");

  return `${tanggal} ${bulan} ${tahun} ${jam}:${menit}`;
};
