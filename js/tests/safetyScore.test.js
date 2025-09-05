/**
 * Safety Score Calculator Tests
 * Example test file demonstrating how to test the modules
 */

// Mock test framework (in a real project, you'd use Jest, Mocha, etc.)
class TestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    run() {
        console.log('Running Safety Score Tests...\n');
        
        this.tests.forEach(({ name, fn }) => {
            try {
                fn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        });

        console.log(`\nResults: ${this.passed} passed, ${this.failed} failed`);
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}. Expected: ${expected}, Got: ${actual}`);
        }
    }

    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(`${message}. Expected true, got false`);
        }
    }
}

// Create test framework instance
const test = new TestFramework();

// Test Safety Score Calculator
test.test('Safety Score - Perfect Hot Food', () => {
    const calculator = new SafetyScoreCalculator();
    const foodItem = {
        type: 'hot',
        temperature: 150,
        preparationTime: 1
    };
    
    const score = calculator.calculateSafetyScore(foodItem);
    test.assertEqual(score.letterGrade, 'A', 'Perfect hot food should get A grade');
    test.assertTrue(score.score > 90, 'Perfect hot food should have high score');
});

test.test('Safety Score - Expired Cold Food', () => {
    const calculator = new SafetyScoreCalculator();
    const foodItem = {
        type: 'cold',
        temperature: 35,
        preparationTime: 6 // Beyond 4-hour limit
    };
    
    const score = calculator.calculateSafetyScore(foodItem);
    test.assertEqual(score.letterGrade, 'F', 'Expired cold food should get F grade');
    test.assertTrue(score.score < 60, 'Expired cold food should have low score');
});

test.test('Safety Score - Temperature Too Low', () => {
    const calculator = new SafetyScoreCalculator();
    const foodItem = {
        type: 'hot',
        temperature: 100, // Too cold for hot food
        preparationTime: 1
    };
    
    const score = calculator.calculateSafetyScore(foodItem);
    test.assertTrue(score.score < 80, 'Food too cold should have reduced score');
});

test.test('Safety Score - Good Handling Compliance', () => {
    const calculator = new SafetyScoreCalculator();
    const foodItem = {
        type: 'hot',
        temperature: 150,
        preparationTime: 1
    };
    
    const handling = {
        staffTrained: true,
        protocolsFollowed: true,
        glovesUsed: true,
        cleanSurfaces: true
    };
    
    const score = calculator.calculateSafetyScore(foodItem, handling);
    test.assertTrue(score.score > 90, 'Good handling should improve score');
});

test.test('Safety Score - Poor Storage Conditions', () => {
    const calculator = new SafetyScoreCalculator();
    const foodItem = {
        type: 'cold',
        temperature: 38,
        preparationTime: 1
    };
    
    const storage = {
        humidity: 80, // Too high
        contaminationRisk: 'high',
        properContainers: false,
        cleanEnvironment: false
    };
    
    const score = calculator.calculateSafetyScore(foodItem, {}, storage);
    test.assertTrue(score.score < 80, 'Poor storage should reduce score');
});

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    test.run();
} else {
    // Browser environment - add to window for manual testing
    window.runSafetyScoreTests = () => test.run();
}
