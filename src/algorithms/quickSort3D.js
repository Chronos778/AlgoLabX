
// QuickSort 3D Step Generator
// Optimized for high-quality fractional/floating animations

export function generateQuickSort3DSteps(initialArray) {
    const steps = [];
    const n = initialArray.length;

    // Create unique IDs for each element to track them in 3D space
    let elementIdCounter = 0;
    const indexedArray = initialArray.map(val => ({
        value: val,
        id: `el-3d-${elementIdCounter++}`,
        originalIndex: elementIdCounter - 1
    }));

    const array = [...indexedArray];
    const sortedIndices = new Set();

    function createSnapshot(description, metadata = {}) {
        return {
            array: array.map(item => ({ ...item })), // Deep copy to preserve state
            description,
            pivotIndex: metadata.pivotIndex ?? -1,
            activeIndices: metadata.activeIndices ?? [],
            comparingIndices: metadata.comparingIndices ?? [],
            swappingIndices: metadata.swappingIndices ?? [],
            range: metadata.range ?? [0, n - 1],
            phase: metadata.phase ?? 'sorting',
            sortedIndices: Array.from(sortedIndices),
            // Grouping metadata for 3D layout
            branchId: metadata.branchId ?? 'root',
            level: metadata.level ?? 0,
            partitionInfo: metadata.partitionInfo ?? null // { pivotId, leftIds, rightIds }
        };
    }

    function* quickSort(low, high, level = 0, branchId = 'root') {
        if (low <= high) {
            // Initial state for this recursive call
            yield createSnapshot(`Focusing on subarray [${low}...${high}]`, {
                range: [low, high],
                level,
                branchId,
                phase: 'start-partition'
            });

            const pivotIndex = yield* partition(low, high, level, branchId);
            sortedIndices.add(pivotIndex);

            yield createSnapshot(`Pivot ${array[pivotIndex].value} is now in its final position`, {
                pivotIndex,
                range: [low, high],
                level,
                branchId,
                phase: 'completed'
            });

            yield* quickSort(low, pivotIndex - 1, level + 1, `${branchId}-L`);
            yield* quickSort(pivotIndex + 1, high, level + 1, `${branchId}-R`);
        }
    }

    function* partition(low, high, level, branchId) {
        const pivot = array[high];
        const pivotValue = pivot.value;
        const pivotId = pivot.id;

        yield createSnapshot(`Picking pivot: ${pivotValue}`, {
            pivotIndex: high,
            range: [low, high],
            level,
            branchId,
            phase: 'choosing-pivot'
        });

        let i = low - 1;
        for (let j = low; j < high; j++) {
            yield createSnapshot(`Comparing ${array[j].value} with pivot ${pivotValue}`, {
                pivotIndex: high,
                comparingIndices: [j, high],
                range: [low, high],
                level,
                branchId,
                phase: 'partitioning'
            });

            if (array[j].value <= pivotValue) {
                i++;
                if (i !== j) {
                    [array[i], array[j]] = [array[j], array[i]];
                    yield createSnapshot(`Swapping ${array[i].value} and ${array[j].value}`, {
                        pivotIndex: high,
                        swappingIndices: [i, j],
                        range: [low, high],
                        level,
                        branchId,
                        phase: 'swapping'
                    });
                }
            }
        }

        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        const finalPivotIndex = i + 1;

        // "Splitting" snapshot: identify which IDs go where
        const leftIds = array.slice(low, finalPivotIndex).map(el => el.id);
        const rightIds = array.slice(finalPivotIndex + 1, high + 1).map(el => el.id);

        yield createSnapshot(`Partition complete around pivot ${pivotValue}`, {
            pivotIndex: finalPivotIndex,
            swappingIndices: [finalPivotIndex, high],
            range: [low, high],
            level,
            branchId,
            phase: 'split',
            partitionInfo: {
                pivotId,
                leftIds,
                rightIds
            }
        });

        return finalPivotIndex;
    }

    // Initial state
    steps.push(createSnapshot("Ready to sort...", { phase: 'initial' }));

    const generator = quickSort(0, n - 1);
    let step = generator.next();
    while (!step.done) {
        steps.push(step.value);
        step = generator.next();
    }

    // Final state
    steps.push(createSnapshot("QuickSort completed!", { phase: 'done' }));

    return steps;
}

export function getQuickSort3DSteps(arr) {
    return generateQuickSort3DSteps(arr);
}
