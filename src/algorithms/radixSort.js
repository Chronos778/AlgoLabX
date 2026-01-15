/**
 * Radix Sort Step Generator
 * Handles multi-pass sorting by digit places (LSD approach).
 */
export function getRadixSortSteps(inputArr) {
    const arr = [...inputArr];
    const n = arr.length;
    const steps = [];

    if (n === 0) return [{ array: [], buckets: [], phase: 'initial', message: "Empty array" }];

    const max = Math.max(...arr);
    const maxDigits = Math.floor(Math.log10(max)) + 1;

    // Initial State
    steps.push({
        array: [...arr],
        buckets: Array.from({ length: 10 }, () => []),
        phase: 'initial',
        message: `Starting Radix Sort. Maximum number is ${max}, which has ${maxDigits} digits.`,
        activeElement: null,
        targetBucket: null,
        digitPlace: 1
    });

    let currentArr = [...arr];

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const digitName = exp === 1 ? "ones" : exp === 10 ? "tens" : exp === 100 ? "hundreds" : `${exp}'s`;

        let buckets = Array.from({ length: 10 }, () => []);

        // Step 1: Distribution Phase
        for (let i = 0; i < n; i++) {
            const val = currentArr[i];
            const digit = Math.floor((val / exp) % 10);

            steps.push({
                array: [...currentArr],
                buckets: buckets.map(b => [...b]),
                phase: 'distribution',
                message: `Pass: ${digitName} digit. Moving ${val} to bucket ${digit}.`,
                activeElement: i,
                targetBucket: digit,
                digitPlace: exp
            });

            buckets[digit].push(val);

            steps.push({
                array: [...currentArr],
                buckets: buckets.map(b => [...b]),
                phase: 'distribution',
                message: `${val} placed in bucket ${digit}.`,
                activeElement: i,
                targetBucket: digit,
                digitPlace: exp
            });
        }

        // Step 2: Collection Phase
        steps.push({
            array: [...currentArr],
            buckets: buckets.map(b => [...b]),
            phase: 'collecting',
            message: `Collecting elements from buckets for ${digitName} digit pass.`,
            activeElement: null,
            targetBucket: null,
            digitPlace: exp
        });

        const nextArr = [];
        let currentIndex = 0;
        const tempDisplayArr = [...currentArr];

        for (let i = 0; i < 10; i++) {
            while (buckets[i].length > 0) {
                const val = buckets[i].shift();
                nextArr.push(val);

                // For visualization: show elements filling back into the main array
                tempDisplayArr[currentIndex] = val;

                steps.push({
                    array: [...tempDisplayArr],
                    buckets: buckets.map(b => [...b]),
                    phase: 'collecting',
                    message: `Collected ${val} from bucket ${i}.`,
                    activeElement: currentIndex,
                    targetBucket: i,
                    digitPlace: exp
                });

                currentIndex++;
            }
        }

        currentArr = [...nextArr];
    }

    // Final Step
    steps.push({
        array: [...currentArr],
        buckets: Array.from({ length: 10 }, () => []),
        phase: 'done',
        message: "Radix Sort completed! Array is now sorted by all digit places.",
        activeElement: null,
        targetBucket: null,
        digitPlace: null
    });

    return steps;
}
