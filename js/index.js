import * as d3 from 'd3';
import { buildHierarchicalData, buildAccumulatedList } from './dataProcessor';
import { renderSunburstChart } from './sequenceSunburst';
import { renderBarChart } from './groupedBarChart';

const [russianData, ukrainianData] = await Promise.all([d3.csv('../data/losses_russia.csv'), d3.csv('../data/losses_ukraine.csv')]);
renderSunburstChart(
    d3.select('svg#breadcrumb'),
    d3.select('svg#sunburst'),
    buildHierarchicalData(russianData, ukrainianData),
);
renderBarChart(
    d3.select('svg#barchart'),
    d3.select('#selection'),
    buildAccumulatedList(russianData, ukrainianData),
);
