// V4.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const V4 = ({ financialData }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!financialData.length) return;

        // Clear the SVG canvas for a fresh render
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions
        const width = 500;
        const height = 272;
        const margin = { top: 0, right: 20, bottom: 20, left: 0 };

        // Create a radius for the pie chart
        const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.bottom);

        // Process data: Aggregate sales by segment
        const data = d3.rollups(
            financialData,
            (v) => d3.sum(v, (d) => +d["Sales"]), // Sum sales instead of profit
            (d) => d.Segment
        ).map(([segment, sales]) => ({ segment, sales }));

        // Calculate total sales for percentage calculation
        const totalSales = d3.sum(data, d => d.sales);

        // Set up color scale
        const colorScale = d3.scaleOrdinal(d3.schemeSet2)
            .domain(data.map(d => d.segment));

        // Create a pie chart layout
        const pie = d3.pie()
            .value(d => d.sales) // Use sales for pie chart values
            .sort(null);

        // Create an arc generator
        const arc = d3.arc()
            .innerRadius(0) // Outer radius for pie chart
            .outerRadius(radius);

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create the pie chart
        const arcs = svg
            .selectAll('.arc')
            .data(pie(data))
            .join('g')
            .attr('class', 'arc');

        // Append arcs to the pie chart
        arcs.append('path')
            .attr('d', arc)
            .attr('fill', d => colorScale(d.data.segment));

        // Create or select the legend SVG
        let legend = d3.select(svgRef.current.parentNode).select('svg.legend');
        if (legend.empty()) {
            legend = d3.select(svgRef.current.parentNode)
                .append('svg')
                .attr('class', 'legend')
                .attr('width', 200)
                .attr('height', data.length * 35)
                .style('margin-left', '-100px')
                .style('margin-right', '30px')
        } else {
            legend.selectAll('*').remove(); // Clear existing legend items
        }

        // Append legend items
        const legendItems = legend
            .selectAll('.legend-item')
            .data(data)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        // Add colored rectangles for the legend
        legendItems.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 18)
            .attr('height', 18)
            .attr('fill', d => colorScale(d.segment));

        // Add text for each legend item
        legendItems.append('text')
            .attr('x', 25)
            .attr('y', 15)
            .text(d => {
                const percentage = ((d.sales / totalSales) * 100).toFixed(1);
                return `${d.segment}: ${percentage}%`;
            });

    }, [financialData]);

    return (
        <div>
            {/* <h2>Sales by Segment</h2> */}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default V4;
