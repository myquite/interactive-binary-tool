function illustrateBinaryConversion() {
    // Reset previous results
    const stepsDiv = document.getElementById('conversionSteps');
    const explanationDiv = document.getElementById('explanation');
    stepsDiv.innerHTML = '';
    explanationDiv.innerHTML = '';

    // Get input
    const decimalInput = document.getElementById('decimalInput');
    const decimal = parseInt(decimalInput.value);

    // Validate input
    if (isNaN(decimal) || decimal < 0 || decimal > 255) {
        stepsDiv.innerHTML = '<div class="error-message">Please enter a valid decimal number between 0 and 255.</div>';
        explanationDiv.innerHTML = ''; // Clear any previous explanation
        return;
    }

    // Initialize conversion state
    const state = {
        decimal: decimal,
        remainingValue: decimal,
        currentStep: 0,
        binaryDigits: Array(8).fill(null),
        powers: [128, 64, 32, 16, 8, 4, 2, 1],
        complete: false
    };

    // Create initial UI
    createStepUI(state);
}

function createStepUI(state) {
    const stepsDiv = document.getElementById('conversionSteps');
    const explanationDiv = document.getElementById('explanation');
    stepsDiv.innerHTML = '';
    
    // Show current progress
    const progressDiv = document.createElement('div');
    progressDiv.classList.add('binary-progress');
    progressDiv.innerHTML = `
        <div class="binary-digits">
            ${state.binaryDigits.map((digit, i) => `
                <span class="binary-digit ${state.currentStep === i ? 'current' : ''} ${digit !== null ? 'filled' : ''}">
                    ${digit !== null ? digit : '_'}
                </span>
            `).join('')}
        </div>
        <div class="power-labels">
            ${state.powers.map(power => `<span class="power-label">${power}</span>`).join('')}
        </div>
    `;
    stepsDiv.appendChild(progressDiv);

    if (!state.complete) {
        // Show current step question
        const currentPower = state.powers[state.currentStep];
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('step-question');
        questionDiv.innerHTML = `
            <p>Step ${state.currentStep + 1}: Can we subtract ${currentPower} (2^${7-state.currentStep}) 
            from ${state.remainingValue}?</p>
            <div class="choice-buttons">
                <button onclick="makeChoice(${state.currentStep}, true)">Yes (1)</button>
                <button onclick="makeChoice(${state.currentStep}, false)">No (0)</button>
            </div>
        `;
        stepsDiv.appendChild(questionDiv);
    } else {
        // Show final result
        const finalBinary = state.binaryDigits.join('');
        explanationDiv.innerHTML = `
            <div class="completion-message">
                <h3>🎉 Excellent! You've completed the conversion!</h3>
                <p>${state.decimal} in binary is ${finalBinary}</p>
                <div class="final-explanation">
                    ${generateNumberExplanation(state.decimal, state.binaryDigits, state.powers)}
                </div>
                <button onclick="resetAndFocus()">Try Another Number</button>
            </div>
        `;
    }
}

function makeChoice(step, isYes) {
    const stepsDiv = document.getElementById('conversionSteps');
    const state = getState();
    const power = state.powers[step];
    const isCorrect = (state.remainingValue >= power) === isYes;

    if (isCorrect) {
        // Update state with correct choice
        state.binaryDigits[step] = isYes ? 1 : 0;
        if (isYes) {
            state.remainingValue -= power;
        }
        state.currentStep++;
        state.complete = state.currentStep >= 8;

        // Show feedback and next step
        createStepUI(state);
    } else {
        // Show error feedback
        const feedbackDiv = document.createElement('div');
        feedbackDiv.classList.add('error-feedback');
        feedbackDiv.innerHTML = `
            <p>That's not quite right. Let's think about it:</p>
            <p>We have ${state.remainingValue} and we're checking if we can subtract ${power}.</p>
            <p>Try again!</p>
        `;
        stepsDiv.appendChild(feedbackDiv);
    }
}

function getState() {
    // Retrieve current state from DOM
    const binaryDigits = Array.from(document.querySelectorAll('.binary-digit'))
        .map(digit => digit.textContent.trim() === '_' ? null : parseInt(digit.textContent));
    
    return {
        decimal: parseInt(document.getElementById('decimalInput').value),
        remainingValue: parseInt(document.querySelector('.step-question')?.textContent.match(/from (\d+)\?/)[1] || 0),
        currentStep: binaryDigits.filter(d => d !== null).length,
        binaryDigits: binaryDigits,
        powers: [128, 64, 32, 16, 8, 4, 2, 1],
        complete: false
    };
}

function generateNumberExplanation(decimal, binaryDigits, powers) {
    let terms = [];
    binaryDigits.forEach((digit, index) => {
        if (digit === 1) {
            terms.push(`${powers[index]} (2^${7-index})`);
        }
    });

    return terms.length > 0 
        ? `<p>${decimal} = ${terms.join(' + ')}</p>`
        : `<p>${decimal} = 0</p>`;
}

function resetAndFocus() {
    const decimalInput = document.getElementById('decimalInput');
    decimalInput.value = '';
    decimalInput.focus();
    illustrateBinaryConversion();
}

function showMethodExplanation() {
    document.getElementById('infoModal').style.display = 'flex';
}

function hideMethodExplanation() {
    document.getElementById('infoModal').style.display = 'none';
}

// Add click outside to close
document.getElementById('infoModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideMethodExplanation();
    }
});

// Add escape key to close
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('infoModal').style.display === 'flex') {
        hideMethodExplanation();
    }
}); 