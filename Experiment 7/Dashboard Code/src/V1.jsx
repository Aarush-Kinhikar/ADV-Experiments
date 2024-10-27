// V1.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const V1 = ({ financialData }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!financialData.length) return;

        // Clear the SVG canvas for a fresh render
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions with extra padding
        const width = 420;
        const height = 280;
        const margin = { top: 10, right: 0, bottom: 65, left: 50 };

        // Process data: Aggregate units sold by segment
        const data = d3.rollups(
            financialData,
            (v) => d3.sum(v, (d) => +d["Units Sold"]),
            (d) => d.Segment
        ).map(([segment, unitsSold]) => ({ segment, unitsSold }));

        // Set up scales
        const xScale = d3
            .scaleBand()
            .domain(data.map((d) => d.segment))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.unitsSold)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define a custom color scale for a variety of colors
        const colorScale = d3.scaleOrdinal()
            .domain(data.map((d) => d.segment))
            .range(d3.schemeSet3);

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Draw bars
        svg
            .selectAll('.bar')
            .data(data)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', (d) => xScale(d.segment))
            .attr('y', (d) => yScale(d.unitsSold))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => height - margin.bottom - yScale(d.unitsSold))
            .attr('fill', (d) => colorScale(d.segment));

        // Add X-axis
        svg
            .append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-30)')
            .style('text-anchor', 'end');

        // Add Y-axis
        svg
            .append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll('text')
            .style('text-anchor', 'end');

    }, [financialData]);

    return (
        <div>
            {/* <h2>Units Sold by Segment</h2> */}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default V1;