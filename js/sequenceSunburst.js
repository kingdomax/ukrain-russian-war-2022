import * as d3 from 'd3';
import { colorScale } from './colorManager';

const RADIUS = 320;
const WIDTH = RADIUS * 2;
const BC_HEIGHT = 30;
const BC_WIDTH = BC_HEIGHT * 4;
const FONT = '10px sans-serif';
const FONT_COLOR = '#888';

export const renderSunburstChart = (svgBreadcrumb, svgSunburst, hierarchicalData) => {
    console.log('buildHierarchicalData', hierarchicalData);
    
    // Prepare root node of hierarchy data
    const hierarchy = d3.hierarchy(hierarchicalData).sum(d => d.value).sort((a, b) => b.value - a.value);
    const root = d3.partition().size([2 * Math.PI, RADIUS * RADIUS])(hierarchy);
    console.log('[SequenceSunburst] rootPartition', root);

    // Setup canvas
    svgBreadcrumb.attr('viewBox', `0 0 ${BC_WIDTH * 5} ${BC_HEIGHT}`).attr('style', `font:${FONT}; margin-bottom:20px;`);
    svgSunburst.attr('viewBox', `${-RADIUS} ${-RADIUS} ${WIDTH} ${WIDTH}`).attr('style', `font:${FONT}; max-width:${WIDTH}px;`);

    // Draw center label <text><tspan></tspan><tspan></tspan></text>
    const label = svgSunburst.append('text')
                    .attr('fill', FONT_COLOR)
                    .attr('text-anchor', 'middle')
                    .style('visibility', 'hidden');
    label.append('tspan')
            .attr('class', 'percentage')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '-0.1em')
            .attr('font-size', '4em')
            .attr('font-weight', 'bold')
            .text('');
    label.append('tspan')
            .attr('class', 'equipment')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '2em')
            .attr('font-size', '1.5em')
            .attr('font-weight', 'bold')
            .text('');

    // Draw arc icicle
    const arcIcicle = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(2 / RADIUS)
                .padRadius(RADIUS)
                .innerRadius(d => Math.sqrt(d.y0))
                .outerRadius(d => Math.sqrt(d.y1) - 1);
    const path = svgSunburst.append('g')
                    .selectAll('path')
                    .data(root.descendants().filter((d) => d.depth > 0))
                    .join('path')
                    .attr('fill', d => colorScale(d.data.name))
                    .attr('d', arcIcicle);

    // Draw another arc layer for hover event
    svgSunburst.append('g').attr('fill', 'none').attr('pointer-events', 'all')
        .selectAll('path')
        .data(root.descendants().filter((d) => d.depth > 0))
        .join('path')
        .attr('d', arcIcicle)
        .on('mouseenter', (event, d) => {
            // Highlight path
            const sequence = d.ancestors().reverse().slice(1); // Get the ancestors of the current segment (minus the root)
            path.attr('fill-opacity', node => sequence.indexOf(node) >= 0 ? 1.0 : 0.2); 
            
            // Update center text
            const percentage = ((100 * d.value) / root.value).toPrecision(3);
            label.style('visibility', null);
            label.select('.percentage').text(`${percentage}%`);
            label.select('.equipment').text(d.data.name);

            // Update breadcrumb
            reRenderBreadcrumb(svgBreadcrumb, sequence, percentage);
        })
        .on('mouseleave', () => {
            // Default state
            path.attr('fill-opacity', 1);
            label.style('visibility', 'hidden');
            reRenderBreadcrumb(svgBreadcrumb, [], 0);
        });
};

const reRenderBreadcrumb = (svgBreadcrumb, sequence, percentage) => {
    const g = svgBreadcrumb.selectAll('g')
                            .data(sequence)
                            .join('g')
                            .attr('transform', (d, i) => `translate(${i * BC_WIDTH}, 0)`);
    g.append('polygon')
        .attr('stroke', 'white')
        .attr('fill', d => colorScale(d.data.name))
        .attr('points', (data, index) => {
            const points = [];
            
            points.push('0,0');
            points.push(`${BC_WIDTH},0`);
            points.push(`${BC_WIDTH + 10},${BC_HEIGHT / 2}`);
            points.push(`${BC_WIDTH},${BC_HEIGHT}`);
            points.push(`0,${BC_HEIGHT}`);
            if (index > 0) { points.push(`${10},${BC_HEIGHT / 2}`); } // Leftmost breadcrumb; don't include 6th vertex.
        
            return points.join(' ');
        });
    g.append('text')
        .attr('x', (BC_WIDTH + 10) / 2)
        .attr('y', 15)
        .attr('dy', '0.35em')
        .attr('fill', 'white')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(d => d.data.name.length > 17 ? `${d.data.name.slice(0,16)}...` : d.data.name);

    if (percentage > 0) {
        svgBreadcrumb.append('text')
                    .text(`${percentage}%`)
                    .attr('x', (sequence.length + 0.3) * BC_WIDTH)
                    .attr('y', BC_HEIGHT / 2)
                    .attr('dy', '0.35em')
                    .attr('fill', FONT_COLOR)
                    .attr('font-weight', 'bold')
                    .attr('text-anchor', 'middle');
    } else {
        svgBreadcrumb.select('text').remove();
    }
};
