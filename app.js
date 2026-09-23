// Houseplant Water Tracker - Acceptance Criterion 1 Implementation
// "I can add a plant with its name, location, and watering frequency, and see it displayed in a list."

const STORAGE_KEY = 'plant_tracker_data';

document.addEventListener('DOMContentLoaded', () => {
  const plantForm = document.getElementById('plantForm');
  const plantNameInput = document.getElementById('plantName');
  const plantLocationInput = document.getElementById('plantLocation');
  const plantScheduleInput = document.getElementById('plantSchedule');

  const nameError = document.getElementById('nameError');
  const locationError = document.getElementById('locationError');
  const scheduleError = document.getElementById('scheduleError');

  const plantList = document.getElementById('plantList');
  const emptyState = document.getElementById('emptyState');
  const plantCountBadge = document.getElementById('plantCountBadge');

  // Load plants from localStorage
  let plants = getStoredPlants();

  // Initial render of existing plants
  renderAllPlants();

  // Clear validation errors on user input
  [plantNameInput, plantLocationInput, plantScheduleInput].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('input-error');
      const errEl = document.getElementById(input.id + 'Error');
      if (errEl) {
        errEl.classList.remove('visible');
      }
    });
  });

  // Handle Plant Creation Form Submission
  plantForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;

    // Validate Plant Name
    const nameVal = plantNameInput.value.trim();
    if (!nameVal) {
      plantNameInput.classList.add('input-error');
      nameError.textContent = 'Plant name is required.';
      nameError.classList.add('visible');
      hasErrors = true;
    } else {
      plantNameInput.classList.remove('input-error');
      nameError.classList.remove('visible');
    }

    // Validate Location
    const locationVal = plantLocationInput.value.trim();
    if (!locationVal) {
      plantLocationInput.classList.add('input-error');
      locationError.textContent = 'Room or spot location is required.';
      locationError.classList.add('visible');
      hasErrors = true;
    } else {
      plantLocationInput.classList.remove('input-error');
      locationError.classList.remove('visible');
    }

    // Validate Watering Frequency (integer >= 1)
    const scheduleVal = Number(plantScheduleInput.value);
    if (!plantScheduleInput.value.trim() || isNaN(scheduleVal) || scheduleVal < 1 || !Number.isInteger(scheduleVal)) {
      plantScheduleInput.classList.add('input-error');
      scheduleError.textContent = 'Please enter a valid schedule of 1 day or more.';
      scheduleError.classList.add('visible');
      hasErrors = true;
    } else {
      plantScheduleInput.classList.remove('input-error');
      scheduleError.classList.remove('visible');
    }

    if (hasErrors) {
      return;
    }

    // Create plant object matching PRD Data Model
    const newPlant = {
      id: `plant_${Date.now()}`,
      name: nameVal,
      location: locationVal,
      waterEveryDays: scheduleVal,
      lastWateredDate: null,
      wateredAt: null,
    };

    // Prepend to list and persist
    plants.unshift(newPlant);
    saveStoredPlants(plants);

    // Render new plant card and update UI
    renderAllPlants();

    // Clear form and restore focus
    plantForm.reset();
    plantNameInput.focus();
  });

  /**
   * Reads plant array from localStorage
   */
  function getStoredPlants() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.error('Error reading from localStorage:', err);
      return [];
    }
  }

  /**
   * Writes plant array to localStorage
   */
  function saveStoredPlants(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }

  /**
   * Renders the complete plant list
   */
  function renderAllPlants() {
    // Clear previously rendered cards (preserving emptyState container element)
    plantList.innerHTML = '';

    if (plantCountBadge) {
      plantCountBadge.textContent = plants.length;
    }

    if (plants.length === 0) {
      if (emptyState) {
        emptyState.style.display = 'block';
        plantList.appendChild(emptyState);
      }
      return;
    }

    if (emptyState) {
      emptyState.style.display = 'none';
    }

    plants.forEach((plant) => {
      const card = createPlantCardElement(plant);
      plantList.appendChild(card);
    });
  }

  /**
   * Creates DOM element for a plant card matching PRD structure
   */
  function createPlantCardElement(plant) {
    const card = document.createElement('article');
    card.className = 'plant-card';
    card.id = plant.id;

    const info = document.createElement('div');
    info.className = 'plant-info';

    const title = document.createElement('h3');
    title.className = 'plant-name';
    title.textContent = plant.name;

    const meta = document.createElement('div');
    meta.className = 'plant-meta';
    meta.textContent = `📍 ${plant.location} • Water every ${plant.waterEveryDays} ${
      plant.waterEveryDays === 1 ? 'day' : 'days'
    }`;

    const badge = document.createElement('span');
    const today = new Date().toISOString().split('T')[0];
    const currentDate = plant.lastWateredDate || plant.wateredAt;

    if (currentDate === today) {
      badge.className = 'status-badge watered';
      badge.textContent = `Status: Watered today! (${today})`;
    } else if (currentDate) {
      badge.className = 'status-badge watered';
      badge.textContent = `Status: Watered (${currentDate})`;
    } else {
      badge.className = 'status-badge due';
      badge.textContent = 'Status: Needs water';
    }

    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(badge);

    const waterBtn = document.createElement('button');
    waterBtn.type = 'button';
    waterBtn.className = 'btn-water';

    if (currentDate === today) {
      waterBtn.innerHTML = '✓ Watered';
      waterBtn.disabled = true;
      waterBtn.style.opacity = '0.7';
      waterBtn.style.cursor = 'default';
    } else {
      waterBtn.innerHTML = '💧 Water';
    }

    // Water button click handler
    waterBtn.addEventListener('click', () => {
      const todayStr = new Date().toISOString().split('T')[0];

      // Update both PRD-compliant lastWateredDate and backwards-compatible wateredAt
      plant.lastWateredDate = todayStr;
      plant.wateredAt = todayStr;

      // Persist updated list to localStorage
      saveStoredPlants(plants);

      // Update UI
      badge.className = 'status-badge watered';
      badge.textContent = `Status: Watered today! (${todayStr})`;
      waterBtn.innerHTML = '✓ Watered';
      waterBtn.disabled = true;
      waterBtn.style.opacity = '0.7';
      waterBtn.style.cursor = 'default';
    });

    card.appendChild(info);
    card.appendChild(waterBtn);

    return card;
  }
});
