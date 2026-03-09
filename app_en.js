const STORAGE_KEY = "tmod-timer-sections-en";
const DEFAULT_SECTIONS = [
  { name: "Opening", duration: 5 },
  { name: "Helper Introductions", duration: 5 },
  { name: "Prepared Speeches", duration: 25 },
  { name: "Table Topics", duration: 20 },
  { name: "Break", duration: 5 },
  { name: "Evaluations", duration: 20 },
  { name: "Closing", duration: 5 },
];

const listEl = document.getElementById("section-list");
const template = document.getElementById("section-row-template");
const addBtn = document.getElementById("add-section");
const setBtn = document.getElementById("set-chart");
const startBtn = document.getElementById("start-timer");
const ctx = document.getElementById("timeline-chart");

let chart;
let timerId;
let startedAt;

function loadSections() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SECTIONS));
    return [...DEFAULT_SECTIONS];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("invalid");
    }
    return parsed.map((item) => ({
      name: String(item.name ?? ""),
      duration: Number.isFinite(Number(item.duration)) ? Number(item.duration) : 0,
    }));
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SECTIONS));
    return [...DEFAULT_SECTIONS];
  }
}

function saveSections() {
  const rows = [...listEl.querySelectorAll(".section-row")];
  const sections = rows.map((row) => ({
    name: row.querySelector(".section-name").value.trim(),
    duration: Number(row.querySelector(".section-duration").value) || 0,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
  return sections;
}

function createRow(section = { name: "", duration: 0 }) {
  const row = template.content.firstElementChild.cloneNode(true);
  row.querySelector(".section-name").value = section.name;
  row.querySelector(".section-duration").value = section.duration;

  row.querySelector(".move-up").addEventListener("click", () => {
    if (row.previousElementSibling) {
      listEl.insertBefore(row, row.previousElementSibling);
      saveSections();
    }
  });

  row.querySelector(".move-down").addEventListener("click", () => {
    if (row.nextElementSibling) {
      listEl.insertBefore(row.nextElementSibling, row);
      saveSections();
    }
  });

  row.querySelector(".remove").addEventListener("click", () => {
    row.remove();
    saveSections();
  });

  row.querySelector(".section-name").addEventListener("input", saveSections);
  row.querySelector(".section-duration").addEventListener("input", saveSections);

  return row;
}

function renderEditor(sections) {
  listEl.innerHTML = "";
  sections.forEach((section) => listEl.append(createRow(section)));
}

function buildPlannedDatasets(sections) {
  return sections.map((section, index) => ({
    label: section.name,
    data: [section.duration],
    stack: "Planned",
    seriesName: "Planned",
    backgroundColor: `hsl(${(index * 47) % 360} 70% 60%)`,
    borderWidth: 1,
    borderColor: "#fff",
    datalabels: {
      color: "#111",
      formatter: () => section.name,
      anchor: "center",
      align: "center",
      clip: true,
    },
  }));
}

function setChart() {
  const sections = saveSections();
  const total = sections.reduce((sum, s) => sum + Math.max(0, s.duration), 0);
  const datasets = buildPlannedDatasets(sections);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Timeline"],
      datasets,
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: total,
          title: { display: true, text: "Minutes" },
        },
        y: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          labels: {
            generateLabels: () => [
              {
                text: "Planned",
                fillStyle: "#60a5fa",
                strokeStyle: "#60a5fa",
                lineWidth: 1,
              },
            ],
          },
        },
      },
    },
    plugins: [ChartDataLabels],
  });
}

function formatMiSs(elapsedSec) {
  const min = Math.floor(elapsedSec / 60);
  const sec = elapsedSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function startTimer() {
  if (!chart) {
    setChart();
  }

  if (timerId) {
    clearInterval(timerId);
  }

  const total = chart.options.scales.x.max;
  let elapsedDataset = chart.data.datasets.find((d) => d.seriesName === "Elapsed");
  if (!elapsedDataset) {
    elapsedDataset = {
      label: "Elapsed",
      seriesName: "Elapsed",
      data: [0],
      stack: "Elapsed",
      backgroundColor: "rgba(31, 41, 55, 0.45)",
      borderColor: "rgba(31, 41, 55, 1)",
      borderWidth: 1,
      datalabels: {
        color: "#fff",
        formatter: (_, context) => formatMiSs(context.dataset.elapsedSec || 0),
      },
      elapsedSec: 0,
    };
    chart.data.datasets.push(elapsedDataset);
  }

  chart.options.plugins.legend.labels.generateLabels = () => [
    {
      text: "Planned",
      fillStyle: "#60a5fa",
      strokeStyle: "#60a5fa",
      lineWidth: 1,
    },
    {
      text: "Elapsed",
      fillStyle: "rgba(31, 41, 55, 0.45)",
      strokeStyle: "rgba(31, 41, 55, 1)",
      lineWidth: 1,
    },
  ];

  startedAt = Date.now();
  timerId = setInterval(() => {
    const elapsedSec = Math.floor((Date.now() - startedAt) / 1000);
    const elapsedMin = elapsedSec / 60;
    elapsedDataset.data[0] = Math.min(total, elapsedMin);
    elapsedDataset.elapsedSec = elapsedSec;
    chart.update();
  }, 1000);
  chart.update();
}

addBtn.addEventListener("click", () => {
  listEl.append(createRow({ name: "", duration: 0 }));
  saveSections();
});
setBtn.addEventListener("click", setChart);
startBtn.addEventListener("click", startTimer);

renderEditor(loadSections());
setChart();
