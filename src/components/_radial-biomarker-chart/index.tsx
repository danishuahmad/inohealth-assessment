import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Stack } from "@mui/material";

type BiomarkerRecord = {
  client_id: string;
  date_testing: string;
  [key: string]: string | number | undefined;
};

const RadialBiomarkerChart: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const dataset: BiomarkerRecord[] = [
      {
        client_id: "d204106e",
        date_testing: "2018-04-22",
        creatine: 0.47,
        chloride: 83.64,
        fasting_glucose: 129.95,
        potassium: 8.39,
        sodium: 73.53,
        total_calcium: 9.98,
        total_protein: 12.9,
      },
      {
        client_id: "d204106e",
        date_testing: "2019-01-12",
        creatine: 0.65,
        chloride: 92.11,
        fasting_glucose: 110.12,
        potassium: 5.12,
        sodium: 80.01,
        total_calcium: 8.55,
        total_protein: 10.3,
      },
      {
        client_id: "d204106e",
        date_testing: "2020-02-22",
        creatine: 0.89,
        chloride: 85.21,
        fasting_glucose: 98.33,
        potassium: 6.01,
        sodium: 95.22,
        total_calcium: 9.45,
        total_protein: 11.1,
      },
      {
        client_id: "d204106e",
        date_testing: "2021-07-12",
        creatine: 0.55,
        chloride: 78.5,
        fasting_glucose: 120.8,
        potassium: 7.0,
        sodium: 76.4,
        total_calcium: 9.0,
        total_protein: 11.8,
      },
    ];

    const width = 650;
    const height = 650;
    const innerRadius = 90; // empty center
    const outerRadius = 260;
    const innerHolePadding = 6;
    const innerHoleFill = "#ffffff";

    const svg = d3
      .select(ref.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("font-family", "Manrope, sans-serif");

    svg.selectAll("*").remove();

    const excludeKeys = new Set([
      "client_id",
      "date_testing",
      "date_birthdate",
      "gender",
      "ethnicity",
    ]);

    const sample = dataset[0] || {};
    const numericKeys = Object.keys(sample).filter(
      (k) => !excludeKeys.has(k) && typeof sample[k] === "number"
    );

    if (numericKeys.length === 0) {
      svg.append("text").text("No numeric biomarkers found").attr("text-anchor", "middle");
      return;
    }

    const angleScale = d3
      .scaleBand<string>()
      .domain(numericKeys)
      .range([0, 2 * Math.PI])
      .padding(0.08);

    const allValues = dataset.flatMap((d) =>
      numericKeys.map((k) => (d[k] as number) ?? 0)
    );

    const maxVal = d3.max(allValues) ?? 1;
    const minVal = d3.min(allValues) ?? 0;

    const valueScale = d3
      .scaleLinear()
      .domain([minVal, maxVal])
      .range([innerRadius, outerRadius]);

    const colorScale = d3.scaleOrdinal<string>().domain(numericKeys).range(d3.schemeTableau10);

    // ---- grid rings ----
    const numRings = 4;
    const ringValues = d3.range(1, numRings + 1).map((i) => minVal + (i / numRings) * (maxVal - minVal));
    svg
      .append("g")
      .selectAll("circle")
      .data(ringValues)
      .join("circle")
      .attr("r", (d) => valueScale(d))
      .attr("fill", "none")
      .attr("stroke", "#d0d7de")
      .attr("stroke-dasharray", "3,3")
      .attr("stroke-width", 0.6);

    // ---- spokes ----
    svg
      .append("g")
      .selectAll("line")
      .data(numericKeys)
      .join("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", (d) => Math.sin(angleScale(d)!) * outerRadius)
      .attr("y2", (d) => -Math.cos(angleScale(d)!) * outerRadius)
      .attr("stroke", "#d0d7de")
      .attr("stroke-width", 0.6);

    // ---- scatter points ----
    const pointsGroup = svg.append("g").attr("class", "points-group");
    dataset.forEach((record) => {
      numericKeys.forEach((key) => {
        const baseAngle = angleScale(key)!;
        const band = angleScale.bandwidth();
        const angleJitter = (Math.random() - 0.5) * band * 0.8;
        const value = (record[key] as number) ?? minVal;
        let r = valueScale(value);
        if (r < innerRadius + innerHolePadding) r = innerRadius + innerHolePadding;

        const angle = baseAngle + band / 2 + angleJitter;
        const x = Math.sin(angle) * r;
        const y = -Math.cos(angle) * r;

        pointsGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 5)
          .attr("fill", colorScale(key) as string)
          .attr("stroke", "#fff")
          .attr("stroke-width", 0.6)
          .attr("opacity", 0.95)
          .append("title")
          .text(`${key.replace(/_/g, " ")}: ${value} (${record.date_testing})`);
      });
    });

    // ---- curved labels ----


    // ---- inner hole ----
    svg
      .append("circle")
      .attr("r", innerRadius - innerHolePadding / 2)
      .attr("fill", innerHoleFill)
      .attr("stroke", "none")
      .attr("pointer-events", "none");

    // ---- "Optimal Biomarkers" with big 6 ----
    const centerGroup = svg.append("g").attr("text-anchor", "middle");

    centerGroup
      .append("text")
      .attr("y", -8)
      .attr("font-size", 96)
      .attr("font-weight", 700)
      .attr("fill", "#0d6efd")
      .text("6");

    centerGroup
      .append("text")
      .attr("y", 45)
      .attr("font-size", 18)
      .attr("font-weight", 500)
      .attr("fill", "#333")
      .text("Optimal Biomarkers");
  }, []);

  return (
    <Stack style={{ textAlign: "center" }}>
      <h3>Biomarker Radial Chart</h3>
      <svg ref={ref} width="100%" height="100%" />
    </Stack>
  );
};

export default RadialBiomarkerChart;
