let chart;

function calBMI(weight, heightCm) {
  let heightM = heightCm / 100;
  let bmi = weight / (heightM * heightM);
  return bmi.toFixed(1);
}

function getCategoryBMI(bmi) {
  if (bmi < 18.5) {
    return "Kurus";
  } else if (bmi < 25) {
    return "Normal";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obesitas";
  }
}

function postBMI(e) {
  e.preventDefault();

  const age = document.getElementById("age").value;
  const gender = document.getElementById("gender").value;
  const weight = document.getElementById("weight").value;
  const height = document.getElementById("height").value;

  let bmi = calBMI(weight, height);
  let category = getCategoryBMI(bmi);

  document.getElementById("bmiReport").innerHTML = `
  <h1 id="bmiValue">${bmi}</h1>
  <h3><span id="bmiCategory" class="badge bg-danger badge-pill text-uppercase">${category}</span></h3>
  `;
}

function hitungBMI() {
  const usia = document.getElementById("usia").value;
  const gender = document.getElementById("gender").value;
  const berat = document.getElementById("berat").value;
  const tinggi = document.getElementById("tinggi").value / 100;

  if (!usia || !gender || !berat || !tinggi) {
    alert("Lengkapi semua data!");
    return;
  }

  const bmi = berat / (tinggi * tinggi);
  let kategori, aktivitas, makanan, gaya;

  if (bmi < 18.5) kategori = "Kurus";
  else if (bmi < 25) kategori = "Normal";
  else if (bmi < 30) kategori = "Gemuk";
  else kategori = "Obesitas";

  // Rekomendasi berbasis usia & gender
  if (usia < 18) {
    aktivitas = ["Olahraga ringan", "Permainan aktif", "Stretching"];
    makanan = ["Gizi seimbang", "Susu & protein", "Buah segar"];
    gaya = ["Tidur cukup", "Kurangi gadget", "Aktif bergerak"];
  } else if (usia < 40) {
    aktivitas =
      gender === "pria"
        ? ["Gym", "Jogging", "Bersepeda"]
        : ["Yoga", "Cardio ringan", "Renang"];
    makanan = ["Protein cukup", "Karbo kompleks", "Sayur & buah"];
    gaya = ["Olahraga rutin", "Kelola stres", "Hidrasi cukup"];
  } else {
    aktivitas = ["Jalan pagi", "Senam ringan", "Peregangan"];
    makanan = ["Rendah lemak", "Serat tinggi", "Gula rendah"];
    gaya = ["Cek kesehatan rutin", "Tidur teratur", "Kelola stres"];
  }

  document.getElementById("nilaiBMI").innerText = bmi.toFixed(1);
  document.getElementById("kategoriBMI").innerText = kategori;

  isiList("aktivitas", aktivitas);
  isiList("makanan", makanan);
  isiList("gayahidup", gaya);

  tampilkanChart(bmi);
}

function isiList(id, data) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function tampilkanChart(bmi) {
  const ctx = document.getElementById("bmiChart");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Kurus", "Normal", "Gemuk", "Obesitas", "BMI Anda"],
      datasets: [
        {
          data: [18.5, 24.9, 29.9, 35, bmi],
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 40 } },
    },
  });
}
