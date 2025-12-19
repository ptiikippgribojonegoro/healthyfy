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
  if (bmi < 18.5) return "Kurus";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obesitas";
}

/* ======================
   WARNA KATEGORI
====================== */
function categoryColor(category) {
  switch (category) {
    case "Kurus":
      return "bg-primary";
    case "Normal":
      return "bg-success";
    case "Overweight":
      return "bg-warning";
    case "Obesitas":
      return "bg-danger";
    default:
      return "bg-secondary";
  }
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
  const badgeColor = categoryColor(category);

  document.getElementById("bmiReport").innerHTML = `
    <h1 id="bmiValue">${bmi}</h1>
    <h3>
      <span id="bmiCategory" class="badge ${badgeColor} text-uppercase">
        ${category}
      </span>
    </h3>
  `;

  chartBMI(category);
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
