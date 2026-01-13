import React from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import ArrayBlockVisualizer from './ArrayBlockVisualizer';
import SearchVisualizer from './SearchVisualizer';
import GraphVisualizer from './GraphVisualizer';
import DPVisualizer from './DPVisualizer';
import GanttChartVisualizer from './GanttChartVisualizer';
import ChartsVisualizer from './ChartsVisualizer';
import MergeTree from './MergeTree';

const SmartVisualizer = ({
  algorithmType,
  stepData,
  comparisonData = null,
  algorithmNames = [],
  ...props
}) => {
  // Determine which visualizer to use based on algorithm type
  const getVisualizer = () => {
    switch (algorithmType) {
      case 'sorting':
        if (stepData?.rootId) {
          return <MergeTree currentStep={stepData} />;
        }

        // Use Block Visualizer for simple sorts or if sorted data is present
        // This implicitly enables it for Bubble, Selection, Insertion if we pass sortedIndices
        // We can also force it if we know the algorithm name, but SmartVisualizer currently only gets type.
        // However, checking for 'sorted' prop in stepData is a good heuristic, or we can just default to it 
        // if we want to replace the bar chart permanently for these.
        // The prompt asked to "update in learn and compare", implying a pervasive change.
        // Let's rely on the presence of specific props or just use it as the default for arrays 
        // if it looks like a comparison sort step context.

        // For now, let's use ArrayBlockVisualizer if 'sorted' property exists in stepData 
        // (which we will add to the algorithms) OR if it's explicitly one of the target algos.
        // Since we don't have algo name here easily without props drilling or deduction, 
        // let's rely on the new data shape we are about to create.

        if (props.useBlockVisualizer || stepData?.sorted || (stepData?.description && (stepData.description.includes('Bubble') || stepData.description.includes('Selection') || stepData.description.includes('Insertion')))) {
          return (
            <ArrayBlockVisualizer
              array={props.array || []}
              activeIndices={props.activeIndices || []}
              swappedIndices={props.swappedIndices || []}
              sortedIndices={stepData?.sorted || []}
              specialIndices={{
                min: stepData?.minIdx,
                key: stepData?.keyIdx,
                check: stepData?.checkIdx
              }}
            />
          );
        }

        return (
          <ArrayVisualizer
            array={props.array || []}
            activeIndices={props.activeIndices || []}
            swappedIndices={props.swappedIndices || []}
            maxValue={props.maxValue || 100}
            barWidth={props.barWidth || 40}
            barGap={props.barGap || 4}
          />
        );

      case 'searching':
        return (
          <SearchVisualizer
            array={stepData?.array || []}
            activeIndices={stepData?.active || []}
            pointerIndex={stepData?.pointerIndex || -1}
            targetIndex={stepData?.targetIndex || -1}
            maxValue={props.maxValue || 100}
          />
        );

      case 'graph':
        // Add error handling for graph algorithms
        if (!stepData || !stepData.nodes || stepData.nodes.length === 0) {
          return (
            <div className="flex items-center justify-center p-8 bg-dark-900/40 rounded-xl backdrop-blur-sm border border-white/10">
              <p className="text-gray-400">No graph data available</p>
            </div>
          );
        }
        return (
          <GraphVisualizer
            nodes={stepData?.nodes || []}
            edges={stepData?.edges || []}
            visitedNodes={stepData?.visited || []}
            currentNode={stepData?.current || -1}
            activeNodes={stepData?.active || []}
            message={stepData?.message || ''}
            shortestPath={stepData?.shortestPath || []}
          />
        );

      case 'dp':
        return (
          <DPVisualizer
            dpTable={stepData?.dpTable || []}
            currentItem={stepData?.currentItem || -1}
            currentCapacity={stepData?.currentCapacity || -1}
            itemWeights={stepData?.itemWeights || []}
            itemValues={stepData?.itemValues || []}
          />
        );

      case 'os':
        return (
          <GanttChartVisualizer
            processes={stepData?.processes || []}
            timeline={stepData?.timeline || []}
            currentTime={stepData?.currentTime || -1}
            timeQuantum={stepData?.timeQuantum || 2}
          />
        );

      case 'compare':
        return (
          <ChartsVisualizer
            comparisonData={comparisonData || []}
            algorithmNames={algorithmNames || []}
            chartType={props.chartType || 'line'}
            metrics={props.metrics || ['time', 'steps', 'comparisons']}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center p-8 bg-gray-800/30 rounded-xl backdrop-blur-sm border border-gray-700/50">
            <p className="text-gray-400">Unknown algorithm type: {algorithmType}</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {getVisualizer()}
    </div>
  );
};

export default SmartVisualizer;
