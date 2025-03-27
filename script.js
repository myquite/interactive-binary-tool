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

    // Add info button to the page
    const infoButton = document.createElement('button');
    infoButton.innerHTML = 'How it Works';
    infoButton.classList.add('info-button');
    infoButton.onclick = showMethodExplanation;
    document.querySelector('.conversion-section').insertBefore(
        infoButton, 
        document.getElementById('decimalInput')
    );
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
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Power of 2 Method for Decimal-to-Binary Conversion</h2>
            
            <p class="method-intro">
                The Power of 2 Method converts decimal numbers to binary by checking which powers of 2 
                fit into the number, starting from the largest. If a power fits, subtract it and write 1; 
                if not, write 0.
            </p>

            <div class="steps-section">
                <h3>Steps:</h3>
                <ol>
                    <li>List powers of 2 (starting from the highest under the number).</li>
                    <li>Check if each power fits into the number.</li>
                    <li>Write 1 if it fits (subtract it) or 0 if it doesn't.</li>
                    <li>Continue until reaching 0.</li>
                </ol>
            </div>

            <div class="example-section">
                <h3>Example: Convert 194 to Binary</h3>
                <p class="powers">Powers of 2: 128, 64, 32, 16, 8, 4, 2, 1</p>
                <ul class="conversion-steps">
                    <li>128 fits → 1 (194 - 128 = 66)</li>
                    <li>64 fits → 1 (66 - 64 = 2)</li>
                    <li>32, 16, 8, 4 don't fit → 0000</li>
                    <li>2 fits → 1 (2 - 2 = 0)</li>
                    <li>1 doesn't fit → 0</li>
                </ul>
                <p class="result">Result: <span class="binary-result">11000010</span> (Binary for 194)</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add close button functionality
    const closeButton = modal.querySelector('.close-button');
    closeButton.onclick = () => modal.remove();

    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    };
} 