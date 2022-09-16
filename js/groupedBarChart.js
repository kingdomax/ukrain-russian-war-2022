import * as d3 from 'd3';
import { colorScale } from './colorManager';

const WIDTH = 1152;
const HEIGHT = 500;
const MARGIN = { top: 30, right: 0, bottom: 30, left: 40 };

export const renderBarChart = (svgBarchart, svgSelectBox, data) => {
    console.log('buildAccumulatedList', data);

    // Setup canvas
    svgBarchart.attr('viewBox', [0, 0, WIDTH, HEIGHT])
                .attr('width', WIDTH)
                .attr('height', HEIGHT)
                .attr('style', `max-width: 100%; height: auto; height: intrinsic;`);

    // Initial render
    reRender(svgBarchart, data.filter(d => d.category == 'Ground Equipments'));

    // Select box event
    svgSelectBox.on('change', (event) => {
        reRender(svgBarchart, data.filter(d => d.category == event.target.value));
    });
};

const reRender = (svgBarchart, data) => {
    // Prepare data
    const X = data.map(d => d.name);  // equipments
    const Y = data.map(d => d.value); // equipmentCount
    const Z = data.map(d => d.country); // country
    const xDomain = [...new Set(data.map(d => d.name))]; // ['Armoured Fighting Vehicles', 'Armoured Personnel Carriers', 'Infantry Fighting Vehicles', 'Infantry Mobility Vehicles', 'Tanks', 'Trucks, Vehicles and Jeeps']
    const yDomain = [0, d3.max(Y)];
    const zDomain = ['Ukraine', 'Russia'];
    const targetIndex = d3.range(X.length).filter(i => xDomain.includes(X[i])); // Omit index not present in xDomain

    // Prepare scales
    const xScale = d3.scaleBand(xDomain, [MARGIN.left, WIDTH - MARGIN.right]).paddingInner(0.1); // amount of x-range to reserve to separate groups
    const xzScale = d3.scaleBand(zDomain, [0, xScale.bandwidth()]); // amount of x-range to reserve to separate bars
    const yScale = d3.scaleLinear(yDomain, [HEIGHT - MARGIN.bottom, MARGIN.top]);
    const zScale = colorScale;

    // Make sure there are no previous elemment in svg
    svgBarchart.selectAll('*').remove();

    // Draw X axis
    svgBarchart.append('g')
                .attr('font-weight', 'bold')
                .attr('transform', `translate(0,${HEIGHT - MARGIN.bottom})`)
                .call(d3.axisBottom(xScale).tickSizeOuter(0))
                .call(g => g.selectAll('.tick text').text(t => t.length > 20 ? `${t.slice(0,19)}...` : t));
    
    // Draw Y axis
    svgBarchart.append('g') 
                .attr('font-weight', 'bold')
                .attr('transform', `translate(${MARGIN.left},0)`)
                .call(d3.axisLeft(yScale).ticks(HEIGHT / 60))
                .call(g => g.selectAll('.tick line')
                            .clone() // add another tick line accross x axis
                            .attr('x2', WIDTH - MARGIN.left - MARGIN.right) 
                            .attr('stroke-opacity', 0.1))
                .call(g => g.append('text') // append lable on top of y axis
                            .attr('x', -MARGIN.left)
                            .attr('y', 10)
                            .attr('fill', 'currentColor')
                            .attr('text-anchor', 'start')
                            .text('↑ Equipment Losses'));

    // Draw bar + hovering text
    svgBarchart.append('g')
                .selectAll('rect')
                .data(targetIndex)
                .join('rect')
                .attr('x', i => xScale(X[i]) + xzScale(Z[i]))
                .attr('y', i => yScale(Y[i]))
                .attr('width', xzScale.bandwidth())
                .attr('height', i => yScale(0) - yScale(Y[i]))
                .attr('fill', i => zScale(Z[i]))
                .append('title')
                .text(i => `${X[i]}\n${Z[i]}\n${Y[i]}`);
};
