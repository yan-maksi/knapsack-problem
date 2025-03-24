class KnapsackSolver {
    constructor(candidates, capacity, populationSize = 50, generations = 100, mutationRate = 0.1) {
        this.candidates = candidates;
        this.capacity = capacity;
        this.populationSize = populationSize;
        this.generations = generations;
        this.mutationRate = mutationRate;
    }

    initializePopulation() {
        return Array.from({ length: this.populationSize }, () => 
            Array.from({ length: this.candidates.length }, () => Math.random() < 0.5 ? 0 : 1)
        );
    }

    calculateFitness(individual) {
        let totalWeight = 0;
        let totalValue = 0;

        for (let i = 0; i < individual.length; i++) {
            if (individual[i]) {
                totalWeight += this.candidates[i].weight;
                totalValue += this.candidates[i].value;
            }
        }

        if (totalWeight > this.capacity) {
            return 0;
        }

        return totalValue;
    }

    tournamentSelection(population, fitnessScores) {
        const tournamentSize = 5;
        const selected = [];

        for (let i = 0; i < population.length; i++) {
            const tournament = Array.from({ length: tournamentSize }, () => 
                Math.floor(Math.random() * population.length)
            );

            const winner = tournament.reduce((best, current) => 
                fitnessScores[current] > fitnessScores[best] ? current : best
            );

            selected.push(population[winner]);
        }

        return selected;
    }

    crossover(parent1, parent2) {
        const crossoverPoint = Math.floor(Math.random() * parent1.length);
        const child1 = [
            ...parent1.slice(0, crossoverPoint),
            ...parent2.slice(crossoverPoint)
        ];
        const child2 = [
            ...parent2.slice(0, crossoverPoint),
            ...parent1.slice(crossoverPoint)
        ];

        return [child1, child2];
    }

    mutate(individual) {
        return individual.map(gene => 
            Math.random() < this.mutationRate ? (1 - gene) : gene
        );
    }

    solve() {
        let population = this.initializePopulation();
        
        for (let generation = 0; generation < this.generations; generation++) {
            const fitnessScores = population.map(individual => 
                this.calculateFitness(individual)
            );

            const parents = this.tournamentSelection(population, fitnessScores);
            const newPopulation = [];

            while (newPopulation.length < this.populationSize) {
                const parent1 = parents[Math.floor(Math.random() * parents.length)];
                const parent2 = parents[Math.floor(Math.random() * parents.length)];

                const [child1, child2] = this.crossover(parent1, parent2);
                newPopulation.push(this.mutate(child1), this.mutate(child2));
            }

            population = newPopulation;
        }

        const finalFitnessScores = population.map(individual => 
            this.calculateFitness(individual)
        );

        const bestSolutionIndex = finalFitnessScores.indexOf(Math.max(...finalFitnessScores));
        return population[bestSolutionIndex];
    }
}


let candidates = [];

function addCandidate() {
    const weightInput = document.getElementById('weightInput');
    const valueInput = document.getElementById('valueInput');
    const colorInput = document.getElementById('colorInput');

    const weight = parseFloat(weightInput.value);
    const value = parseFloat(valueInput.value);
    const color = colorInput.value;

    if (isNaN(weight) || isNaN(value) || weight <= 0 || value <= 0) {
        alert('Please enter valid weight and value');
        return;
    }

    const candidate = { weight, value, color };
    candidates.push(candidate);

    updateCandidatesTable();
    drawCandidatesCanvas();

    weightInput.value = '';
    valueInput.value = '';
}

function updateCandidatesTable() {
    const tableBody = document.getElementById('candidatesTableBody');
    tableBody.innerHTML = '';

    candidates.forEach((candidate, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = candidate.weight.toFixed(2);
        row.insertCell(1).textContent = candidate.value.toFixed(2);
        row.insertCell(2).textContent = (candidate.value / candidate.weight).toFixed(2);
        
        const colorCell = row.insertCell(3);
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = candidate.color;
        colorBox.style.width = '30px';
        colorBox.style.height = '20px';
        colorCell.appendChild(colorBox);

        const actionsCell = row.insertCell(4);
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            candidates.splice(index, 1);
            updateCandidatesTable();
            drawCandidatesCanvas();
        };
        actionsCell.appendChild(deleteButton);
    });
}

function drawCandidatesCanvas() {
    const canvas = document.getElementById('candidateCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxWidth = canvas.width - 20;
    const maxValue = Math.max(...candidates.map(c => c.value));
    const scaling = maxWidth / maxValue;

    candidates.forEach((candidate, index) => {
        ctx.fillStyle = candidate.color;
        const rectHeight = 30;
        const rectWidth = candidate.value * scaling;
        ctx.fillRect(10, 10 + index * 40, rectWidth, rectHeight);
        
        ctx.fillStyle = 'black';
        ctx.fillText(`${candidate.weight}kg, $${candidate.value}`, 
            rectWidth + 20, 30 + index * 40);
    });
}

function runGeneticAlgorithm() {
    const capacityInput = document.getElementById('capacityInput');
    const capacity = parseFloat(capacityInput.value);

    if (isNaN(capacity) || capacity <= 0) {
        alert('Please enter a valid knapsack capacity');
        return;
    }

    const solver = new KnapsackSolver(candidates, capacity);
    const bestSolution = solver.solve();

    const resultsTableBody = document.getElementById('resultsTableBody');
    resultsTableBody.innerHTML = '';

    let totalWeight = 0;
    let totalValue = 0;
    const selectedCandidates = bestSolution.map((selected, index) => {
        if (selected) {
            totalWeight += candidates[index].weight;
            totalValue += candidates[index].value;
            return candidates[index];
        }
    }).filter(Boolean);

    const row = resultsTableBody.insertRow();
    row.insertCell(0).textContent = totalWeight.toFixed(2);
    row.insertCell(1).textContent = totalValue.toFixed(2);

    drawKnapsackCanvas(selectedCandidates, capacity);
}

function drawKnapsackCanvas(selectedCandidates, capacity) {
    const canvas = document.getElementById('knapsackCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxWidth = canvas.width - 40;
    const currentWidth = selectedCandidates.reduce((sum, c) => sum + c.weight, 0);
    const scaling = maxWidth / capacity;

    let currentX = 20;
    selectedCandidates.forEach(candidate => {
        ctx.fillStyle = candidate.color;
        const rectWidth = candidate.weight * scaling;
        ctx.fillRect(currentX, 50, rectWidth, 50);
        
        ctx.fillStyle = 'black';
        ctx.fillText(`${candidate.weight}kg`, currentX + 5, 40);
        
        currentX += rectWidth;
    });

    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(20 + capacity * scaling, 20);
    ctx.lineTo(20 + capacity * scaling, 120);
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.fillText('Capacity', 20 + capacity * scaling + 5, 70);
}