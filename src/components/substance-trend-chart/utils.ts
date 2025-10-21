import * as d3 from "d3";

import type { DataPoint, TooltipState } from "./types";

export const drawDots = (
  svg: d3.Selection<SVGGElement, undefined, HTMLElement, unknown>,
  data: DataPoint[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  color: string,
  getStatusColor: (value: number) => string,
  setTooltipState: React.Dispatch<React.SetStateAction<TooltipState>>,
  label: string,
  rangeMin: number,
  rangeMax: number,
  CHART_MARGIN: { top: number; right: number; bottom: number; left: number; }
) => {
  const minDataValue = d3.min(data.map(d => d.value)) || 0;

  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => xScale(d.date)! + xScale.bandwidth() / 2)
    // Start circles at a low Y value (or the chart floor) for the drop-in effect
    .attr("cy", yScale(minDataValue)) 
    .attr("r", 4)
    .attr("fill", color)
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .style("cursor", "pointer")

    // Drop-in transition for the circles
    .transition()
    .delay((_d, i) => 50 + i * 50) // Delay until line animation is done (1500ms) + stagger
    .duration(300)
    .ease(d3.easeQuadOut)
    .attr("cy", (d) => yScale(d.value)) // Animate to final Y position

    // Attach interaction after transition ends
    .on("end", function() { 
      d3.select(this)
        .on("mouseover", function (_event, d) {
          const statusColor = getStatusColor((d as DataPoint).value);
          d3.select(this).attr("r", 6).attr("fill", statusColor); 

          // Calculate absolute position for the React Tooltip
          const xPos =
            xScale((d as DataPoint).date)! + xScale.bandwidth() / 2 + CHART_MARGIN.left;
          const yPos = yScale((d as DataPoint).value) + CHART_MARGIN.top;

          setTooltipState({
            visible: true,
            x: xPos,
            y: yPos,
            data: {
              ...d as DataPoint,
              label,
              color,
              rangeMin,
              rangeMax,
            },
            statusColor: statusColor,
          });
        })

        .on("mouseout", function () {
          d3.select(this).attr("r", 4).attr("fill", color);
          setTooltipState((prev) => ({ ...prev, visible: false }));
        });
    });
};