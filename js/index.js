import * as d3 from 'd3';
import { buildHierarchicalData } from './dataProcessor';
import { renderSS } from './sequenceSunburst';

const [russianData, ukrainianData] = await Promise.all([d3.csv('../data/losses_russia.csv'), d3.csv('../data/losses_ukraine.csv')]);


// Render sequence sunburst chart
const hierarchicalData = buildHierarchicalData(russianData, ukrainianData);
console.log('[SequenceSunburst] hierarchicalData', hierarchicalData);
renderSS(d3.select('svg#sunburst'), hierarchicalData);