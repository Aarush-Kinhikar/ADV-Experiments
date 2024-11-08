// V2.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function V2({ data }) {
    const svgRef = useRef();

    useEffect(() => {
        // Sort data by Total_Land_Area_2020 and get the top 10 countries
        const topCountries = data
            .sort((a, b) => b.Total_Land_Area_2020 - a.Total_Land_Area_2020)
            .slice(0, 10);

        // Prepare data in a stacked format
        const stackedData = topCountries.map(d => ({
            country: d.Country_And_Area,
            totalLandArea: d.Total_Land_Area_2020,
            forestArea: d.Forest_Area_2020,
            nonForestArea: d.Total_Land_Area_2020 - d.Forest_Area_2020,
        }));

        // Set dimensions and margins
        const width = 800;
        const height = 500;
        const margin = { top: 40, right: 30, bottom: 100, left: 100 };

        // Clear the SVG before drawing
        d3.select(svgRef.current).selectAll('*').remove();

        // Create SVG element
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define scales
        const xScale = d3.scaleBand()
            .domain(stackedData.map(d => d.country))
            .range([0, width - margin.left - margin.right])
            .padding(0.3);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(stackedData, d => d.totalLandArea)])
            .nice()
            .range([height - margin.top - margin.bottom, 0]);

        // Define color scale for stacked bars
        const colorScale = d3.scaleOrdinal()
            .domain(['forestArea', 'nonForestArea'])
            .range(['#4CAF50', '#A9A9A9']); // Forest: green, Non-forest: gray

        // Create groups for stacked bars
        const stackedKeys = ['forestArea', 'nonForestArea'];
        const stack = d3.stack().keys(stackedKeys);
        const series = stack(stackedData);

        // Add X axis
        svg.append('g')
            .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickSize(0))
            .selectAll("text")
            .style("text-anchor", "middle")
            .attr("transform", "rotate(-45)");

        // Add Y axis
        svg.append('g')
            .call(d3.axisLeft(yScale));

        // Draw stacked bars
        svg.selectAll('.layer')
            .data(series)
            .enter()
            .append('g')
            .attr('fill', d => colorScale(d.key))
            .selectAll('rect')
            .data(d => d)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d.data.country))
            .attr('y', d => yScale(d[1]))
            .attr('height', d => yScale(d[0]) - yScale(d[1]))
            .attr('width', xScale.bandwidth());

        // Add legend
        const legend = svg.selectAll(".legend")
            .data(stackedKeys)
            .enter()
            .append("g")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`)
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", width - margin.left - 40)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => colorScale(d));

        legend.append("text")
            .attr("x", width - margin.left - 45)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(d => d === 'forestArea' ? 'Forest Area' : 'Non-Forest Area');

    }, [data]);

    return <svg ref={svgRef}></svg>;
}

export default V2;
