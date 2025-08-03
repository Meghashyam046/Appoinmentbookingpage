const doctors = [
  {
    id: 1,
    name: "Dr. Rajesh Patel",
    specialization: "Cardiology",
    experience: "15 years",
    languages: "English, Hindi, Gujarati, Marathi",
    fee: "₹500-1000",
    availability: "Available",
    bio: "Senior cardiologist with experience at AIIMS Delhi. Specializes in coronary interventions and pacemaker implants.",
    image: "https://placehold.co/200x200",
    slots: ["Mon 10:00 AM", "Tue 9:30 AM", "Wed 11:00 AM", "Fri 10:30 AM"],
  },
  {
    id: 2,
    name: "Dr. Neha Gupta",
    specialization: "Dermatology",
    experience: "9 years",
    languages: "English, Hindi",
    fee: "₹600",
    availability: "Available",
    bio: "Cosmetic dermatologist specializing in skin rejuvenation treatments.",
    image: "https://placehold.co/200x200",
    slots: ["Tue 10 AM", "Thu 2 PM", "Sat 11 AM"],
  },
];

let selectedDoctor = null;
let selectedSlot = null;

const doctorsListEl = document.getElementById("doctors-list");
const searchInput = document.getElementById("search-input");
const specializationFilter = document.getElementById("specialization-filter");
const doctorModal = document.getElementById("doctor-modal");
const confirmationModal = document.getElementById("confirmation-modal");

function init() {
  renderDoctors(doctors);
  setupEventListeners();
}

function renderDoctors(list) {
  doctorsListEl.innerHTML = "";

  list.forEach((doc) => {
    const card = document.createElement("div");
    card.className =
      "bg-white rounded-xl shadow-md overflow-hidden doctor-card transition duration-300";

    card.innerHTML = `
      <div class="p-4">
        <img src="${doc.image}" alt="${doc.name}" class="rounded-lg w-full h-48 object-cover mb-3"/>
        <h3 class="text-lg font-semibold text-gray-800">${doc.name}</h3>
        <p class="text-blue-600 text-sm">${doc.specialization}</p>
        <p class="text-gray-500 text-sm">${doc.experience}</p>
        <p class="text-gray-600 text-sm mt-2">${doc.bio.slice(0, 80)}...</p>
        <div class="flex justify-between items-center mt-4">
          <span class="text-blue-700 font-bold">${doc.fee}</span>
          <button onclick="openModal(${doc.id})" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Book</button>
        </div>
      </div>
    `;

    doctorsListEl.appendChild(card);
  });
}

function openModal(id) {
  selectedDoctor = doctors.find((d) => d.id === id);
  selectedSlot = null;

  doctorModal.innerHTML = `
    <div class="relative top-20 mx-auto p-5 w-11/12 sm:w-2/3 md:w-1/2 lg:w-2/5 bg-white rounded-xl modal-animate">
      <div class="flex justify-between items-center border-b pb-2 mb-4">
        <h2 class="text-xl font-bold">${selectedDoctor.name}</h2>
        <button onclick="closeModal()">✕</button>
      </div>
      <p class="text-sm text-gray-500 mb-2">${selectedDoctor.specialization} | ${selectedDoctor.experience}</p>
      <p class="text-sm text-gray-600 mb-3">${selectedDoctor.bio}</p>
      <p class="font-medium mb-2">Available Slots:</p>
      <div class="grid grid-cols-2 gap-2 mb-4">
        ${selectedDoctor.slots
          .map(
            (slot) => `<button class="slot-available border px-3 py-1 rounded" onclick="selectSlot('${slot}')">${slot}</button>`
          )
          .join("")}
      </div>
      <form onsubmit="submitBooking(event)" class="space-y-3">
        <input required type="text" id="patient-name" placeholder="Your Name" class="w-full border px-3 py-2 rounded"/>
        <input type="email" id="patient-email" placeholder="Email (optional)" class="w-full border px-3 py-2 rounded"/>
        <input required type="tel" id="patient-phone" placeholder="Phone Number" class="w-full border px-3 py-2 rounded"/>
        <textarea id="patient-concern" placeholder="Describe concern..." class="w-full border px-3 py-2 rounded"></textarea>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Confirm Booking</button>
      </form>
    </div>
  `;

  doctorModal.classList.remove("hidden");
}

function closeModal() {
  doctorModal.classList.add("hidden");
}

function selectSlot(slot) {
  selectedSlot = slot;
  const buttons = doctorModal.querySelectorAll(".slot-available");
  buttons.forEach((b) => b.classList.remove("bg-blue-600", "text-white"));
  const selected = Array.from(buttons).find((b) => b.textContent === slot);
  if (selected) selected.classList.add("bg-blue-600", "text-white");
}

function submitBooking(e) {
  e.preventDefault();
  if (!selectedSlot) {
    alert("Please select a slot");
    return;
  }

  const name = document.getElementById("patient-name").value;
  const phone = document.getElementById("patient-phone").value;
  const email = document.getElementById("patient-email").value;
  const concern = document.getElementById("patient-concern").value;

  // Just display confirmation for demo
  confirmationModal.innerHTML = `
    <div class="relative top-40 mx-auto p-5 w-96 bg-white rounded-xl text-center modal-animate">
      <h3 class="text-xl font-bold text-green-600 mb-2">Appointment Booked!</h3>
      <p class="text-gray-700 mb-2">Dr. ${selectedDoctor.name}</p>
      <p class="text-gray-500 mb-4">${selectedSlot}</p>
      <button onclick="closeConfirmationModal()" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">OK</button>
    </div>
  `;
  closeModal();
  confirmationModal.classList.remove("hidden");

  console.log("Booking info:", {
    name,
    phone,
    email,
    concern,
    doctor: selectedDoctor.name,
    time: selectedSlot,
  });
}

function closeConfirmationModal() {
  confirmationModal.classList.add("hidden");
}

function filterDoctors() {
  const term = searchInput.value.toLowerCase();
  const spec = specializationFilter.value;

  const filtered = doctors.filter(
    (d) =>
      (d.name.toLowerCase().includes(term) || d.specialization.toLowerCase().includes(term)) &&
      (spec === "" || d.specialization === spec)
  );

  renderDoctors(filtered);
}

function setupEventListeners() {
  searchInput.addEventListener("input", filterDoctors);
  specializationFilter.addEventListener("change", filterDoctors);
}

document.addEventListener("DOMContentLoaded", init);
