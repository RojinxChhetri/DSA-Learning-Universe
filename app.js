// ====================================================================================
    // SECTION: DOM Elements & Global State 
    // ====================================================================================
    const algorithmSelect = document.getElementById('algorithm-select');
    const arrayInput = document.getElementById('array-input');
    const arraySizeInput = document.getElementById('array-size-input'); 
    const visualizeBtn = document.getElementById('visualize-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pauseResumeBtn = document.getElementById('pause-resume-btn');
    const nextStepBtn = document.getElementById('next-step-btn');
    const visualizationArea = document.getElementById('visualization-area');
    const explanationTextElement = document.getElementById('explanation-text');
    const speedControl = document.getElementById('speed-control');
    const speedValueDisplay = document.getElementById('speed-value'); 
    const dataTypeRadios = document.querySelectorAll('input[name="dataType"]');
    
    const genRandomBtn = document.getElementById('gen-random-btn');
    const genNearlySortedBtn = document.getElementById('gen-nearly-sorted-btn');
    const genReversedBtn = document.getElementById('gen-reversed-btn');
    const genFewUniqueBtn = document.getElementById('gen-few-unique-btn');

    const toggleInfoPanelBtn = document.getElementById('toggle-info-panel-btn');
    const infoPanelIcon = document.getElementById('info-panel-icon');
    const currentAlgoNameInfo = document.getElementById('current-algo-name-info');
    const infoCodePanel = document.getElementById('info-code-panel');
    const learnContent = document.getElementById('learn-content');
    const codeContent = document.getElementById('code-content');
    const pseudoCodeArea = document.getElementById('pseudo-code-area');
    const infoCodeTabs = document.querySelectorAll('.info-code-tab');

    const progressBar = document.getElementById('progress-bar');
    const stepCounterElement = document.getElementById('step-counter');

    let animationSpeed = parseInt(speedControl.value);
    let initialArrayState = []; 
    let currentArrayVisual = []; 
    let isSortingInProgress = false;
    let isPaused = false;
    let forceNextStep = false;
    let currentAlgorithmGenerator = null; 
    let resolvePausePromise = null; 
    let totalStepsInAlgorithm = 0;
    let currentStepNumber = 0;
    const MAX_ARRAY_SIZE = 25; 

    const ALGORITHM_DETAILS = {
        bubbleSort: {
            name: "Bubble Sort (The Gentle Bubbler)",
            description: "Bubble Sort is like watching bubbles rise! It repeatedly steps through the list, compares adjacent items, and swaps them if they are in the wrong order. The largest (or smallest) items 'bubble' to their correct position at one end of thelist with each pass.",
            timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)"},
            spaceComplexity: "O(1)", stable: "Yes", inPlace: "Yes",
            pseudoCode: [
                "function BubbleSort(array):",
                "  n = length of array",
                "  for i from 0 to n-2:",
                "    swapped = false",
                "    for j from 0 to n-i-2: // Inner loop shrinks",
                "      if array[j] > array[j+1]: // Compare",
                "        swap(array[j], array[j+1]) // Swap",
                "        swapped = true",
                "    if not swapped: break // Optimization",
                "  return array"
            ],
            codeLineMap: { init: [0,1], outerLoop: [2], innerLoopInit: [3,4], compare: [5], swap: [6,7], checkSwapped: [8], finish: [9]}
        },
        selectionSort: {
            name: "Selection Sort (The Smart Picker)",
            description: "Selection Sort picks the smallest item and puts it at the beginning. Then finds the next smallest from the rest, and so on, building a sorted list from left to right.",
            timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
            spaceComplexity: "O(1)", stable: "No", inPlace: "Yes",
            pseudoCode: [
                "function SelectionSort(array):",
                "  n = length of array",
                "  for i from 0 to n-2:",
                "    minIndex = i // Assume current is min",
                "    for j from i+1 to n-1: // Find actual min",
                "      if array[j] < array[minIndex]:",
                "        minIndex = j // New min found",
                "    if minIndex != i: // If new min is different",
                "      swap(array[i], array[minIndex]) // Swap",
                "  return array"
            ],
             codeLineMap: { init: [0,1], outerLoop: [2], assumeMin: [3], findMinLoop: [4], compareMin: [5], newMin: [6], checkSwap: [7], swap: [8], finish: [9]}
        },
        insertionSort: {
            name: "Insertion Sort (The Card Master)",
            description: "Insertion Sort is like sorting cards in your hand. Pick one card (item) at a time and insert it into its correct spot in the already sorted part of your hand.",
            timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)"},
            spaceComplexity: "O(1)", stable: "Yes", inPlace: "Yes",
            pseudoCode: [
                "function InsertionSort(array):",
                "  n = length of array",
                "  for i from 1 to n-1:",
                "    key = array[i] // Card to insert",
                "    j = i - 1 // Last card in sorted hand",
                "    // Shift cards in hand > key to the right",
                "    while j >= 0 and array[j] > key:",
                "      array[j+1] = array[j] // Shift",
                "      j = j - 1",
                "    array[j+1] = key // Insert card",
                "  return array"
            ],
            codeLineMap: { init: [0,1], outerLoop: [2], pickKey: [3,4], whileLoopCompare: [5,6], shift: [7,8], insertKey: [9], finish: [10]}
        },
        quickSort: { 
            name: "Quick Sort (The Speedy Chief - First Pivot!)", // Updated name slightly
            description: "Quick Sort picks the first item in a section as a 'pivot'. It then shuffles that section so all items smaller than the pivot are on its left, and larger ones on its right. This 'partitioning' is done recursively on the sub-sections until sorted. Super fast on average!",
            timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)"},
            spaceComplexity: "O(log n) to O(n)", stable: "No", inPlace: "Yes",
            pseudoCode: [
                "function QuickSort(array, low, high):",
                "  if low < high:",
                "    pi = partition(array, low, high) // Partition around pivot",
                "    QuickSort(array, low, pi - 1)  // Sort left sub-array",
                "    QuickSort(array, pi + 1, high) // Sort right sub-array",
                "",
                "function partition(array, low, high):",
                "  pivot = array[low] // Pivot is the FIRST element",
                "  i = low // Index for the end of the 'smaller' section",
                "  // Iterate from second element to end of partition",
                "  for j from low + 1 to high:",
                "    if array[j] < pivot: // Compare element with pivot",
                "      i = i + 1",
                "      swap(array[i], array[j]) // Move smaller element to 'smaller' section",
                "  // Place pivot in its correct sorted position",
                "  swap(array[low], array[i]) // Swap original pivot position with end of 'smaller' section",
                "  return i // Return pivot's final index"
            ],
            codeLineMap: { 
                quickSortCall: [0,1],
                partitionCall: [2],
                recursiveCallLeft: [3],
                recursiveCallRight: [4],
                partitionInit: [6,7,8], 
                partitionLoop: [9,10],
                partitionCompare: [11],
                partitionSwapCondition: [12,13], 
                pivotSwap: [14,15], 
                partitionReturn: [16]
            }
        },
         mergeSort: {
            name: "Merge Sort (The Divide & Conqueror)",
            description: "Merge Sort is a master of 'divide and conquer'! It breaks the list down into tiny pieces (usually single items), and then merges those pieces back together in sorted order. It's like perfectly organizing two sorted piles of cards into one bigger sorted pile.",
            timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
            spaceComplexity: "O(n) - Needs extra space (like a temporary table) to merge.",
            stable: "Yes",
            inPlace: "No (typically)",
            pseudoCode: [
                "function MergeSort(array, left, right):",
                "  if left < right:",
                "    // Find the middle point to divide the array",
                "    middle = floor((left + right) / 2)",
                "    // Recursively sort the first and second halves",
                "    MergeSort(array, left, middle)",
                "    MergeSort(array, middle + 1, right)",
                "    // Merge the sorted halves",
                "    merge(array, left, middle, right)",
                "",
                "function merge(array, left, middle, right):",
                "  // Create temporary arrays",
                "  n1 = middle - left + 1",
                "  n2 = right - middle",
                "  LeftArray = new array of size n1",
                "  RightArray = new array of size n2",
                "  // Copy data to temp arrays",
                "  for i from 0 to n1-1: LeftArray[i] = array[left + i]",
                "  for j from 0 to n2-1: RightArray[j] = array[middle + 1 + j]",
                "  // Merge the temp arrays back into array[left..right]",
                "  i = 0 // Initial index of first subarray",
                "  j = 0 // Initial index of second subarray",
                "  k = left // Initial index of merged subarray",
                "  while i < n1 and j < n2:",
                "    if LeftArray[i] <= RightArray[j]:",
                "      array[k] = LeftArray[i]",
                "      i = i + 1",
                "    else:",
                "      array[k] = RightArray[j]",
                "      j = j + 1",
                "    k = k + 1",
                "  // Copy remaining elements of LeftArray[], if any",
                "  while i < n1:",
                "    array[k] = LeftArray[i]",
                "    i = i + 1; k = k + 1",
                "  // Copy remaining elements of RightArray[], if any",
                "  while j < n2:",
                "    array[k] = RightArray[j]",
                "    j = j + 1; k = k + 1"
            ],
            codeLineMap: {
                recursiveCall: [0, 1],
                findMiddle: [2, 3],
                recursiveCallLeft: [4, 5],
                recursiveCallRight: [6],
                mergeCall: [7, 8],
                mergeInit: [10, 11, 12, 13, 14, 15],
                copyLeft: [16, 17],
                copyRight: [18, 19],
                mergeLoopInit: [20, 21, 22, 23],
                mergeCompare: [24, 25], // Compare step
                mergeTakeLeft: [26, 27],
                mergeTakeRight: [28, 29, 30],
                mergeIncrementK: [31],
                copyRemainingLeft: [32, 33, 34],
                copyRemainingRight: [35, 36, 37]
            }
        }
    };


    // ====================================================================================
    // SECTION: Core Visualization & Rendering
    // ====================================================================================
    function renderArray(arr, highlights = {}, isChar = false, partitionInfo = null) {
        visualizationArea.innerHTML = ''; 
        if (!arr || arr.length === 0) {
            visualizationArea.innerHTML = '<p class="text-gray-500 self-center comic-text text-xl">Hmm, nothing to show here yet!</p>';
            return;
        }

        const charCodeA = 'A'.charCodeAt(0);
        const charCodeZ = 'Z'.charCodeAt(0);
        const alphabetSize = charCodeZ - charCodeA + 1;

        const numericValues = arr.map(item => {
            if (isChar) {
                const charVal = String(item.value).toUpperCase();
                if (charVal.length === 1 && charVal.charCodeAt(0) >= charCodeA && charVal.charCodeAt(0) <= charCodeZ) {
                    return charVal.charCodeAt(0) - charCodeA + 1; 
                }
                return 1; 
            }
            // Use the actual value for numeric height calculation, handle 0 specifically later
            return item.value !== undefined ? item.value : 0; 
        });
        
        // Find min/max based on actual values for scaling, not just absolute
        const minValue = isChar ? 1 : Math.min(0, ...numericValues.filter(v => typeof v === 'number')); // Consider 0 or negative numbers
        const maxValue = isChar ? alphabetSize : Math.max(1, ...numericValues.filter(v => typeof v === 'number'));
        const range = maxValue - minValue; // Calculate range for scaling

        const containerHeight = visualizationArea.clientHeight - 70; 
        const barWidth = Math.max(10, Math.min(75, (visualizationArea.clientWidth / (arr.length + 2)) - 6)); 

        arr.forEach((item, index) => {
            const barWrapper = document.createElement('div'); 
            barWrapper.style.display = 'inline-block';
            barWrapper.style.position = 'relative';

            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.style.width = `${barWidth}px`;
            
            const displayVal = item.displayValue !== undefined ? item.displayValue : item.value;
            let currentNumericValue = numericValues[index]; 

            let barHeight;
            const minBarHeight = 15; // Minimum visible height in pixels

            if (isChar) {
                // Scale based on position in alphabet (1-26) relative to alphabetSize
                 barHeight = range > 0 ? ((currentNumericValue - minValue) / range) * containerHeight : containerHeight / 2;
            } else {
                // Scale numbers based on their position within the min/max range
                 barHeight = range > 0 ? ((item.value - minValue) / range) * containerHeight : containerHeight / 2; // Use item.value for correct scaling
            }
            
            // Ensure minimum height and handle 0 value explicitly
            barHeight = Math.max(minBarHeight, barHeight); 
            if (item.value === 0 && !isChar) {
                barHeight = minBarHeight; // Ensure 0 has the minimum height
            }


            bar.style.height = `${barHeight}px`; 

            const textElement = document.createElement('div');
            if (isChar) {
                textElement.classList.add('bar-char-value');
            } else {
                textElement.classList.add('bar-value-container');
            }
            textElement.textContent = displayVal;
            
            // --- Text Visibility Logic ---
            if (barHeight <= minBarHeight + 5) { // If bar is very close to minimum height
                 textElement.style.display = 'none'; 
            } 
            else if (barHeight < 40 && String(displayVal).length > 1) { 
                textElement.style.fontSize = '0.7rem';
                textElement.style.paddingBottom = '5px'; 
            } else if (barHeight < 25) { 
                 textElement.style.fontSize = '0.65rem';
                 textElement.style.paddingBottom = '4px';
                 textElement.style.overflow = 'hidden';
                 textElement.style.whiteSpace = 'nowrap';
                 textElement.style.textOverflow = 'clip'; 
            }
             // --- End Text Visibility Logic ---


            bar.appendChild(textElement);
            
            bar.className = 'bar highlight-base'; // Start with base for active highlights

            // Apply specific highlights
            if (highlights.compare && highlights.compare.length === 2) {
                if (highlights.compare[0] === index) bar.classList.add('highlight-compare-A');
                if (highlights.compare[1] === index) bar.classList.add('highlight-compare-B');
            } else if (highlights.compare && highlights.compare.includes(index)) { 
                 bar.classList.add('highlight-compare-A');
            }
             if (highlights.mergeTemp && highlights.mergeTemp.includes(index)) bar.classList.add('highlight-merge-temp');
             if (highlights.mergeTarget === index) bar.classList.add('highlight-merge-target');


            if (highlights.swap && highlights.swap.includes(index)) bar.classList.add('highlight-swap');
            if (highlights.sorted && highlights.sorted.includes(index)) bar.classList.add('highlight-sorted');
            if (highlights.pivot === index) bar.classList.add('highlight-pivot');
            if (highlights.min === index) bar.classList.add('highlight-min');
            
            barWrapper.appendChild(bar);
            visualizationArea.appendChild(barWrapper);
        });
    }

    // ====================================================================================
    // SECTION: Utility Functions & Interactive Logic (largely unchanged)
    // ====================================================================================
    async function stepDelay() {
        if (forceNextStep) {
            forceNextStep = false; 
            isPaused = true; 
            pauseResumeBtn.innerHTML = '<i class="fas fa-play-circle"></i>Resume';
            pauseResumeBtn.classList.replace('bg-amber-500', 'bg-green-500');
            pauseResumeBtn.classList.replace('hover:bg-amber-600', 'hover:bg-green-600');
            pauseResumeBtn.classList.add('paused');
            nextStepBtn.disabled = false; 
            return; 
        }
        if (isPaused) {
            nextStepBtn.disabled = false; 
            return new Promise(resolve => { resolvePausePromise = resolve; });
        }
        nextStepBtn.disabled = true; 
        return delay(animationSpeed);
    }

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function getDataType() { return document.querySelector('input[name="dataType"]:checked').value; }
    
    function parseInput(inputStr, dataType) {
        if (!inputStr.trim()) return [];
        const rawArray = inputStr.split(',').map(s => s.trim()).filter(s => s !== "");
        if (dataType === 'numbers') {
            return rawArray.map((val, index) => {
                const num = parseFloat(val);
                return isNaN(num) ? null : { value: num, displayValue: val, id: `num-${index}-${Math.random()}` };
            }).filter(item => item !== null);
        } else { 
            return rawArray.map((char, index) => ({ 
                value: char.length > 0 ? char[0].toUpperCase() : '?', 
                displayValue: (char.length > 0 ? char[0] : '?'),      
                id: `char-${index}-${Math.random()}` 
            }));
        }
    }
    
    function toggleMainControls(disabled) {
        visualizeBtn.disabled = disabled;
        resetBtn.disabled = !disabled; 
        algorithmSelect.disabled = disabled;
        arrayInput.disabled = disabled;
        arraySizeInput.disabled = disabled; 
        dataTypeRadios.forEach(radio => radio.disabled = disabled);
        speedControl.disabled = disabled;
        [genRandomBtn, genNearlySortedBtn, genReversedBtn, genFewUniqueBtn].forEach(btn => btn.disabled = disabled);
        
        pauseResumeBtn.disabled = !disabled;
        if (!disabled) { 
            pauseResumeBtn.disabled = true;
            nextStepBtn.disabled = true;
            pauseResumeBtn.innerHTML = '<i class="fas fa-pause-circle"></i>Pause';
            pauseResumeBtn.classList.replace('bg-green-500', 'bg-amber-500');
            pauseResumeBtn.classList.replace('hover:bg-green-600', 'hover:bg-amber-600');
             pauseResumeBtn.classList.remove('paused');
        }
    }

    function updateKidFriendlyExplanation(htmlContent) { explanationTextElement.innerHTML = htmlContent; }
    
    function updateProgressBarAndSteps(current, total) {
        currentStepNumber = current;
        totalStepsInAlgorithm = total; 
        const percentage = total > 0 ? Math.min(100, (current / total) * 100) : 0;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
        stepCounterElement.textContent = `Step ${current} / ~${total > 0 ? total : '?'}`;
    }

    function highlightCodeLines(lines = []) {
        const codeLines = pseudoCodeArea.querySelectorAll('.code-line');
        codeLines.forEach(line => line.classList.remove('highlighted-code'));
        if (lines && lines.length > 0) {
            lines.forEach(lineNumber => {
                if (codeLines[lineNumber]) {
                    codeLines[lineNumber].classList.add('highlighted-code');
                }
            });
        }
    }
    
    function updateAlgorithmInfoPanel(algoKey) {
        const details = ALGORITHM_DETAILS[algoKey];
        if (!details) {
            learnContent.innerHTML = "<p>Details for this algorithm are not available yet.</p>";
            pseudoCodeArea.innerHTML = "Pseudo-code not available.";
            currentAlgoNameInfo.textContent = "This Algorithm";
            return;
        }
        currentAlgoNameInfo.textContent = details.name.split('(')[0].trim(); 

        learnContent.innerHTML = `
            <h4 class="comic-text">${details.name}</h4>
            <p>${details.description}</p>
            <h4>Super Powers (Characteristics):</h4>
            <ul>
                <li><strong>Time Travel (Time Complexity):</strong>
                    <ul>
                        <li>Best Case: <code class="inline-complexity">${details.timeComplexity.best}</code></li>
                        <li>Average Case: <code class="inline-complexity">${details.timeComplexity.average}</code></li>
                        <li>Worst Case: <code class="inline-complexity">${details.timeComplexity.worst}</code></li>
                    </ul>
                </li>
                <li><strong>Memory Space (Space Complexity):</strong> <code class="inline-complexity">${details.spaceComplexity}</code></li>
                <li><strong>Is it Stable?</strong> ${details.stable}</li>
                <li><strong>In-Place Sorting?</strong> ${details.inPlace}</li>
            </ul>
        `;

        pseudoCodeArea.innerHTML = details.pseudoCode.map(line => `<span class="code-line">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`).join('');
        highlightCodeLines(details.codeLineMap.init || []); 
    }


    // ====================================================================================
    // SECTION: Algorithm Implementations (QuickSort updated, MergeSort added)
    // ====================================================================================

    async function* bubbleSort(arr, isChar) { // Logic largely same, relies on renderArray for new compare highlights
        const n = arr.length;
        let newArr = JSON.parse(JSON.stringify(arr)); 
        totalStepsInAlgorithm = (n * (n - 1)) / 2 + n; 
        currentStepNumber = 0;
        updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);

        updateKidFriendlyExplanation(`<strong>Let's Bubble Sort!</strong> 🛁<br>Imagine these items are bubbles. Heavier (bigger) ones float to the end! We compare pairs, and if the left is bigger, they swap!`);
        yield { type: 'step', array: [...newArr], highlights: {}, codeConcept: 'init' }; 
        await stepDelay();

        for (let i = 0; i < n - 1; i++) {
            currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
            let swappedThisPass = false;
            updateKidFriendlyExplanation(`<strong>Round ${i + 1} of Bubbling!</strong> 🫧<br>Checking from the start, but skipping already sorted bubbles at the end.`);
            yield { type: 'step', array: [...newArr], highlights: {sorted: Array.from({length: i}, (_, k) => n - 1 - k)}, codeConcept: 'outerLoop' };
            await stepDelay();

            for (let j = 0; j < n - i - 1; j++) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                const val1 = newArr[j].value; 
                const val2 = newArr[j+1].value;
                const disp1 = newArr[j].displayValue; 
                const disp2 = newArr[j+1].displayValue;
                
                updateKidFriendlyExplanation(`We're looking at <code>${disp1}</code> (orange) and <code>${disp2}</code> (teal). Is <code>${disp1}</code> bigger than <code>${disp2}</code>?`);
                yield { type: 'step', array: [...newArr], highlights: { compare: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) }, codeConcept: 'compare' };
                await stepDelay();

                const compareCondition = isChar ? val1 > val2 : val1 > val2;

                if (compareCondition) {
                    updateKidFriendlyExplanation(`Yes! <code>${disp1}</code> is bigger than <code>${disp2}</code>. So... SWAP! 🔄`);
                    [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
                    swappedThisPass = true;
                    yield { type: 'step', array: [...newArr], highlights: { swap: [j, j + 1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) }, codeConcept: 'swap' };
                    await stepDelay();
                } else {
                     updateKidFriendlyExplanation(`Nope! <code>${disp1}</code> is smaller or the same as <code>${disp2}</code>. They stay put! 👍`);
                     yield { type: 'step', array: [...newArr], highlights: { compare: [j, j+1], sorted: Array.from({length: i}, (_, k) => n - 1 - k) }, codeConcept: 'compare' }; 
                     await stepDelay();
                }
            }
            let sortedIndices = Array.from({length: i + 1}, (_, k) => n - 1 - k);
            updateKidFriendlyExplanation(`<strong>Round ${i + 1} Done!</strong> ✅<br>Item <code>${newArr[n-1-i].displayValue}</code> has bubbled to its final spot!`);
            yield { type: 'step', array: [...newArr], highlights: { sorted: sortedIndices }, codeConcept: 'checkSwapped' };
            await stepDelay();

            if (!swappedThisPass && i < n -2) {
                updateKidFriendlyExplanation(`<strong>Hold On!</strong> 🤔<br>No items swapped in that whole round! That means... everything is ALREADY SORTED! Awesome! 🎉`);
                break; 
            }
        }
        const allIndices = newArr.map((_, idx) => idx);
        updateProgressBarAndSteps(totalStepsInAlgorithm, totalStepsInAlgorithm); 
        yield { type: 'final', array: [...newArr], highlights: { sorted: allIndices }, codeConcept: 'finish' }; 
        updateKidFriendlyExplanation(`<strong>Bubble Sort Complete!</strong> 🥳<br>All items are in order! Final list: <code>[${newArr.map(item => item.displayValue).join(', ')}]</code>`);
    }

    async function* selectionSort(arr, isChar) { // Logic largely same
        const n = arr.length;
        let newArr = JSON.parse(JSON.stringify(arr));
        totalStepsInAlgorithm = n * n; 
        currentStepNumber = 0;
        updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);

        updateKidFriendlyExplanation(`<strong>Selection Sort Time!</strong> 👇<br>We find the smallest item and put it at the beginning. Then find the next smallest from the rest, and so on!`);
        yield { type: 'step', array: [...newArr], highlights: {}, codeConcept: 'init' };
        await stepDelay();

        for (let i = 0; i < n - 1; i++) {
            currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
            let minIdx = i;
            updateKidFriendlyExplanation(`<strong>Finding Smallest (Round ${i + 1}):</strong><br>Looking for the smallest item from <code>${newArr[i].displayValue}</code> onwards. For now, we think <code>${newArr[minIdx].displayValue}</code> (pink) is smallest.`);
            yield { type: 'step', array: [...newArr], highlights: { min: minIdx, sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'assumeMin' };
            await stepDelay();

            for (let j = i + 1; j < n; j++) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                const currentMinVal = newArr[minIdx].value; 
                const currentItemVal = newArr[j].value;   
                const currentMinDisp = newArr[minIdx].displayValue;
                const currentItemDisp = newArr[j].displayValue;

                updateKidFriendlyExplanation(`Is <code>${currentItemDisp}</code> (orange) smaller than our current smallest, <code>${currentMinDisp}</code> (pink)?`);
                yield { type: 'step', array: [...newArr], highlights: { compare: [j, minIdx], min: minIdx, sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'compareMin' };
                await stepDelay();
                
                const compareCondition = isChar ? currentItemVal < currentMinVal : currentItemVal < currentMinVal;

                if (compareCondition) {
                    minIdx = j; // New minimum found
                    updateKidFriendlyExplanation(`Yes! <code>${newArr[minIdx].displayValue}</code> (now pink) is the new smallest we've found in this round!`);
                    yield { type: 'step', array: [...newArr], highlights: { min: minIdx, sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'newMin' };
                    await stepDelay();
                } else {
                    updateKidFriendlyExplanation(`Nope! <code>${newArr[minIdx].displayValue}</code> (pink) is still the smallest seen so far this round.`);
                     await stepDelay();
                }
            }

            if (minIdx !== i) {
                updateKidFriendlyExplanation(`The smallest item in the rest of the list is <code>${newArr[minIdx].displayValue}</code>. Let's swap it with <code>${newArr[i].displayValue}</code>! 🔄`);
                [newArr[i], newArr[minIdx]] = [newArr[minIdx], newArr[i]];
                yield { type: 'step', array: [...newArr], highlights: { swap: [i, minIdx], sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'swap' };
                await stepDelay();
            } else {
                updateKidFriendlyExplanation(`<code>${newArr[i].displayValue}</code> was already the smallest in this section! No swap needed. 👍`);
                yield { type: 'step', array: [...newArr], highlights: { min: i, sorted: Array.from({length: i + 1}, (_, k) => k) }, codeConcept: 'checkSwap' }; 
                await stepDelay();
            }
            updateKidFriendlyExplanation(`<strong>Round ${i + 1} Done!</strong> ✅<br>Item <code>${newArr[i].displayValue}</code> is now in its correct sorted spot!`);
            yield { type: 'step', array: [...newArr], highlights: { sorted: Array.from({length: i + 1}, (_, k) => k) } }; 
            await stepDelay();
        }
        const allIndices = newArr.map((_, idx) => idx);
        updateProgressBarAndSteps(totalStepsInAlgorithm, totalStepsInAlgorithm);
        yield { type: 'final', array: [...newArr], highlights: { sorted: allIndices }, codeConcept: 'finish' };
        updateKidFriendlyExplanation(`<strong>Selection Sort Complete!</strong> 🥳<br>All items are perfectly placed! Final list: <code>[${newArr.map(item => item.displayValue).join(', ')}]</code>`);
    }

    async function* insertionSort(arr, isChar) { // Logic largely same
        const n = arr.length;
        let newArr = JSON.parse(JSON.stringify(arr));
        totalStepsInAlgorithm = n * (n + 1) / 2; 
        currentStepNumber = 0;
        updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);

        updateKidFriendlyExplanation(`<strong>Insertion Sort, Let's Go!</strong> 🃏<br>Like sorting cards in your hand! Pick one, find its spot in the sorted part, and slide it in!`);
        if (n > 0) { 
             yield { type: 'step', array: [...newArr], highlights: { sorted: [0] }, codeConcept: 'init' };
        } else {
             yield { type: 'step', array: [...newArr], highlights: {}, codeConcept: 'init' };
        }
        await stepDelay();

        for (let i = 1; i < n; i++) {
            currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
            let currentCard = newArr[i]; 
            let j = i - 1; 
            updateKidFriendlyExplanation(`<strong>Picking up <code>${currentCard.displayValue}</code> (orange)!</strong><br>Where does it fit in our sorted hand: <code>[${newArr.slice(0, i).map(c=>c.displayValue).join(', ')}]</code>?`);
            yield { type: 'step', array: [...newArr], highlights: { compare: [i], sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'pickKey' };
            await stepDelay();

            const currentCardCompareVal = currentCard.value;

            while (j >= 0) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                const cardInHandVal = newArr[j].value; 
                const cardInHandDisp = newArr[j].displayValue;

                updateKidFriendlyExplanation(`Comparing our new card <code>${currentCard.displayValue}</code> (orange) with <code>${cardInHandDisp}</code> (teal) from our sorted hand.`);
                yield { type: 'step', array: [...newArr], highlights: { compare: [i, j], sorted: Array.from({length: i}, (_,k)=>k) }, codeConcept: 'whileLoopCompare' };
                await stepDelay();
                
                const shouldShift = isChar ? cardInHandVal > currentCardCompareVal : cardInHandVal > currentCardCompareVal;

                if (shouldShift) {
                    updateKidFriendlyExplanation(`<code>${cardInHandDisp}</code> is bigger than <code>${currentCard.displayValue}</code>. Shift <code>${cardInHandDisp}</code> to the right! 👉`);
                    newArr[j + 1] = newArr[j]; 
                    yield { type: 'step', array: [...newArr], highlights: { swap: [j+1], compare:[i], sorted: Array.from({length: i}, (_, k) => k) }, codeConcept: 'shift' }; 
                    j--;
                    await stepDelay();
                } else {
                    updateKidFriendlyExplanation(`<code>${cardInHandDisp}</code> is NOT bigger than <code>${currentCard.displayValue}</code>. So, <code>${currentCard.displayValue}</code> will go right after it!`);
                    await stepDelay();
                    break; 
                }
            }
            newArr[j + 1] = currentCard;
            updateKidFriendlyExplanation(`Found it! Inserting <code>${currentCard.displayValue}</code> at index ${j + 1}. Sorted hand is growing!`);
            const sortedIndices = Array.from({length: i + 1}, (_, k) => k);
            yield { type: 'step', array: [...newArr], highlights: { sorted: sortedIndices, swap: [j+1] }, codeConcept: 'insertKey' };
            await stepDelay();
        }
        const allIndices = newArr.map((_, idx) => idx);
        updateProgressBarAndSteps(totalStepsInAlgorithm, totalStepsInAlgorithm);
        yield { type: 'final', array: [...newArr], highlights: { sorted: allIndices }, codeConcept: 'finish' };
        updateKidFriendlyExplanation(`<strong>Insertion Sort Complete!</strong> 🥳<br>All cards perfectly sorted! Final hand: <code>[${newArr.map(item => item.displayValue).join(', ')}]</code>`);
    }
    
    async function* quickSort(arrUnused, isChar, low, high, fullArrayRef) {
        if (totalStepsInAlgorithm === 0 && fullArrayRef.length > 0) { 
            totalStepsInAlgorithm = Math.max(1, fullArrayRef.length * (Math.log2(fullArrayRef.length || 1) + 1) * 2.5); 
        }
        currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm); 

        if (low < high) {
            updateKidFriendlyExplanation(`<strong>Quick Sort! (Section ${low}-${high})</strong> ⚡️<br>Picking first item as pivot. Smaller items go left, bigger go right!`);
            renderArray(fullArrayRef, {}, isChar, {low, high, pivotIndex: null}); 
            yield { type: 'step', array: [...fullArrayRef], highlights: {pivot: low}, codeConcept: 'quickSortCall' }; 
            await stepDelay();

            // Partitioning logic with pivot as array[low]
            const pivot = fullArrayRef[low]; 
            const pivotValue = pivot.value;
            const pivotDisplayValue = pivot.displayValue;
            let i = low; 

            updateKidFriendlyExplanation(`Pivot for section ${low}-${high} is <code>${pivotDisplayValue}</code> (purple). Let's partition!`);
            yield { type: 'step', array: [...fullArrayRef], highlights: { pivot: low }, codeConcept: 'partitionInit' };
            await stepDelay();

            for (let j = low + 1; j <= high; j++) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                updateKidFriendlyExplanation(`Comparing <code>${fullArrayRef[j].displayValue}</code> (orange) with pivot <code>${pivotDisplayValue}</code> (purple).`);
                yield { type: 'step', array: [...fullArrayRef], highlights: { pivot: low, compare: [j, low] }, codeConcept: 'partitionCompare' };
                await stepDelay();

                const compareCondition = isChar ? fullArrayRef[j].value < pivotValue : fullArrayRef[j].value < pivotValue;

                if (compareCondition) {
                    i++; 
                    updateKidFriendlyExplanation(`<code>${fullArrayRef[j].displayValue}</code> < pivot. Swapping <code>${fullArrayRef[i].displayValue}</code> with <code>${fullArrayRef[j].displayValue}</code> to move smaller item left. 🔄`);
                    [fullArrayRef[i], fullArrayRef[j]] = [fullArrayRef[j], fullArrayRef[i]]; 
                    yield { type: 'step', array: [...fullArrayRef], highlights: { pivot: low, swap: [i, j] }, codeConcept: 'partitionSwapCondition' };
                    await stepDelay();
                } else {
                     updateKidFriendlyExplanation(`<code>${fullArrayRef[j].displayValue}</code> >= pivot. It stays on the right side for now.`);
                     await stepDelay();
                }
            }

            if (i !== low) { 
                updateKidFriendlyExplanation(`Placing pivot <code>${pivotDisplayValue}</code> in its final sorted spot! Swapping <code>${fullArrayRef[low].displayValue}</code> with <code>${fullArrayRef[i].displayValue}</code>. 🔄`);
                [fullArrayRef[low], fullArrayRef[i]] = [fullArrayRef[i], fullArrayRef[low]]; 
            } else {
                 updateKidFriendlyExplanation(`Pivot <code>${pivotDisplayValue}</code> is already in its correct spot for this partition.`);
            }
            const pivotFinalIndex = i;
            yield { type: 'step', array: [...fullArrayRef], highlights: { sorted: [pivotFinalIndex], swap: (i !== low ? [low, pivotFinalIndex] : []) }, codeConcept: 'pivotSwap' }; 
            updateKidFriendlyExplanation(`Pivot <code>${fullArrayRef[pivotFinalIndex].displayValue}</code> is now at index ${pivotFinalIndex}! Partition complete.`);
            await stepDelay();
            updateKidFriendlyExplanation(`Now, Quick Sort the left (<code>${low}-${pivotFinalIndex - 1}</code>) and right (<code>${pivotFinalIndex + 1}-${high}</code>) parts separately! ✨`);
            await stepDelay();

            yield* quickSort(null, isChar, low, pivotFinalIndex - 1, fullArrayRef);
            yield* quickSort(null, isChar, pivotFinalIndex + 1, high, fullArrayRef);
        } else if (low === high && low >=0 && low < fullArrayRef.length) {
            updateKidFriendlyExplanation(`Section <code>${low}-${high}</code> has one item: <code>${fullArrayRef[low].displayValue}</code>. It's sorted! 👍`);
            yield { type: 'step', array: [...fullArrayRef], highlights: { sorted: [low] }, codeConcept: 'quickSortCall' }; 
            await stepDelay();
        } else if (low > high) { 
             updateKidFriendlyExplanation(`Section <code>${low}-${high}</code> is empty or done, nothing to sort here!`);
             await stepDelay(); 
        }
    }
    
    // --- NEW: Merge Sort ---
    async function* mergeSort(arr, isChar, left = 0, right = arr.length - 1, fullArrayRef = arr) {
         if (totalStepsInAlgorithm === 0 && fullArrayRef.length > 0) { 
            totalStepsInAlgorithm = Math.max(1, fullArrayRef.length * (Math.log2(fullArrayRef.length || 1) + 1) * 3); 
        }
        currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm); 

        if (left < right) {
            const middle = Math.floor((left + right) / 2);
            updateKidFriendlyExplanation(`<strong>Merge Sort: Splitting!</strong> 쪼<br>Dividing section <code>${left}-${right}</code> into two halves: <code>${left}-${middle}</code> and <code>${middle + 1}-${right}</code>.`);
            yield { type: 'step', array: [...fullArrayRef], highlights: { compare: Array.from({length: right-left+1}, (_,k)=>left+k) }, codeConcept: 'findMiddle' }; 
            await stepDelay();

            // Recursively sort both halves
            yield* mergeSort(arr, isChar, left, middle, fullArrayRef);
            yield* mergeSort(arr, isChar, middle + 1, right, fullArrayRef);

            // Merge the sorted halves
            updateKidFriendlyExplanation(`<strong>Merge Sort: Merging!</strong> ✨<br>Putting the sorted halves <code>${left}-${middle}</code> and <code>${middle + 1}-${right}</code> back together in perfect order.`);
            yield { type: 'step', array: [...fullArrayRef], highlights: { mergeTarget: -1, mergeTemp: Array.from({length: right-left+1}, (_,k)=>left+k)}, codeConcept: 'mergeCall' }; 
            await stepDelay();

            // --- Merge Logic ---
            const n1 = middle - left + 1;
            const n2 = right - middle;
            let LeftArray = new Array(n1);
            let RightArray = new Array(n2);

            // Copy data to temp arrays
            for (let i_copy = 0; i_copy < n1; i_copy++) LeftArray[i_copy] = fullArrayRef[left + i_copy];
            yield { type: 'step', array: [...fullArrayRef], highlights: { mergeTemp: Array.from({length: n1}, (_,k)=>left+k) }, codeConcept: 'copyLeft' }; 
             await stepDelay();
            for (let j_copy = 0; j_copy < n2; j_copy++) RightArray[j_copy] = fullArrayRef[middle + 1 + j_copy];
             yield { type: 'step', array: [...fullArrayRef], highlights: { mergeTemp: Array.from({length: n2}, (_,k)=>middle+1+k) }, codeConcept: 'copyRight' }; 
             await stepDelay();


            let i = 0, j = 0, k = left;
            yield { type: 'step', array: [...fullArrayRef], highlights: { mergeTemp: Array.from({length: n1+n2}, (_,idx)=>left+idx) }, codeConcept: 'mergeLoopInit' }; 
            await stepDelay();


            while (i < n1 && j < n2) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                const leftVal = LeftArray[i].value;
                const rightVal = RightArray[j].value;
                 const leftDisp = LeftArray[i].displayValue;
                 const rightDisp = RightArray[j].displayValue;

                updateKidFriendlyExplanation(`Merging... Comparing <code>${leftDisp}</code> (from left half - yellow) and <code>${rightDisp}</code> (from right half - purple).`);
                // Highlight elements being compared *conceptually* and target merge position k
                yield { type: 'step', array: [...fullArrayRef], highlights: { mergeTemp: [left + i, middle + 1 + j], mergeTarget: k }, codeConcept: 'mergeCompare' }; 
                await stepDelay();

                const compareCondition = isChar ? leftVal <= rightVal : leftVal <= rightVal;

                if (compareCondition) {
                    updateKidFriendlyExplanation(`<code>${leftDisp}</code> is smaller or equal. Placing it into the main array at position ${k}.`);
                    fullArrayRef[k] = LeftArray[i];
                    // Highlight the target position in the main array and the source conceptual index
                    yield { type: 'step', array: [...fullArrayRef], highlights: { swap: [k], mergeTemp: [left+i] }, codeConcept: 'mergeTakeLeft' }; 
                    i++;
                } else {
                    updateKidFriendlyExplanation(`<code>${rightDisp}</code> is smaller. Placing it into the main array at position ${k}.`);
                    fullArrayRef[k] = RightArray[j];
                    yield { type: 'step', array: [...fullArrayRef], highlights: { swap: [k], mergeTemp: [middle+1+j] }, codeConcept: 'mergeTakeRight' }; 
                    j++;
                }
                k++;
                await stepDelay();
            }

            // Copy remaining elements
            while (i < n1) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                updateKidFriendlyExplanation(`Copying remaining element <code>${LeftArray[i].displayValue}</code> from the left half.`);
                fullArrayRef[k] = LeftArray[i];
                 yield { type: 'step', array: [...fullArrayRef], highlights: { swap: [k], mergeTemp: [left+i] }, codeConcept: 'copyRemainingLeft' };
                i++; k++;
                await stepDelay();
            }
            while (j < n2) {
                currentStepNumber++; updateProgressBarAndSteps(currentStepNumber, totalStepsInAlgorithm);
                updateKidFriendlyExplanation(`Copying remaining element <code>${RightArray[j].displayValue}</code> from the right half.`);
                fullArrayRef[k] = RightArray[j];
                 yield { type: 'step', array: [...fullArrayRef], highlights: { swap: [k], mergeTemp: [middle+1+j] }, codeConcept: 'copyRemainingRight' };
                j++; k++;
                await stepDelay();
            }
             updateKidFriendlyExplanation(`Section <code>${left}-${right}</code> is now merged and sorted!`);
             yield { type: 'step', array: [...fullArrayRef], highlights: { sorted: Array.from({length: right-left+1}, (_,idx)=>left+idx) }}; 
             await stepDelay();

        } else if (left === right) {
            updateKidFriendlyExplanation(`Section <code>${left}-${right}</code> has one item: <code>${fullArrayRef[left].displayValue}</code>. It's sorted! 👍`);
            yield { type: 'step', array: [...fullArrayRef], highlights: { sorted: [left] }, codeConcept: 'recursiveCall' }; 
            await stepDelay();
        }
    }


    // ====================================================================================
    // SECTION: Main Control Logic & Event Handlers (largely unchanged)
    // ====================================================================================
    async function runVisualization() {
        if (isSortingInProgress && !isPaused) return; 
        if (isSortingInProgress && isPaused) { 
            isPaused = false;
            pauseResumeBtn.innerHTML = '<i class="fas fa-pause-circle"></i>Pause';
            pauseResumeBtn.classList.replace('bg-green-500', 'bg-amber-500');
            pauseResumeBtn.classList.replace('hover:bg-green-600', 'hover:bg-amber-600');
             pauseResumeBtn.classList.remove('paused');
            nextStepBtn.disabled = true;
            if (resolvePausePromise) {
                resolvePausePromise();
                resolvePausePromise = null;
            }
            return;
        }

        const selectedAlgorithmKey = algorithmSelect.value;
        const dataType = getDataType(); 
        const parsedArray = parseInput(arrayInput.value, dataType);

        if (parsedArray.length === 0) {
            visualizationArea.innerHTML = '<p class="text-red-500 self-center font-medium comic-text">Oopsie! Add some items first!</p>';
            updateKidFriendlyExplanation("You need to give me some items (like numbers or letters, separated by commas) to sort! Try again. 😊");
            return;
        }
        if (parsedArray.length > MAX_ARRAY_SIZE) { 
            visualizationArea.innerHTML = `<p class="text-red-500 self-center font-medium comic-text">Whoa, big list! Try max ${MAX_ARRAY_SIZE} items for the best show.</p>`;
            updateKidFriendlyExplanation(`That's a long list! It's easier to see the magic with a smaller one (up to ${MAX_ARRAY_SIZE} items).`);
            return;
        }
        
        updateAlgorithmInfoPanel(selectedAlgorithmKey); 
        initialArrayState = JSON.parse(JSON.stringify(parsedArray)); 
        currentArrayVisual = JSON.parse(JSON.stringify(parsedArray)); 

        isSortingInProgress = true; 
        isPaused = false;
        forceNextStep = false;
        currentStepNumber = 0;
        totalStepsInAlgorithm = 0; 
        updateProgressBarAndSteps(0,0); 

        toggleMainControls(true); 
        renderArray(currentArrayVisual, {}, dataType === 'characters'); 
        updateKidFriendlyExplanation(`Preparing for the <strong>${ALGORITHM_DETAILS[selectedAlgorithmKey].name}</strong> adventure... Hold tight! ⏳`);
        await delay(700); 
        updateKidFriendlyExplanation(`Alright, let's get this <strong>${ALGORITHM_DETAILS[selectedAlgorithmKey].name}</strong> party started! 🥳`);
        
        const isChar = dataType === 'characters';
        let algorithmInstance; 

        switch (selectedAlgorithmKey) {
            case 'bubbleSort':    algorithmInstance = bubbleSort(currentArrayVisual, isChar); break;
            case 'selectionSort': algorithmInstance = selectionSort(currentArrayVisual, isChar); break;
            case 'insertionSort': algorithmInstance = insertionSort(currentArrayVisual, isChar); break;
            case 'quickSort':     
                algorithmInstance = quickSort(null, isChar, 0, currentArrayVisual.length - 1, currentArrayVisual);
                break;
             case 'mergeSort':     
                algorithmInstance = mergeSort(currentArrayVisual, isChar, 0, currentArrayVisual.length - 1, currentArrayVisual);
                break;
            default:
                updateKidFriendlyExplanation("Hmm, I don't know that sorting adventure yet! 🤔");
                isSortingInProgress = false; 
                toggleMainControls(false); 
                return;
        }
        currentAlgorithmGenerator = algorithmInstance; 
        let lastYieldedArrayFromGenerator = null; 

        try {
            for await (const step of currentAlgorithmGenerator) {
                if (!isSortingInProgress && !isPaused) { 
                     throw { name: "GeneratorInterrupted", message: "Reset during active run." };
                }
                if (step.codeConcept && ALGORITHM_DETAILS[selectedAlgorithmKey] && ALGORITHM_DETAILS[selectedAlgorithmKey].codeLineMap) {
                    const linesToHighlight = ALGORITHM_DETAILS[selectedAlgorithmKey].codeLineMap[step.codeConcept];
                    if (linesToHighlight) highlightCodeLines(linesToHighlight);
                }

                let arrayToRenderThisStep;
                if (selectedAlgorithmKey === 'quickSort' || selectedAlgorithmKey === 'mergeSort') {
                    arrayToRenderThisStep = step.array; 
                } else {
                    arrayToRenderThisStep = step.array;
                    lastYieldedArrayFromGenerator = step.array; 
                }
                renderArray(arrayToRenderThisStep, step.highlights, isChar, step.partitionInfo);
            }

            // Final state after loop completion
            if (isSortingInProgress || (isPaused && currentAlgorithmGenerator && (await currentAlgorithmGenerator.next({done: true})).done) ) { 
                let finalArrayForDisplay;
                 if (selectedAlgorithmKey === 'quickSort' || selectedAlgorithmKey === 'mergeSort') {
                    finalArrayForDisplay = currentArrayVisual; 
                } else {
                    if (lastYieldedArrayFromGenerator) {
                        currentArrayVisual = JSON.parse(JSON.stringify(lastYieldedArrayFromGenerator)); 
                        finalArrayForDisplay = currentArrayVisual;
                    } else if (currentArrayVisual.length > 0) {
                        finalArrayForDisplay = currentArrayVisual;
                    } else { 
                        finalArrayForDisplay = initialArrayState;
                    }
                }
                
                const allIndices = finalArrayForDisplay.map((_, idx) => idx);
                renderArray(finalArrayForDisplay, { sorted: allIndices }, isChar);
                highlightCodeLines(ALGORITHM_DETAILS[selectedAlgorithmKey]?.codeLineMap.finish || []);
                updateProgressBarAndSteps(totalStepsInAlgorithm || currentStepNumber, totalStepsInAlgorithm || currentStepNumber);


                if(!isPaused) { 
                    updateKidFriendlyExplanation(`<strong>All Done with ${ALGORITHM_DETAILS[selectedAlgorithmKey].name}!</strong> 🎉<br>Look at that beautifully sorted list: <code>[${finalArrayForDisplay.map(item => item.displayValue).join(', ')}]</code>. You're a sorting superstar! 🌟`);
                } else {
                     updateKidFriendlyExplanation(`<strong>Finished ${ALGORITHM_DETAILS[selectedAlgorithmKey].name}!</strong> 🎉 (Paused at the end).<br>Final list: <code>[${finalArrayForDisplay.map(item => item.displayValue).join(', ')}]</code>. Hit Reset for a new go!`);
                }
            }
        } catch (error) {
            if (error.name === 'GeneratorInterrupted') {
                console.log("Sorting generator was interrupted by reset.");
                updateKidFriendlyExplanation("Sorting stopped! Ready for a new adventure?");
            } else {
                console.error("Error during visualization:", error);
                updateKidFriendlyExplanation(`Uh oh! Something went a bit wobbly: ${error.message}. Try resetting?`);
            }
        } finally {
            if (!isPaused) { 
                isSortingInProgress = false; 
                toggleMainControls(false); 
                currentAlgorithmGenerator = null; 
            } else if (isPaused && (!currentAlgorithmGenerator || (currentAlgorithmGenerator && (await currentAlgorithmGenerator.next({done: true})).done) ) ) {
                isSortingInProgress = false;
                resetBtn.disabled = false;
                visualizeBtn.disabled = true; 
                pauseResumeBtn.disabled = true; 
                nextStepBtn.disabled = true; 
            }
        }
    }
    
    function handleReset() {
        isSortingInProgress = false; 
        isPaused = false;
        forceNextStep = false;

        if (currentAlgorithmGenerator && typeof currentAlgorithmGenerator.return === 'function') {
            currentAlgorithmGenerator.return({value: undefined, done: true}); 
        }
        currentAlgorithmGenerator = null;
        if(resolvePausePromise) { resolvePausePromise(); resolvePausePromise = null; }
        
        toggleMainControls(false); 
        updateProgressBarAndSteps(0,0); 
        highlightCodeLines([]); 
        
        const currentInputVal = arrayInput.value;
        const currentDataType = getDataType();
        const parsedFromInput = parseInput(currentInputVal, currentDataType);

        if (parsedFromInput.length > 0) {
            initialArrayState = JSON.parse(JSON.stringify(parsedFromInput));
            currentArrayVisual = JSON.parse(JSON.stringify(parsedFromInput));
            renderArray(currentArrayVisual, {}, currentDataType === 'characters');
            updateKidFriendlyExplanation("Reset! ✨ Let's try that again or pick a new adventure with this list!");
        } else if (initialArrayState && initialArrayState.length > 0) { 
            currentArrayVisual = JSON.parse(JSON.stringify(initialArrayState));
            renderArray(currentArrayVisual, {}, getDataType()); 
            updateKidFriendlyExplanation("Reset! ✨ Using the last list you gave me. Ready to go!");
        } else {
            visualizationArea.innerHTML = '<p class="text-gray-400 self-center comic-text text-xl">Ready for some sorting fun!</p>';
            updateKidFriendlyExplanation("Everything's reset! Enter some items and pick a sorting adventure!");
            currentArrayVisual = []; 
            initialArrayState = []; 
        }
        resetBtn.disabled = true; 
        visualizeBtn.disabled = false;
        pauseResumeBtn.innerHTML = '<i class="fas fa-pause-circle"></i>Pause';
        pauseResumeBtn.classList.replace('bg-green-500', 'bg-amber-500');
        pauseResumeBtn.classList.replace('hover:bg-green-600', 'hover:bg-amber-600');
         pauseResumeBtn.classList.remove('paused');
    }

    function handlePauseResume() {
        if (!isSortingInProgress && !currentAlgorithmGenerator) return;

        isPaused = !isPaused;
        if (isPaused) {
            pauseResumeBtn.innerHTML = '<i class="fas fa-play-circle"></i>Resume';
            pauseResumeBtn.classList.replace('bg-amber-500', 'bg-green-500');
            pauseResumeBtn.classList.replace('hover:bg-amber-600', 'hover:bg-green-600');
            pauseResumeBtn.classList.add('paused'); 
            nextStepBtn.disabled = false;
            updateKidFriendlyExplanation("Paused! ⏸️ Take a breather. Click Resume or Next Step when you're ready!");
        } else { 
            pauseResumeBtn.innerHTML = '<i class="fas fa-pause-circle"></i>Pause';
            pauseResumeBtn.classList.replace('bg-green-500', 'bg-amber-500');
            pauseResumeBtn.classList.replace('hover:bg-green-600', 'hover:bg-amber-600');
            pauseResumeBtn.classList.remove('paused');
            nextStepBtn.disabled = true;
            updateKidFriendlyExplanation("Resuming the adventure! 🚀");
            if (resolvePausePromise) {
                resolvePausePromise();
                resolvePausePromise = null;
            }
        }
    }

    function handleNextStep() {
        if (!isSortingInProgress || !isPaused) return;
        forceNextStep = true; 
        nextStepBtn.disabled = true; 
        if (resolvePausePromise) {
            resolvePausePromise();
            resolvePausePromise = null;
        }
    }

    // Array Generation Button Handlers
    function generateAndDisplayArray(generatorFn) {
        let size = parseInt(arraySizeInput.value);
        if (isNaN(size) || size < 5 || size > MAX_ARRAY_SIZE) {
            alert(`Please enter a size between 5 and ${MAX_ARRAY_SIZE}.`);
            arraySizeInput.value = Math.max(5, Math.min(MAX_ARRAY_SIZE, size || 12)); 
            return;
        }

        const isChar = getDataType() === 'characters';
        const newArray = generatorFn(size, isChar);
        arrayInput.value = newArray.map(item => item.displayValue).join(',');
        initialArrayState = JSON.parse(JSON.stringify(newArray));
        currentArrayVisual = JSON.parse(JSON.stringify(newArray));
        renderArray(currentArrayVisual, {}, isChar);
        updateKidFriendlyExplanation("New array generated! Ready to sort. ✨");
        handleReset(); 
        resetBtn.disabled = false; 
    }

    genRandomBtn.addEventListener('click', () => generateAndDisplayArray((size, isChar) => {
        const arr = [];
        const startChar = 'A'.charCodeAt(0);
        for (let i = 0; i < size; i++) {
            if (isChar) {
                const char = String.fromCharCode(startChar + Math.floor(Math.random() * 26));
                arr.push({ value: char, displayValue: char, id: `gchar-${i}`});
            } else {
                const val = Math.floor(Math.random() * 100) + 1; 
                arr.push({ value: val, displayValue: String(val), id: `gnum-${i}`});
            }
        }
        return arr;
    }));

    genNearlySortedBtn.addEventListener('click', () => generateAndDisplayArray((size, isChar) => {
        let arr = [];
        const startChar = 'A'.charCodeAt(0);
        for (let i = 0; i < size; i++) {
            if (isChar) {
                const char = String.fromCharCode(startChar + i);
                arr.push({ value: char, displayValue: char, id: `gchar-${i}`});
            } else {
                arr.push({ value: i + 1, displayValue: String(i+1), id: `gnum-${i}`});
            }
        }
        const swaps = Math.max(1, Math.floor(size / 5));
        for (let k = 0; k < swaps; k++) {
            const i = Math.floor(Math.random() * size);
            const j = Math.floor(Math.random() * size);
            if (i !== j) [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }));
    
    genReversedBtn.addEventListener('click', () => generateAndDisplayArray((size, isChar) => {
        let arr = [];
        const startChar = 'A'.charCodeAt(0);
        for (let i = 0; i < size; i++) {
            if (isChar) {
                const char = String.fromCharCode(startChar + (size - 1 - i));
                arr.push({ value: char, displayValue: char, id: `gchar-${i}`});
            } else {
                arr.push({ value: size - i, displayValue: String(size-i), id: `gnum-${i}`});
            }
        }
        return arr;
    }));

    genFewUniqueBtn.addEventListener('click', () => generateAndDisplayArray((size, isChar) => {
        const arr = [];
        const numUnique = Math.max(2, Math.floor(size / 3));
        const uniqueVals = [];
        const startChar = 'A'.charCodeAt(0);

        for (let i = 0; i < numUnique; i++) {
            if (isChar) uniqueVals.push(String.fromCharCode(startChar + i));
            else uniqueVals.push(Math.floor(Math.random()*50) + 1);
        }
        for (let i = 0; i < size; i++) {
            const randomUniqueVal = uniqueVals[Math.floor(Math.random() * numUnique)];
            if (isChar) {
                 arr.push({ value: randomUniqueVal.toUpperCase(), displayValue: randomUniqueVal, id: `gchar-${i}`});
            } else {
                 arr.push({ value: randomUniqueVal, displayValue: String(randomUniqueVal), id: `gnum-${i}`});
            }
        }
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }));


    // Info Panel Toggle & Tabs
    toggleInfoPanelBtn.addEventListener('click', () => {
        const isHidden = infoCodePanel.classList.contains('hidden');
        const icon = infoPanelIcon; 
        if (isHidden) {
            infoCodePanel.classList.remove('hidden');
             requestAnimationFrame(() => {
                 infoCodePanel.style.maxHeight = infoCodePanel.scrollHeight + "px"; 
            });
            icon.style.transform = 'rotate(180deg)';
        } else {
            infoCodePanel.style.maxHeight = "0px";
            icon.style.transform = 'rotate(0deg)';
            infoCodePanel.addEventListener('transitionend', () => {
                 if (infoCodePanel.style.maxHeight === "0px") {
                    infoCodePanel.classList.add('hidden');
                 }
            }, { once: true }); 
        }
    });

    infoCodeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            infoCodeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabType = tab.dataset.tab;
            if (tabType === 'learn') {
                learnContent.classList.remove('hidden');
                codeContent.classList.add('hidden');
            } else {
                learnContent.classList.add('hidden');
                codeContent.classList.remove('hidden');
            }
            if (!infoCodePanel.classList.contains('hidden')) {
                 requestAnimationFrame(() => {
                     infoCodePanel.style.maxHeight = infoCodePanel.scrollHeight + "px";
                 });
            }
        });
    });
    
    algorithmSelect.addEventListener('change', (e) => {
        updateAlgorithmInfoPanel(e.target.value);
        if (!infoCodePanel.classList.contains('hidden')) {
             requestAnimationFrame(() => {
                 infoCodePanel.style.maxHeight = infoCodePanel.scrollHeight + "px";
             });
        }
    });


    // ====================================================================================
    // SECTION: Initialization & Event Listeners
    // ====================================================================================
    speedControl.addEventListener('input', (e) => {
        animationSpeed = parseInt(e.target.value);
        speedValueDisplay.textContent = animationSpeed;
    });
    
    visualizeBtn.addEventListener('click', runVisualization);
    resetBtn.addEventListener('click', handleReset);
    pauseResumeBtn.addEventListener('click', handlePauseResume);
    nextStepBtn.addEventListener('click', handleNextStep);
    
    function initializeVisualizer() {
        updateKidFriendlyExplanation("Hi there, future sorting master! 👋<br>Type some numbers (like 5,2,8) or letters (A,G,B) in the box, pick a sorting adventure, or use the 'Generate Array' buttons, and click 'Go!' to see how it works!");
        resetBtn.disabled = true; 
        pauseResumeBtn.disabled = true;
        nextStepBtn.disabled = true;
        speedValueDisplay.textContent = speedControl.value;
        arraySizeInput.max = MAX_ARRAY_SIZE; 
        arraySizeInput.min = 5; 

        arrayInput.value = "S,O,R,T,M,E"; 
        if (arrayInput.value.match(/[a-zA-Z]/)) {
            document.querySelector('input[name="dataType"][value="characters"]').checked = true;
        }
        const parsedInitialArray = parseInput(arrayInput.value, getDataType());

        if (parsedInitialArray.length > 0) {
            initialArrayState = JSON.parse(JSON.stringify(parsedInitialArray));
            currentArrayVisual = JSON.parse(JSON.stringify(parsedInitialArray));
            renderArray(currentArrayVisual, {}, getDataType() === 'characters');
            updateKidFriendlyExplanation("I've put in some example items for you! Click 'Go!' or change them up!");
        }
        updateAlgorithmInfoPanel(algorithmSelect.value); 
        updateProgressBarAndSteps(0,0); 
    }

    document.addEventListener('DOMContentLoaded', initializeVisualizer);