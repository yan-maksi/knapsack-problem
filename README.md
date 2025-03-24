# Knapsack Problem Solver with Genetic Algorithm

## Overview

The Knapsack Problem Solver is an interactive web application that demonstrates solving the classic optimization problem using a Genetic Algorithm. This tool allows users to add items with specific weights and values, then uses a genetic algorithm to find the optimal combination of items that maximizes total value while staying within a given knapsack capacity.

https://github.com/user-attachments/assets/af306335-8a68-41be-a5f3-7de81a39bf6e


## Features

- **Genetic Algorithm Solver**
  * Specify knapsack maximum capacity
  * Run genetic algorithm to find optimal item combination
  * Detailed visualization of results

- **Comprehensive Visualization**
  * Candidate items canvas
  * Selected items canvas
  * Tabular representation of results

## Genetic Algorithm Details

The solver uses a custom genetic algorithm with the following key components:

- **Population Initialization**: Random binary chromosome generation
- **Fitness Evaluation**: 
  * Calculate total value of selected items
  * Penalize solutions exceeding weight capacity
- **Parent Selection**: Tournament selection method
- **Crossover**: Single-point crossover
- **Mutation**: Randomly flip genes based on mutation rate
- **Iteration**: Improve population over multiple generations

## Visualization Explained

### Candidate Canvas
- Displays all added items
- Bar length represents item value
- Color represents individual item

### Knapsack Canvas
- Shows selected items after algorithm runs
- Demonstrates how items fit within capacity
- Red line indicates maximum capacity

## Genetic Algorithm Parameters

Current default parameters:
- Population Size: 50
- Generations: 100
- Mutation Rate: 10%
- Tournament Size: 5

## Project Structure

```
knapsack-solver/
│
├── index.html         
├── knapsack-solver.js 
└── README.md         
```
