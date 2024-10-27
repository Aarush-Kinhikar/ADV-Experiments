// V5.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const V5 = ({ financialData }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!financialData.length) return;

        // Clear the SVG canvas for a fresh render
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions
        const width = 550;
        const height = 272;
        const margin = { top: 0, right: 20, bottom: 40, left: 90 };

        // Process data: Aggregate units sold by month and segment
        const data = d3.rollups(
            financialData,
            (v) => d3.sum(v, (d) => +d["Units Sold"]),
            (d) => d["Month Number"],
            (d) => d["Segment"]
        ).map(([month, segments]) => {
            return segments.map(([segment, unitsSold]) => ({
                month,
                segment,
                unitsSold
            }));
        }).flat();

        // Create a color scale
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateBlues)
            .domain([0, d3.max(data, d => d.unitsSold)]); // From 0 to max units sold

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(data.map(d => `${d.month}`)) // Use Month labels
            .range([margin.left, width - margin.right])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(Array.from(new Set(data.map(d => d.segment)))) // Unique segments
            .range([height - margin.bottom, margin.top])
            .padding(0.05);

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create heatmap rectangles
        svg.selectAll('.heatmap')
            .data(data)
            .join('rect')
            .attr('class', 'heatmap')
            .attr('x', d => xScale(`${d.month}`))
            .attr('y', d => yScale(d.segment))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .attr('fill', d => colorScale(d.unitsSold));

        // Add X-axis
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Add Y-axis
        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // Add a color legend
        const legendWidth = 20;
        const legendHeight = height - margin.top - margin.bottom;

        const legendScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.unitsSold)])
            .range([legendHeight, 0]);

        const legend = svg.append('g')
            .attr('transform', `translate(${width - margin.right + 10}, ${margin.top - 15})`);

        legend.selectAll('.legend-rect')
            .data(d3.range(0, d3.max(data, d => d.unitsSold), (d3.max(data, d => d.unitsSold) / 10)))
            .join('rect')
            .attr('class', 'legend-rect')
            .attr('y', d => legendScale(d))
            .attr('width', legendWidth)
            .attr('height', legendHeight / 10)
            .attr('fill', d => colorScale(d));

        legend.append('text')
            .attr('x', legendWidth + 5)
            .attr('y', legendScale(d3.max(data, d => d.unitsSold)))
            .text(d3.max(data, d => d.unitsSold));

        legend.append('text')
            .attr('x', legendWidth + 5)
            .attr('y', legendScale(0) + 10)
            .text('0');

    }, [financialData]);

    return (
        <div>
            {/* <h2>Units Sold Heatmap by Month and Segment</h2> */}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default V5;
