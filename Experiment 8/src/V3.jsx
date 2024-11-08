// V3.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function V3({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        // Calculate total forest area for each year
        const totalForestAreas = [
            { year: '1990', total: d3.sum(data, d => d.Forest_Area_1990) },
            { year: '2000', total: d3.sum(data, d => d.Forest_Area_2000) },
            { year: '2010', total: d3.sum(data, d => d.Forest_Area_2010) },
            { year: '2015', total: d3.sum(data, d => d.Forest_Area_2015) },
            { year: '2020', total: d3.sum(data, d => d.Forest_Area_2020) },
        ];

        // Set dimensions and margins
        const width = 600;
        const height = 400;
        const margin = { top: 40, right: 20, bottom: 50, left: 70 };

        // Select the SVG element and set up chart dimensions
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set the scales
        const xScale = d3.scaleBand()
            .domain(totalForestAreas.map(d => d.year))
            .range([0, width - margin.left - margin.right])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(totalForestAreas, d => d.total)])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5));

        // Draw bars
        svg.selectAll('.bar')
            .data(totalForestAreas)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.total))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - margin.top - margin.bottom - yScale(d.total))
            .attr('fill', '#69b3a2');

        // Add labels above bars
        svg.selectAll('.label')
            .data(totalForestAreas)
            .enter()
            .append('text')
            .attr('class', 'label')
            .attr('x', d => xScale(d.year) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.total) - 5)
            .attr('text-anchor', 'middle')
            .text(d => d.total.toLocaleString());

    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default V3;
