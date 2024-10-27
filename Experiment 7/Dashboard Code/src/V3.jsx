// V2.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const V3 = ({ financialData }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!financialData.length) return;

        // Clear the SVG canvas for a fresh render
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions with extra padding
        const width = 420;
        const height = 305;
        const margin = { top: 10, right: 90, bottom: 90, left: 45 };

        // Process data: Aggregate units sold by country
        const data = d3.rollups(
            financialData,
            (v) => d3.sum(v, (d) => +d["Units Sold"]),
            (d) => d.Country
        ).map(([country, unitsSold]) => ({
            country,
            unitsSold
        }));

        // Get the list of countries
        const allCountries = data.map(d => d.country);

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(allCountries)
            .range([margin.left, width - margin.right])
            .padding(0.1); // Space between bars

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.unitsSold)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define a color scale for each country
        const colorScale = d3.scaleOrdinal()
            .domain(allCountries)
            .range(d3.schemeSet2);

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Draw bars for each country
        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.country))
            .attr("y", d => yScale(d.unitsSold))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.unitsSold))
            .attr("fill", d => colorScale(d.country));

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            // .attr("transform", "rotate(-20)")
            .style("text-anchor", "end");

        // Add Y-axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll("text")
            .style("text-anchor", "end");

        // Add legend
        const legend = svg
            .selectAll(".legend")
            .data(allCountries)
            .join("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - margin.right - 80},${margin.top + i * 20})`);

        legend
            .append("rect")
            .attr("x", 80)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", colorScale);

        legend
            .append("text")
            .attr("x", 104)
            .attr("y", 9)
            .attr("dy", "0.35em")
            .text(d => d);
    }, [financialData]);

    return (
        <div>
            {/* <h2>Units Sold by Country</h2> */}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default V3;
