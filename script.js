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
      activity:
        "Latihan kekuatan ringan 2–3x/minggu untuk meningkatkan massa otot.",
      diet: "Tingkatkan asupan protein, karbohidrat kompleks, dan lemak sehat.",
      lifestyle: "Tidur cukup dan hindari melewatkan waktu makan.",
    },
    normal: {
      activity: "Kombinasi cardio dan strength training 3–4x/minggu.",
      diet: "Pertahankan pola makan seimbang dengan gizi lengkap.",
      lifestyle: "Kelola stres dan pertahankan rutinitas sehat.",
    },
    overweight: {
      activity: "Cardio intensitas sedang 30 menit/hari + latihan ringan.",
      diet: "Kurangi gula, gorengan, dan perbanyak serat.",
      lifestyle: "Atur jam makan dan tingkatkan aktivitas harian.",
    },
    obesitas: {
      activity: "Aktivitas low-impact seperti jalan kaki & berenang.",
      diet: "Fokus defisit kalori sehat dan konsultasi profesional.",
      lifestyle: "Bangun kebiasaan kecil yang konsisten.",
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
    Berat ideal Anda: <b>${ideal.weightRange}</b><br/>
    Tinggi ideal dari berat saat ini: <b>${ideal.heightRange}</b>
    ${
      ideal.note ? `<br/><small class="text-warning">${ideal.note}</small>` : ""
    }
  `;

  // Aktivitas
  items[1].innerHTML = life.activity;

  // Pola makan
  items[2].innerHTML = life.diet;

  // Gaya hidup
  items[3].innerHTML = life.lifestyle;
}
