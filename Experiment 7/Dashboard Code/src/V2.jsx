// V2.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const V2 = ({ financialData }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!financialData.length) return;

        // Clear the SVG canvas for a fresh render
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions with extra padding
        const width = 420;
        const height = 305;
        const margin = { top: 10, right: 0, bottom: 90, left: 45 };

        // Process data: Aggregate units sold by product
        const data = d3.rollups(
            financialData,
            (v) => d3.sum(v, (d) => +d["Units Sold"]),
            (d) => d.Product
        ).map(([product, unitsSold]) => ({
            product,
            unitsSold
        }));

        // Get the list of products
        const allProducts = data.map(d => d.product);

        // Set up scales
        const xScale = d3.scaleBand()
            .domain(allProducts)
            .range([margin.left, width - margin.right])
            .padding(0.1); // Space between bars

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.unitsSold)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define a color scale for each product
        const colorScale = d3.scaleOrdinal()
            .domain(allProducts)
            .range(d3.schemeSet2);

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Draw bars for each product
        svg.selectAll(".bar")
            .data(data)
            .join("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.product))
            .attr("y", d => yScale(d.unitsSold))
            .attr("width", xScale.bandwidth())
            .attr("height", d => height - margin.bottom - yScale(d.unitsSold))
            .attr("fill", d => colorScale(d.product));

        // Add X-axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("x", 20)
            // .attr("transform", "rotate(-45)")
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
            .data(allProducts)
            .join("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${width - margin.right - 80},${margin.top + i * 20})`);

        legend
            .append("rect")
            .attr("x", 0)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", colorScale);

        legend
            .append("text")
            .attr("x", 8)
            .attr("y", 8)
            .attr("dy", "0")
            .attr("dx", "0.2em")
            .text(d => d);
    }, [financialData]);

    return (
        <div>
            {/* <h2>Units Sold by Product</h2> */}
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default V2;
