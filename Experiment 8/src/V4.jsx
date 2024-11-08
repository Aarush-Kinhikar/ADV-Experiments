// V4.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function V4({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        // Filter out countries with missing or zero forest area in 2020
        const filteredData = data.filter(d => d.Forest_Area_2020 > 0);

        // Calculate total forest area in 2020 to determine 1% threshold
        const totalForestArea = d3.sum(filteredData, d => d.Forest_Area_2020);
        const minForestAreaForLabel = totalForestArea * 0.01;

        // Set dimensions and margins
        const width = 500;
        const height = 500;
        const margin = 40;

        // Set the radius of the doughnut chart
        const radius = Math.min(width, height) / 2 - margin;

        // Create the SVG element
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Set color scale
        const color = d3.scaleOrdinal()
            .domain(filteredData.map(d => d.Country_And_Area))
            .range(d3.schemeCategory10);

        // Create the pie chart layout
        const pie = d3.pie()
            .value(d => d.Forest_Area_2020);

        // Define the arc generator with inner and outer radius
        const arc = d3.arc()
            .innerRadius(radius * 0.5) // Inner radius for the doughnut shape
            .outerRadius(radius);

        // Create the arcs for each slice
        svg.selectAll('path')
            .data(pie(filteredData))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data.Country_And_Area))
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .style('opacity', 0.7);

        // Add labels for each slice with forest area >= 1% of total
        svg.selectAll('text')
            .data(pie(filteredData))
            .enter()
            .append('text')
            .filter(d => d.data.Forest_Area_2020 >= minForestAreaForLabel) // Only include labels for >= 1%
            .text(d => d.data.Country_And_Area)
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .style('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', 'white');

    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default V4;
