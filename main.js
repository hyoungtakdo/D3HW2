
// SVG size creation
const width = 1200;
const height = 700;
const margin = 80;

// Creating my SVG
const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Loading CSV
d3.csv("best-selling-manga.csv").then(function(data) {

    // Converting strings into numbers
    data.forEach(d => {
        d.sales = +d["Approximate sales in million(s)"];
        d.volumes = +d["No. of collected volumes"];
    });

    // filtering data for top 15 manga series
    data = data
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 15);

    // Color scale based on sales
    const colorScale = d3.scaleSequential()
        .domain([
            d3.min(data, d => d.sales),
            d3.max(data, d => d.sales)
        ])
        .interpolator(d3.interpolatePlasma);

    // Scale for positioning
    const xScale = d3.scaleBand()
        .domain(data.map(d => d["Manga series"]))
        .range([margin, width - margin])
        .padding(0.4);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.sales)])
        .range([height - margin, margin]);

    // Title
    svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", 40)
        .text("Best-Selling Manga Series");

    // Y Axis
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(${margin},0)`)
        .call(yAxis);

    // Y Axis Label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 25)
        .text("Approximate Sales (Millions)");

    // X Labels
    svg.selectAll(".xLabel")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "xLabel")
        .attr("x", d => xScale(d["Manga series"]) + 15)
        .attr("y", height - 30)
        .attr("transform", d => {
            const x = xScale(d["Manga series"]) + 15;
            const y = height - 30;
            return `rotate(-45, ${x}, ${y})`;
        })
        .text(d => d["Manga series"]);

    // Create custom SVG path "book" shapes
    svg.selectAll(".book")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "book")
        .attr("transform", d => {
            const x = xScale(d["Manga series"]);
            const y = yScale(d.sales);
            return `translate(${x}, ${y})`;
        })

        // Custom book shape
        .attr("d", d => {

            // Height based on manga sales
            const h = height - margin - yScale(d.sales);

            // Width of book
            const w = 30;

            return `
                M0 0
                L${w} 0
                L${w} ${h}
                Q${w/2} ${h-10} 0 ${h}
                Z
            `;
        })

        .attr("fill", d => colorScale(d.sales))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add sales labels
    svg.selectAll(".salesLabel")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "salesLabel")
        .attr("x", d => xScale(d["Manga series"]) + 15)
        .attr("y", d => yScale(d.sales) - 10)
        .text(d => d.sales + "M");
});