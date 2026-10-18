
const SUPABASE_URL = "https://dstutcbfpeyivjjiaako.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_E1zJ7PmUg6la5JvwEFpjZA_I6et01cc";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

console.log("TeamUp Campus: Supabase initialized!");

const starterProjects = [
  {
    id: "p1",
    title: "Campus Navigation App",
    description: "Help new students find classrooms, labs, libraries and important places around campus.",
    category: "Web Development",
    skills: ["React", "Maps API", "UI/UX"],
    owner: "Aarav",
    slots: 2,
    icon: "🗺️",
    createdAt: "2026-10-17T10:00:00.000Z"
  },
  {
    id: "p2",
    title: "AI Study Buddy",
    description: "Build a learning assistant that helps students organize notes and understand difficult topics.",
    category: "AI/ML",
    skills: ["Python", "Machine Learning", "Flask"],
    owner: "Priya",
    slots: 3,
    icon: "🤖",
    createdAt: "2026-10-16T10:00:00.000Z"
  },
  {
    id: "p3",
    title: "Campus Sustainability Tracker",
    description: "Create a dashboard to record recycling activities and encourage sustainable campus habits.",
    category: "Social Impact",
    skills: ["JavaScript", "Data Viz", "UI/UX"],
    owner: "Rohan",
    slots: 2,
    icon: "🌱",
    createdAt: "2026-10-15T10:00:00.000Z"
  },
  {
    id: "p4",
    title: "Student Expense Manager",
    description: "Help students track daily expenses, set budgets and understand their spending habits.",
    category: "Web Development",
    skills: ["HTML", "CSS", "JavaScript"],
    owner: "Ananya",
    slots: 1,
    icon: "💰",
    createdAt: "2026-10-14T10:00:00.000Z"
  },
  {
    id: "p5",
    title: "Smart Waste Classifier",
    description: "Explore a machine-learning prototype that helps classify common recyclable materials.",
    category: "AI/ML",
    skills: ["Python", "AI", "Computer Vision"],
    owner: "Kabir",
    slots: 3,
    icon: "♻️",
    createdAt: "2026-10-13T10:00:00.000Z"
  },
  {
    id: "p6",
    title: "Peer Learning Network",
    description: "Connect students who want to learn programming, design, communication and other skills.",
    category: "Social Impact",
    skills: ["React", "Database", "Design"],
    owner: "Meera",
    slots: 2,
    icon: "📚",
    createdAt: "2026-10-12T10:00:00.000Z"
  }
];

const PROJECTS_KEY = "teamup-campus-projects-v1";
const REQUESTS_KEY = "teamup-campus-requests-v1";

const $ = (selector) => document.querySelector(selector);

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

let projects = readStorage(PROJECTS_KEY, starterProjects);
let requests = readStorage(REQUESTS_KEY, []);
let activeCategory = "All";
let activeRequestProject = null;
let toastTimer;

function saveProjects() {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    return true;
  } catch {
    showToast("Browser storage is unavailable. Your changes may not persist.");
    return false;
  }
}

function saveRequests() {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
    return true;
  } catch {
    showToast("Browser storage is unavailable. Your request may not persist.");
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

function renderProjects() {
  const query = $("#searchInput").value.trim().toLowerCase();
  const sort = $("#sortSelect").value;

  const filtered = projects
    .filter((project) => {
      const searchableText = [
        project.title,
        project.description,
        project.category,
        project.owner,
        ...project.skills
      ].join(" ").toLowerCase();

      const matchesSearch = searchableText.includes(query);
      const matchesCategory =
        activeCategory === "All" ||
        project.category === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const difference =
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime();

      return sort === "newest" ? difference : -difference;
    });

  $("#projectCount").textContent =
    `${filtered.length} project${filtered.length === 1 ? "" : "s"}`;

  $("#emptyState").hidden = filtered.length !== 0;

  $("#projectGrid").innerHTML = filtered.map((project) => {
    const skills = project.skills
      .map((skill) =>
        `<span class="skill">${escapeHTML(skill)}</span>`
      ).join("");

    return `
      <article class="project-card">
        <div class="card-top">
          <div class="project-icon">${escapeHTML(project.icon || "💡")}</div>
          <span class="category-label">${escapeHTML(project.category)}</span>
        </div>

        <h3>${escapeHTML(project.title)}</h3>
        <p class="project-description">${escapeHTML(project.description)}</p>

        <div class="skill-list">${skills}</div>

        <div class="project-meta">
          <span>👤 ${escapeHTML(project.owner)}</span>
          <span>👥 ${project.slots} spot${project.slots === 1 ? "" : "s"} open</span>
        </div>

        <div class="card-actions">
          <button class="btn btn-outline"
            data-action="details"
            data-id="${escapeHTML(project.id)}">Details</button>
          <button class="btn btn-primary"
            data-action="join"
            data-id="${escapeHTML(project.id)}">Join Team ↗</button>
        </div>
      </article>
    `;
  }).join("");
}

function openProjectForm() {
  $("#projectForm").reset();
  $("#projectDialog").showModal();
}

function closeDialog(dialog) {
  dialog.close();
}

$("#openForm").addEventListener("click", openProjectForm);
$("#closeForm").addEventListener("click", () =>
  closeDialog($("#projectDialog"))
);
$("#closeRequest").addEventListener("click", () =>
  closeDialog($("#requestDialog"))
);

$("#searchInput").addEventListener("input", renderProjects);
$("#searchBtn").addEventListener("click", renderProjects);
$("#sortSelect").addEventListener("change", renderProjects);

$("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter === button);
  });

  renderProjects();
});

$("#projectGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const project = projects.find((item) => item.id === button.dataset.id);
  if (!project) return;

  if (button.dataset.action === "details") {
    showToast(
      `${project.title} — Skills: ${project.skills.join(", ")}. Contact the project owner through a join request.`
    );
    return;
  }

  activeRequestProject = project;
  $("#requestForm").reset();
  $("#requestProjectName").textContent =
    `You're requesting to join: ${project.title}`;

  $("#requestDialog").showModal();
});

$("#projectForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const title = String(formData.get("title")).trim();
  const description = String(formData.get("description")).trim();
  const owner = String(formData.get("owner")).trim();
  const skills = String(formData.get("skills"))
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 10);

  if (!title || !description || !owner || skills.length === 0) {
    showToast("Please complete all required fields.");
    return;
  }

  const category = String(formData.get("category"));
  const validCategories = [
    "Web Development", "AI/ML", "Social Impact", "Other"
  ];

  if (!validCategories.includes(category)) {
    showToast("Please select a valid category.");
    return;
  }

  const project = {
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title,
    description,
    category,
    skills,
    owner,
    slots: Math.min(5, Math.max(1, Number(formData.get("slots")) || 1)),
    icon: "💡",
    createdAt: new Date().toISOString()
  };

  projects.unshift(project);
  saveProjects();
  closeDialog($("#projectDialog"));

  activeCategory = "All";
  document.querySelectorAll(".filter").forEach((filter) => {
    filter.classList.toggle("active", filter.dataset.category === "All");
  });

  $("#searchInput").value = "";
  renderProjects();
  showToast("Your project has been added!");
  $("#projects").scrollIntoView({ behavior: "smooth" });
});

$("#requestForm").addEventListener("submit", (event) => {
  event.preventDefault();

  if (!activeRequestProject) {
    showToast("Please select a project first.");
    return;
  }

  const studentName = $("#studentName").value.trim();
  const studentSkills = $("#studentSkills").value.trim();
  const studentMessage = $("#studentMessage").value.trim();

  if (!studentName || !studentSkills || !studentMessage) {
    showToast("Please complete all fields.");
    return;
  }

  const duplicate = requests.some((request) =>
    request.projectId === activeRequestProject.id &&
    request.studentName.toLowerCase() === studentName.toLowerCase()
  );

  if (duplicate) {
    showToast("You have already requested to join this project.");
    return;
  }

  requests.push({
    id: `r-${Date.now()}`,
    projectId: activeRequestProject.id,
    projectTitle: activeRequestProject.title,
    studentName,
    studentSkills,
    message: studentMessage,
    status: "Pending",
    createdAt: new Date().toISOString()
  });

  saveRequests();
  closeDialog($("#requestDialog"));
  showToast("Join request saved in this browser!");
});

renderProjects();
