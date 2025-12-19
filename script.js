let bmiChart;

/* ======================
   HITUNG BMI
====================== */
function calBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  return parseFloat(bmi.toFixed(1));
}

/* ======================
   KATEGORI BMI
====================== */
function getCategoryBMI(bmi) {
  if (bmi < 18.5) return "kurus";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obesitas";
}

/* ======================
   WARNA KATEGORI
====================== */
function categoryColor(category) {
  switch (category) {
    case "kurus":
      return "primary";
    case "normal":
      return "success";
    case "overweight":
      return "warning";
    case "obesitas":
      return "danger";
    default:
      return "secondary";
  }
}

function bmiDescription(category) {
  const data = {
    kurus: {
      icon: "🟦",
      text: "Berat badan Anda berada di bawah rentang ideal.",
      range: "< 18.5",
    },
    normal: {
      icon: "🟢",
      text: "Berat badan Anda berada dalam rentang ideal.",
      range: "18.5 – 24.9",
    },
    overweight: {
      icon: "🟡",
      text: "Berat badan Anda sedikit di atas rentang ideal.",
      range: "25 – 29.9",
    },
    obesitas: {
      icon: "🔴",
      text: "Berat badan Anda jauh di atas rentang ideal.",
      range: "≥ 30",
    },
  };
  return data[category];
}

/* ======================
   SUBMIT FORM
====================== */
function postBMI(e) {
  e.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const gender = document.getElementById("gender").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const height = parseFloat(document.getElementById("height").value);

  // VALIDASI
  if (!age || !weight || !height || height <= 0 || weight <= 0) {
    alert("Mohon isi data dengan benar");
    return;
  }

  const bmi = calBMI(weight, height);
  const category = getCategoryBMI(bmi);
  const color = categoryColor(category);

  const desc = bmiDescription(category);

  document.getElementById("bmiReport").innerHTML = `
  <div class="mb-2">
    <h1 id="bmiValue">${bmi}</h1>
  </div>

  <h3>
    <span id="bmiCategory" class="badge badge-light text-${color} text-uppercase">
      ${desc.icon} ${category}
    </span>
  </h3>

  <p class="mt-2 mb-0">
    ${desc.text}
  </p>

  <small class="text-muted">
    Rentang kategori: <b>${desc.range}</b>
  </small>
`;

  document.getElementById("placeholderBmiReport").classList.add("d-none");
  document.getElementById("bmiReport").classList.remove("d-none");
  document.getElementById("placeholderBmiChart").classList.add("d-none");
  document.getElementById("bmiChartWrapper").classList.remove("d-none");

  chartBMI(category);
  renderRecommendation(height, weight, age, gender, category);
}

/* ======================
   PIE CHART BMI
====================== */
function chartBMI(kategori) {
  const ctx = document.getElementById("bmiChart");

  // Proporsi edukatif kategori BMI
  const dataKategori = {
    Kurus: 18.5,
    Normal: 24.9,
    Overweight: 29.9,
    Obesitas: 40,
  };

  const labels = Object.keys(dataKategori);
  const values = Object.values(dataKategori);

  const colors = {
    Kurus: "#90CAF9",
    Normal: "#A5D6A7",
    Overweight: "#FFE082",
    Obesitas: "#EF9A9A",
  };

  if (bmiChart) bmiChart.destroy();

  bmiChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: labels.map((l) => colors[l]),
          borderWidth: labels.map((l) => (l === kategori ? 4 : 1)),
          borderColor: labels.map((l) =>
            l === kategori ? "#2E7D32" : "#ffffff"
          ),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: { enabled: false },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
        datalabels: {
          color: "#333",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
            const percent = ((value / total) * 100).toFixed(1);
            return `${ctx.chart.data.labels[ctx.dataIndex]}\n${percent}%`;
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function idealWeightHeight(heightCm, weightKg, age, gender) {
  const heightM = heightCm / 100;

  let bmiMin = 18.5;
  let bmiMax = 24.9;

  // Adjust usia
  let weightTolerance = 0;
  if (age > 40) weightTolerance += 1.5;

  // Adjust gender
  if (gender === "male") weightTolerance += 1;

  // Berat ideal dari tinggi
  let minWeight = bmiMin * (heightM * heightM);
  let maxWeight = bmiMax * (heightM * heightM);

  minWeight = (minWeight - weightTolerance).toFixed(1);
  maxWeight = (maxWeight + weightTolerance).toFixed(1);

  // Tinggi ideal dari berat
  let minHeight = Math.sqrt(weightKg / bmiMax) * 100;
  let maxHeight = Math.sqrt(weightKg / bmiMin) * 100;

  return {
    weightRange: `${minWeight} – ${maxWeight} kg`,
    heightRange: `${minHeight.toFixed(0)} – ${maxHeight.toFixed(0)} cm`,
    note:
      age < 18
        ? "Catatan: BMI dewasa kurang akurat untuk usia di bawah 18 tahun."
        : null,
  };
}

function lifestyleRecommendation(category) {
  const data = {
    kurus: {
      activity: [
        {
          title: "Latihan Kekuatan Ringan",
          tips: [
            "Lakukan latihan beban ringan 2–3 kali per minggu",
            "Fokus pada gerakan dasar seperti squat, push-up, dan plank",
            "Tingkatkan beban secara bertahap sesuai kemampuan tubuh",
          ],
        },
        {
          title: "Aktivitas Fisik Harian",
          tips: [
            "Tetap aktif dengan berjalan kaki atau peregangan ringan",
            "Hindari aktivitas fisik berlebihan yang membakar terlalu banyak kalori",
            "Utamakan aktivitas yang membangun kekuatan, bukan hanya cardio",
          ],
        },
        {
          title: "Pemulihan Tubuh",
          tips: [
            "Berikan waktu istirahat yang cukup setelah berolahraga",
            "Hindari olahraga berat setiap hari tanpa jeda",
            "Dengarkan sinyal lelah dari tubuh",
          ],
        },
      ],
      diet: [
        {
          title: "Peningkatan Asupan Kalori Sehat",
          tips: [
            "Tambahkan porsi makan secara bertahap",
            "Pilih makanan padat nutrisi, bukan sekadar tinggi kalori",
            "Hindari mengganti makan utama dengan camilan saja",
          ],
        },
        {
          title: "Asupan Protein",
          tips: [
            "Konsumsi protein dari telur, ikan, ayam, tahu, atau tempe",
            "Sertakan protein di setiap waktu makan",
            "Protein membantu pembentukan massa otot",
          ],
        },
        {
          title: "Pola Makan Teratur",
          tips: [
            "Makan 3 kali sehari dengan camilan sehat di antaranya",
            "Jangan melewatkan sarapan",
            "Buat jadwal makan yang konsisten",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Kualitas Tidur",
          tips: [
            "Tidur 7–9 jam setiap malam",
            "Tidur dan bangun di jam yang sama setiap hari",
            "Hindari begadang yang tidak perlu",
          ],
        },
        {
          title: "Manajemen Stres",
          tips: [
            "Kelola stres dengan aktivitas relaksasi",
            "Hindari tekanan berlebih pada tubuh",
            "Luangkan waktu untuk istirahat mental",
          ],
        },
      ],
    },

    normal: {
      activity: [
        {
          title: "Olahraga Seimbang",
          tips: [
            "Kombinasikan latihan kekuatan dan cardio",
            "Berolahraga 3–4 kali per minggu",
            "Variasikan jenis olahraga agar tidak bosan",
          ],
        },
        {
          title: "Aktivitas Harian Aktif",
          tips: [
            "Kurangi duduk terlalu lama",
            "Gunakan tangga dibanding lift",
            "Tetap bergerak di sela aktivitas",
          ],
        },
        {
          title: "Pencegahan Cedera",
          tips: [
            "Lakukan pemanasan sebelum olahraga",
            "Pendinginan setelah latihan",
            "Gunakan teknik yang benar",
          ],
        },
      ],
      diet: [
        {
          title: "Pola Makan Seimbang",
          tips: [
            "Penuhi karbohidrat, protein, lemak, vitamin, dan mineral",
            "Perbanyak sayur dan buah",
            "Batasi makanan tinggi gula dan lemak jenuh",
          ],
        },
        {
          title: "Kontrol Porsi",
          tips: [
            "Makan secukupnya sesuai kebutuhan",
            "Hindari makan berlebihan meski makanan sehat",
            "Perhatikan rasa kenyang",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Menjaga Konsistensi",
          tips: [
            "Pertahankan kebiasaan sehat yang sudah baik",
            "Jangan lengah meski berat badan normal",
            "Pantau berat badan secara berkala",
          ],
        },
      ],
    },

    overweight: {
      activity: [
        {
          title: "Cardio Intensitas Sedang",
          tips: [
            "Lakukan jalan cepat, bersepeda, atau berenang",
            "Durasi minimal 30 menit per hari",
            "Lakukan secara konsisten",
          ],
        },
        {
          title: "Latihan Kekuatan",
          tips: [
            "Latihan otot 2–3 kali per minggu",
            "Gunakan berat tubuh sebagai awal",
            "Latihan membantu meningkatkan metabolisme",
          ],
        },
        {
          title: "Aktivitas Fisik Bertahap",
          tips: [
            "Mulai dari intensitas ringan",
            "Tingkatkan perlahan sesuai kemampuan",
            "Hindari olahraga ekstrem mendadak",
          ],
        },
      ],
      diet: [
        {
          title: "Pengaturan Asupan Kalori",
          tips: [
            "Kurangi makanan tinggi gula dan lemak",
            "Batasi minuman manis",
            "Perhatikan ukuran porsi",
          ],
        },
        {
          title: "Peningkatan Serat",
          tips: [
            "Perbanyak sayur, buah, dan biji-bijian",
            "Serat membantu rasa kenyang lebih lama",
            "Baik untuk pencernaan",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Perubahan Kebiasaan",
          tips: [
            "Atur jam makan secara teratur",
            "Kurangi kebiasaan ngemil malam",
            "Tidur cukup dan berkualitas",
          ],
        },
      ],
    },

    obesitas: {
      activity: [
        {
          title: "Aktivitas Fisik Aman",
          tips: [
            "Mulai dengan jalan kaki atau berenang",
            "Pilih aktivitas low-impact",
            "Hindari olahraga yang memberi tekanan berlebih pada sendi",
          ],
        },
        {
          title: "Peningkatan Bertahap",
          tips: [
            "Tambah durasi dan intensitas secara perlahan",
            "Fokus pada konsistensi, bukan kecepatan hasil",
            "Jangan memaksakan diri",
          ],
        },
      ],
      diet: [
        {
          title: "Pengurangan Kalori Sehat",
          tips: [
            "Kurangi makanan tinggi kalori dan rendah nutrisi",
            "Utamakan makanan segar dan alami",
            "Hindari diet ekstrem",
          ],
        },
        {
          title: "Pendampingan Profesional",
          tips: [
            "Pertimbangkan konsultasi dengan tenaga kesehatan",
            "Ikuti rencana makan yang aman",
            "Pantau progres secara berkala",
          ],
        },
      ],
      lifestyle: [
        {
          title: "Pembentukan Kebiasaan Sehat",
          tips: [
            "Mulai dari perubahan kecil",
            "Tetapkan target yang realistis",
            "Bangun rutinitas yang bisa dipertahankan jangka panjang",
          ],
        },
      ],
    },
  };

  return data[category];
}

function renderRecommendation(height, weight, age, gender, category) {
  const ideal = idealWeightHeight(height, weight, age, gender);
  const life = lifestyleRecommendation(category);

  const items = document.querySelectorAll(".recomendation-item p");

  // Ideal Berat/Tinggi
  items[0].innerHTML = `
    ✓ Berat ideal Anda: <b>${ideal.weightRange}</b><br/>
    ✓ Tinggi ideal dari berat saat ini: <b>${ideal.heightRange}</b>
    ${
      ideal.note ? `<br/><small class="text-warning">${ideal.note}</small>` : ""
    }
  `;

  // Aktivitas
  items[1].innerHTML = renderLifeSection(life.activity);

  // Pola makan
  items[2].innerHTML = renderLifeSection(life.diet);

  // Gaya hidup
  items[3].innerHTML = renderLifeSection(life.lifestyle);
}

function renderLifeSection(section) {
  return section
    .map(
      (item) => `
    <div class="mb-3">
      <strong>${item.title}</strong>
      <ul class="mb-0 ps-3">
        ${item.tips.map((tip) => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
  `
    )
    .join("");
}
