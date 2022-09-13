import * as d3 from 'd3';
import { color } from './colorManager';

const RADIUS = 320;
const WIDTH = RADIUS * 2;

export const renderSS = (svg, hierarchicalData) => {
    // Define root node of hierarchy data
    const hierarchy = d3.hierarchy(hierarchicalData).sum(d => d.value).sort((a, b) => b.value - a.value);
    const root = d3.partition().size([2 * Math.PI, RADIUS * RADIUS])(hierarchy);
    console.log('[SequenceSunburst] rootPartition', root);

    // Setup canvas
    const store = svg.node();
    store.value = { sequence: [], percentage: 0.0 };
    svg.attr('viewBox', `${-RADIUS} ${-RADIUS} ${WIDTH} ${WIDTH}`).style('max-width', `${WIDTH}px`).style('font', '12px sans-serif');

    // Prepare center label <text><tspan></tspan><tspan></tspan></text>
    const label = svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#888')
                    .style('visibility', 'hidden');
    label.append('tspan')
            .attr('class', 'percentage')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '-0.1em')
            .attr('font-size', '3em')
            .text('');
    label.append('tspan')
            .attr('class', 'equipment')
            .attr('x', 0)
            .attr('y', 0)
            .attr('dy', '2em')
            .text('');

    // Draw arc icicle
    const arc = d3.arc()
                .startAngle(d => d.x0)
                .endAngle(d => d.x1)
                .padAngle(2 / RADIUS)
                .padRadius(RADIUS)
                .innerRadius(d => Math.sqrt(d.y0))
                .outerRadius(d => Math.sqrt(d.y1) - 1);
    const path = svg.append('g')
                    .selectAll('path')
                    .data(root.descendants().filter((d) => d.depth > 0))
                    .join('path')
                    .attr('fill', d => color(d.data.name))
                    .attr('d', arc);

    // Draw another arc layer for hover event
    svg.append('g').attr('fill', 'none').attr('pointer-events', 'all')
        .selectAll('path')
        .data(root.descendants().filter((d) => d.depth > 0))
        .join('path')
        .attr('d', arc)
        .on('mouseenter', (event, d) => {
            // Highlight path
            const sequence = d.ancestors().reverse().slice(1); // Get the ancestors of the current segment (minus the root)
            path.attr('fill-opacity', node => sequence.indexOf(node) >= 0 ? 1.0 : 0.3); 
            
            // Update center text
            const percentage = ((100 * d.value) / root.value).toPrecision(3);
            label.style('visibility', null);
            label.select('.percentage').text(`${percentage}%`);
            label.select('.equipment').text(d.data.name);

            // Update the value to the store for breadcrumb view
            store.value = { sequence, percentage };
            //element.dispatchEvent(new CustomEvent('input')); todo-moch
        })
        .on('mouseleave', () => {
            path.attr('fill-opacity', 1);
            label.style('visibility', 'hidden');
            
            // Update the value to the store for breadcrumb view
            store.value = { sequence: [], percentage: 0.0 };
            //element.dispatchEvent(new CustomEvent('input')); todo-moch
        });
};


// 3. draw breadcrumb
