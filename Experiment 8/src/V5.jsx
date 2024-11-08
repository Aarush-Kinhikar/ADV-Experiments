// V5.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function V5({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        // Extract top 5 countries based on Total_Land_Area_2020
        const topCountries = data
            .sort((a, b) => b.Total_Land_Area_2020 - a.Total_Land_Area_2020)
            .slice(0, 5);

        // Prepare data for the heatmap
        const heatmapData = [];
        topCountries.forEach((country, i) => {
            ['Forest_Area_1990', 'Forest_Area_2000', 'Forest_Area_2010', 'Forest_Area_2015', 'Forest_Area_2020'].forEach((year, j) => {
                heatmapData.push({
                    country: country.Country_And_Area,
                    year: year.replace('Forest_Area_', ''), // e.g., "1990"
                    value: country[year]
                });
            });
        });

        // Set dimensions and margins
        const margin = { top: 40, right: 30, bottom: 40, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Select the SVG element and set up the chart dimensions
        const svg = d3.select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // X scale for years
        const xScale = d3.scaleBand()
            .domain(['1990', '2000', '2010', '2015', '2020'])
            .range([0, width])
            .padding(0.05);

        // Y scale for countries
        const yScale = d3.scaleBand()
            .domain(topCountries.map(d => d.Country_And_Area))
            .range([0, height])
            .padding(0.05);

        // Color scale for forest area values
        const maxValue = d3.max(heatmapData, d => d.value);
        const colorScale = d3.scaleSequential(d3.interpolateGreens)
            .domain([0, maxValue]);

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .selectAll('text')
            .style('text-anchor', 'middle');

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale).tickSize(0));

        // Draw heatmap cells
        svg.selectAll()
            .data(heatmapData)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.year))
            .attr('y', d => yScale(d.country))
            .attr('width', xScale.bandwidth())
            .attr('height', yScale.bandwidth())
            .style('fill', d => colorScale(d.value))
            .style('stroke', 'white');

        // Add a color legend (optional)
        const legendWidth = 200;
        const legendHeight = 10;

        svg.append('g')
            .attr('class', 'legendLinear')
            .attr('transform', `translate(0, ${height + margin.bottom - 10})`);

        const legendScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([0, legendWidth]);

        const legendAxis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickSize(-legendHeight);

        svg.append('defs')
            .append('linearGradient')
            .attr('id', 'legendGradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%')
            .selectAll('stop')
            .data([
                { offset: '0%', color: colorScale(0) },
                { offset: '100%', color: colorScale(maxValue) }
            ])
            .enter()
            .append('stop')
            .attr('offset', d => d.offset)
            .attr('stop-color', d => d.color);

        svg.append('rect')
            .attr('x', 0)
            .attr('y', height + margin.bottom - legendHeight - 10)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', 'url(#legendGradient)');

        svg.append('g')
            .attr('transform', `translate(0, ${height + margin.bottom - 10})`)
            .call(legendAxis);

    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default V5;
