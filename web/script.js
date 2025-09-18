// Thermal Comfort Survey JavaScript

// Clothing insulation data (CLO values)
const clothingData = {
    male: {
        "briefs_only": { clo: 0.1, description: "Minimal clothing" },
        "shorts_t_shirt": { clo: 0.3, description: "Casual summer wear" },
        "light_trousers_shirt": { clo: 0.5, description: "Light office wear" },
        "trousers_shirt_jacket": { clo: 0.7, description: "Business casual" },
        "suit_jacket": { clo: 0.9, description: "Formal business wear" },
        "heavy_suit_coat": { clo: 1.2, description: "Winter formal wear" },
        "thermal_underwear": { clo: 0.4, description: "Base layer thermal" },
        "sweater_jacket": { clo: 0.8, description: "Casual winter wear" },
        "heavy_coat_scarf": { clo: 1.4, description: "Heavy winter outerwear" }
    },
    female: {
        "underwear_only": { clo: 0.1, description: "Minimal clothing" },
        "shorts_t_shirt": { clo: 0.3, description: "Casual summer wear" },
        "light_dress": { clo: 0.4, description: "Summer dress" },
        "skirt_blouse": { clo: 0.5, description: "Office wear" },
        "trousers_blouse": { clo: 0.6, description: "Business casual" },
        "dress_jacket": { clo: 0.8, description: "Formal business wear" },
        "thermal_underwear": { clo: 0.4, description: "Base layer thermal" },
        "sweater_skirt": { clo: 0.7, description: "Casual winter wear" },
        "heavy_coat_scarf": { clo: 1.4, description: "Heavy winter outerwear" }
    },
    other: {
        "minimal_clothing": { clo: 0.1, description: "Minimal clothing" },
        "light_clothing": { clo: 0.3, description: "Light summer wear" },
        "casual_wear": { clo: 0.5, description: "Casual everyday wear" },
        "business_casual": { clo: 0.7, description: "Business casual" },
        "formal_wear": { clo: 0.9, description: "Formal attire" },
        "thermal_base": { clo: 0.4, description: "Base layer thermal" },
        "winter_casual": { clo: 0.8, description: "Casual winter wear" },
        "heavy_winter": { clo: 1.2, description: "Heavy winter outerwear" }
    }
};

// Activity level data (MET values)
const activityData = {
    "sleeping": { met: 0.8, description: "Sleeping or lying down" },
    "seated_rest": { met: 1.0, description: "Seated, relaxed" },
    "seated_light": { met: 1.2, description: "Seated, light work" },
    "standing_light": { met: 1.4, description: "Standing, light work" },
    "walking_slow": { met: 2.0, description: "Walking slowly (2 mph)" },
    "walking_normal": { met: 3.0, description: "Walking normally (3 mph)" },
    "light_exercise": { met: 4.0, description: "Light exercise or activity" }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateTime();
    setInterval(updateTime, 1000);
    
    setupGenderChangeHandler();
    setupFormValidation();
    setupFormSubmission();
    setupClothingSelection();
}

// Update current time display
function updateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = now.toLocaleString();
    }
}

// Handle gender change to update clothing options
function setupGenderChangeHandler() {
    const genderSelect = document.querySelector('select[name="gender"]');
    if (genderSelect) {
        genderSelect.addEventListener('change', function() {
            updateClothingOptions(this.value);
        });
    }
}

// Update clothing options based on selected gender
function updateClothingOptions(gender) {
    const clothingContainer = document.getElementById('clothing-options');
    if (!clothingContainer) return;

    const genderData = clothingData[gender] || clothingData.other;
    
    clothingContainer.innerHTML = '';
    
    Object.entries(genderData).forEach(([key, data]) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'clothing-option';
        
        optionDiv.innerHTML = `
            <input type="radio" name="clothing_type" value="${key}" id="clothing-${key}" class="clothing-input">
            <label for="clothing-${key}" class="clothing-label">
                <div class="clothing-name">${formatClothingName(key)}</div>
                <div class="clothing-clo">CLO: ${data.clo}</div>
                <div class="clothing-description">${data.description}</div>
            </label>
        `;
        
        clothingContainer.appendChild(optionDiv);
    });
    
    // Add custom CLO input option
    const customDiv = document.createElement('div');
    customDiv.className = 'clothing-option';
    customDiv.innerHTML = `
        <input type="radio" name="clothing_type" value="custom" id="clothing-custom" class="clothing-input">
        <label for="clothing-custom" class="clothing-label">
            <div class="clothing-name">Custom CLO Value</div>
            <div class="clothing-clo">Enter your own CLO value</div>
            <div class="clothing-description">For specific clothing combinations</div>
        </label>
    `;
    clothingContainer.appendChild(customDiv);
    
    // Add custom input field
    const customInputDiv = document.createElement('div');
    customInputDiv.id = 'custom-clo-input';
    customInputDiv.className = 'form-group hidden';
    customInputDiv.innerHTML = `
        <label class="form-label">Custom CLO Value</label>
        <input type="number" name="custom_clo" step="0.1" min="0" max="2" 
               class="form-input" placeholder="0.0 - 2.0">
    `;
    clothingContainer.parentNode.appendChild(customInputDiv);
    
    // Handle custom option selection
    const customRadio = document.getElementById('clothing-custom');
    const customInput = document.getElementById('custom-clo-input');
    if (customRadio && customInput) {
        customRadio.addEventListener('change', function() {
            if (this.checked) {
                customInput.classList.remove('hidden');
            } else {
                customInput.classList.add('hidden');
            }
        });
    }

}

// Format clothing name for display
function formatClothingName(key) {
    return key.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Setup clothing selection handlers
function setupClothingSelection() {
    // Initial setup for default gender
    const genderSelect = document.querySelector('select[name="gender"]');
    if (genderSelect && genderSelect.value) {
        updateClothingOptions(genderSelect.value);
    }
}

// Enhanced PMV calculation (more accurate than simplified version)
function calculatePMV(ta, tr, vel, rh, met, clo) {
    // Coerce and clamp inputs to avoid NaN
    const toNumber = (v, d) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : d;
    };
    ta = toNumber(ta, 23);
    tr = toNumber(tr, ta);
    vel = Math.max(0.05, toNumber(vel, 0.1));
    rh = Math.min(100, Math.max(0, toNumber(rh, 50)));
    met = Math.max(0.8, toNumber(met, 1.2));
    clo = Math.max(0, toNumber(clo, 0.5));

    // Convert inputs to proper units
    const M = met * 58.15;            // Metabolic rate [W/m^2]
    const W = 0;                      // External work [W/m^2]
    const Icl = clo * 0.155;          // Clothing insulation [m^2K/W]
    const Mw = M - W;                 // Internal heat production

    // Partial water vapor pressure [Pa] with bounds to avoid overflow
    let Pa = (rh / 100) * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));
    if (!Number.isFinite(Pa)) Pa = 0;
    Pa = Math.max(0, Math.min(Pa, 7000));

    // Clothing area factor
    const fcl = Icl > 0.078 ? (1.05 + 0.645 * Icl) : (1.0 + 1.29 * Icl);

    // Initial estimates
    let tcl = ta + (35.5 - ta) / (3.5 * (Icl + 0.1));
    let hc = Math.max(12.1 * Math.sqrt(vel), 2.38 * Math.pow(Math.max(0.001, Math.abs(tcl - ta)), 0.25));

    // Iterate to solve for clothing surface temperature
    for (let i = 0; i < 150; i++) {
        const tclPrev = tcl;
        const hrTerm = 3.96e-8 * fcl * (Math.pow(tcl + 273.0, 4) - Math.pow(tr + 273.0, 4));
        hc = Math.max(12.1 * Math.sqrt(vel), 2.38 * Math.pow(Math.max(0.001, Math.abs(tcl - ta)), 0.25));
        const hcTerm = fcl * hc * (tcl - ta);
        tcl = 35.7 - 0.028 * Mw - Icl * (hrTerm + hcTerm);
        if (!Number.isFinite(tcl)) { tcl = tclPrev; break; }
        if (Math.abs(tcl - tclPrev) < 0.001) break;
    }

    // Heat loss terms
    const hl1 = 3.05e-3 * (5733 - 6.99 * Mw - Pa);
    const hl2 = 0.42 * (Mw - 58.15);
    const hl3 = 1.7e-5 * M * (5867 - Pa);
    const hl4 = 0.0014 * M * (34 - ta);
    const hr = 3.96e-8 * fcl * (Math.pow(tcl + 273.0, 4) - Math.pow(tr + 273.0, 4));
    const hcFinal = fcl * hc * (tcl - ta);

    let pmv = (0.303 * Math.exp(-0.036 * M) + 0.028) * (Mw - hl1 - hl2 - hl3 - hl4 - hr - hcFinal);
    if (!Number.isFinite(pmv)) {
        // Fallback simplified approximation to avoid NaN
        const delta = (ta - 22) - 0.5 * (clo - 0.5) + 0.2 * (met - 1.2) + 0.1 * (rh - 50) / 10 - 0.6 * (vel - 0.1);
        pmv = Math.max(-3, Math.min(3, delta / 3));
    }
    return Math.max(-3, Math.min(3, Number(pmv.toFixed(2))));
}

// Debug helper for console testing
function debugPMV(ta, tr, vel, rh, met, clo) {
    const result = { inputs: { ta, tr, vel, rh, met, clo } };
    try {
        const pmv = calculatePMV(ta, tr, vel, rh, met, clo);
        const ppd = calculatePPD(pmv);
        result.pmv = pmv;
        result.ppd = ppd;
    } catch (e) {
        result.error = String(e);
    }
    return result;
}

// PPD calculation from PMV
function calculatePPD(pmv) {
    const ppd = 100 - 95 * Math.exp(-0.03353 * Math.pow(pmv, 4) - 0.2179 * Math.pow(pmv, 2));
    return Math.min(100, parseFloat(ppd.toFixed(1)));
}

// Get clothing insulation value
function getClothingInsulation() {
    const selectedClothing = document.querySelector('input[name="clothing_type"]:checked');
    const customInput = document.querySelector('input[name="custom_clo"]');
    
    if (selectedClothing) {
        if (selectedClothing.value === 'custom' && customInput) {
            return parseFloat(customInput.value) || 0.5;
        } else {
            const gender = document.querySelector('select[name="gender"]').value;
            const genderData = clothingData[gender] || clothingData.other;
            return genderData[selectedClothing.value]?.clo || 0.5;
        }
    }
    
    return 0.5; // Default value
}

// Form validation
function setupFormValidation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    
    if (input.validity.rangeOverflow) {
        input.setCustomValidity(`Value must be ${max} or less`);
    } else if (input.validity.rangeUnderflow) {
        input.setCustomValidity(`Value must be ${min} or more`);
    } else if (isNaN(value) && input.value !== '') {
        input.setCustomValidity('Please enter a valid number');
    } else {
        input.setCustomValidity('');
    }
}

// Form submission handler
function setupFormSubmission() {
    const form = document.getElementById('thermal-survey-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span class="spinner"></span> Processing...';
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this);
            const data = collectFormData(formData);
            
            // Calculate PMV and PPD
            const pmv = calculatePMV(
                data.air_temperature,
                data.mean_radiant_temp,
                data.air_velocity,
                data.relative_humidity,
                data.activity_level,
                data.clothing_insulation
            );
            
            const ppd = calculatePPD(pmv);

            // Validate numeric results to avoid saving NaN -> null in JSON
            if (!Number.isFinite(pmv) || !Number.isFinite(ppd)) {
                showErrorMessage('Invalid inputs produced an invalid result. Please check all fields.');
                return;
            }
            
            // Display results
            displayResults(pmv, ppd);
            
            // Save locally (GitHub Pages has no backend)
            saveToLocalStorage({ ...data, calculated_pmv: pmv, calculated_ppd: ppd });
            showSuccessMessage('Data saved locally on your device.');
            
        } catch (error) {
            console.error('Error processing form:', error);
            alert('An error occurred while processing your data. Please try again.');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    });
}

// Validate entire form
function validateForm() {
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.setCustomValidity('This field is required');
            isValid = false;
        } else {
            field.setCustomValidity('');
        }
    });
    
    // Check if clothing is selected
    const clothingSelected = document.querySelector('input[name="clothing_type"]:checked');
    if (!clothingSelected) {
        alert('Please select your clothing type.');
        isValid = false;
    }
    
    // Check thermal sensation
    const thermalSensation = document.querySelector('input[name="thermal_sensation"]:checked');
    if (!thermalSensation) {
        alert('Please select your thermal sensation.');
        isValid = false;
    }
    
    return isValid;
}

// Collect form data
function collectFormData(formData) {
    return {
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        clothing_insulation: getClothingInsulation(),
        activity_level: parseFloat(formData.get('activity_level')),
        air_temperature: parseFloat(formData.get('air_temperature')),
        relative_humidity: parseFloat(formData.get('relative_humidity')),
        air_velocity: parseFloat(formData.get('air_velocity')),
        mean_radiant_temp: parseFloat(formData.get('mean_radiant_temp')),
        thermal_sensation: parseInt(formData.get('thermal_sensation')),
        thermal_preference: formData.get('thermal_preference'),
        air_movement_preference: formData.get('air_movement_preference'),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`
    };
}

// Display calculation results
function displayResults(pmv, ppd) {
    const pmvElement = document.getElementById('pmv-result');
    const ppdElement = document.getElementById('ppd-result');
    const resultsSection = document.getElementById('results-section');
    
    if (pmvElement) pmvElement.textContent = pmv;
    if (ppdElement) ppdElement.textContent = ppd + '%';
    if (resultsSection) {
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('fade-in');
    }
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Save data to local storage
function saveToLocalStorage(data) {
    try {
        const existingData = JSON.parse(localStorage.getItem('thermal_survey_data') || '[]');
        existingData.push(data);
        localStorage.setItem('thermal_survey_data', JSON.stringify(existingData));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
}

// Show success message
function showSuccessMessage(message) {
    // You can implement a toast notification here
    alert(message);
}

// Show error message
function showErrorMessage(message) {
    // You can implement a toast notification here
    alert(message);
}

// Utility function to get thermal sensation description
function getThermalSensationDescription(value) {
    const descriptions = {
        '-3': 'Cold',
        '-2': 'Cool', 
        '-1': 'Slightly Cool',
        '0': 'Neutral',
        '1': 'Slightly Warm',
        '2': 'Warm',
        '3': 'Hot'
    };
    return descriptions[value.toString()] || 'Unknown';
}

// Export functions for potential external use
window.ThermalComfort = {
    calculatePMV,
    calculatePPD,
    clothingData,
    activityData,
    debugPMV
};
