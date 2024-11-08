// V6.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function V6({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        // Set dimensions and margins for the plot
        const width = 800;
        const height = 500;
        const margin = { top: 20, right: 30, bottom: 50, left: 50 };

        // Create the SVG element
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Set the scales
        const xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Total_Land_Area_2020)])
            .range([0, width - margin.left - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Forest_Area_2020)])
            .range([height - margin.top - margin.bottom, 0]);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', width - margin.right)
            .attr('y', -10)
            .attr('fill', 'black')
            .style('text-anchor', 'end')
            .text('Total Land Area 2020');

        svg.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('x', -10)
            .attr('y', 15)
            .attr('fill', 'black')
            .style('text-anchor', 'end')
            .text('Forest Area 2020');

        // Add points
        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.Total_Land_Area_2020))
            .attr('cy', d => yScale(d.Forest_Area_2020))
            .attr('r', 3)
            .style('fill', 'teal');
    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default V6;
