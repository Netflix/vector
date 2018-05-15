(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

function cantorPair (x, y) {
  var z = ((x + y) * (x + y + 1)) / 2 + y;
  return z
}

var heatmap = function () {
  var svg = null;
  var columns = 0;
  var rows = 0;
  var title = '';
  var subtitle = '';
  var legendLabel = '';
  var width = 960;
  var margin = {
    top: 20,
    right: 0,
    bottom: 0,
    left: 0
  };
  var gridSize = null;
  var colorScale = null;

  var xAxisScale = null;
  var yAxisScale = null;
  var xAxisTickFormat = d3.format('.0f');
  var yAxisTickFormat = d3.format('.2s');
  var xAxisScaleTicks = 20;
  var yAxisScaleTicks = 20;

  var xAxisLabels = null;
  var yAxisLabels = null;
  var xAxisLabelFormat = function (d) { return d };
  var yAxisLabelFormat = function (d) { return d };

  var hideLegend = false;
  var legendScaleTicks = 5;

  var clickHandler = null;
  var mouseOverHandler = null;
  var mouseOutHandler = null;

  var highlight = [];
  var highlightColor = '#936EB5';
  var highlightOpacity = '0.4';

  var invertHighlightRows = false;

  var gridStrokeOpacity = 0.6;

  var nullValueColor = '#CCCCCC';

  function click (d, i, j) {
    if (typeof clickHandler === 'function') {
      clickHandler(d, i, j);
    }
  }

  function mouseOver (d, i, j) {
    if (typeof mouseOverHandler === 'function') {
      mouseOverHandler(d, i, j);
    }
  }

  function mouseOut (d, i, j) {
    if (typeof mouseOutHandler === 'function') {
      mouseOutHandler(d, i, j);
    }
  }

  function getHighlightFrames () {
    var highlightFrames = [];
    for (var k in highlight) { // all highlights
      if (highlight[k].start[0] <= highlight[k].end[0]) { // no reverse column range highlight
        for (var i = highlight[k].start[0]; i <= highlight[k].end[0]; i++) {
          var j = null;
          if (i > highlight[k].start[0] && i < highlight[k].end[0]) { // middle columns
            for (j = 0; j < rows; j++) {
              highlightFrames.push([i, j]);
            }
          } else if (i === highlight[k].start[0]) { // start column, or start and end are the same
            if (!invertHighlightRows) { // not inverted row selection
              if (i === highlight[k].end[0]) { // ends in the same column
                if (highlight[k].start[1] <= highlight[k].end[1]) { // no reverse row range highlight
                  for (j = highlight[k].start[1]; j <= highlight[k].end[1]; j++) {
                    highlightFrames.push([i, j]);
                  }
                } else {
                  console.log('Error: Start row is higher than end row. No reverse range highlight.');
                }
              } else { // doesn't end in the same column
                for (j = highlight[k].start[1]; j < rows; j++) {
                  highlightFrames.push([i, j]);
                }
              }
            } else { // inverted row selection
              if (i === highlight[k].end[0]) { // ends in the same column
                if (highlight[k].start[1] >= highlight[k].end[1]) { // no reverse row range highlight. backwards in inverted.
                  for (j = highlight[k].start[1]; j >= highlight[k].end[1]; j--) {
                    highlightFrames.push([i, j]);
                  }
                } else {
                  console.log('Error: Start row is higher than end row. No reverse range highlight.');
                }
              } else { // doesn't end in the same column
                for (j = highlight[k].start[1]; j >= 0; j--) {
                  highlightFrames.push([i, j]);
                }
              }
            }
          } else { // end column, when different than start column
            if (!invertHighlightRows) { // not inverted row selection
              for (j = highlight[k].end[1]; j >= 0; j--) {
                highlightFrames.push([i, j]);
              }
            } else { // inverted row selection
              for (j = highlight[k].end[1]; j < rows; j++) {
                highlightFrames.push([i, j]);
              }
            }
          }
        }
      } else {
        console.log('Error: Start column is higher than end column. No reverse range highlight.');
      }
    }
    return highlightFrames
  }

  function updateHighlight () {
    if (svg && rows && gridSize) {
      var highlightFrames = getHighlightFrames();
      var frames = svg.selectAll('g.highlight')
        .data(highlightFrames, function (d) { return cantorPair(d[0], d[1]) });
      frames.exit().remove();
      frames.enter().append('g')
        .attr('class', 'highlight')
        .append('rect')
        .attr('x', function (d) { return (d[0] * gridSize) + 3 })
        .attr('y', function (d) { return d[1] * gridSize })
        .attr('width', gridSize)
        .attr('height', gridSize)
        .style('fill', highlightColor)
        .style('fill-opacity', highlightOpacity)
        .style('pointer-events', 'none');
    } else {
      console.log("Error: Can't update highlight. Heatmap was not initialized.");
    }
  }

  function heatmap (selection) {
    var data = selection.datum();

    columns = data.length;
    rows = data[0].length;
    var calculatedMargin = Object.assign({}, margin);

    if (title) {
      calculatedMargin.top = margin.top + 50;
    }

    if (subtitle) {
      calculatedMargin.top = margin.top + 20;
    }

    if (!hideLegend) {
      calculatedMargin.bottom = margin.bottom + 50;
    }

    if (yAxisScale || yAxisLabels) {
      calculatedMargin.left = margin.left + 50;
    }

    gridSize = (width - calculatedMargin.left - calculatedMargin.right) / columns;
    var height = gridSize * (rows + 2);

    var max = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] > max) { max = data[i][j]; }
      }
    }

    if (!colorScale) {
      colorScale = d3.scaleLinear()
        .domain([0, max / 2, max])
        .range(['#FFFFDD', '#3E9583', '#1F2D86']);
        // .interpolate(d3.interpolateHcl);
    }

    svg = selection
      .append('svg')
      .attr('width', width + calculatedMargin.left + calculatedMargin.right + 9)
      .attr('height', height + calculatedMargin.top + calculatedMargin.bottom)
      .append('g')
      .attr('transform', 'translate(' + calculatedMargin.left + ',' + calculatedMargin.top + ')');

    var fontSize = Math.min(gridSize, 10);

    if (yAxisScale || yAxisLabels) {
      if (yAxisScale) {
        var y = d3.scaleLinear()
          .domain(yAxisScale)
          .range([(gridSize * rows), 0]);

        svg.append('g')
          .attr('transform', 'translate(3, 0)')
          .attr('class', 'rowLabel axis')
          .call(d3.axisLeft(y)
            .ticks(yAxisScaleTicks)
            .tickFormat(yAxisTickFormat));
      } else {
        svg.selectAll('.rowLabel')
          .data(yAxisLabels)
          .enter().append('text')
          .text(yAxisLabelFormat)
          .attr('x', 0)
          .attr('y', function (d, i) { return i * gridSize })
          .style('text-anchor', 'end')
          .style('font-size', fontSize + 'px')
          .attr('transform', 'translate(-6,' + gridSize / 1.2 + ')')
          .attr('class', 'rowLabel mono axis');
      }
    }

    if (xAxisScale || xAxisLabels) {
      if (xAxisScale) {
        var x = d3.scaleLinear()
          .domain(xAxisScale)
          // .range([0, width - calculatedMargin.left - calculatedMargin.right - 40])
          .range([0, width - calculatedMargin.left - calculatedMargin.right]);

        svg.append('g')
          .attr('transform', 'translate(3, 3)')
          .attr('class', 'columnLabel axis')
          .call(d3.axisTop(x)
            .ticks(xAxisScaleTicks)
            .tickFormat(xAxisTickFormat));
      } else {
        var approxTextHeight = 1.40333 * fontSize;
        svg.selectAll('.columnLabel')
          .data(xAxisLabels)
          .enter().append('text')
          .text(xAxisLabelFormat)
          .attr('y', function (d, i) { return i * gridSize })
          .attr('x', 0)
          .style('text-anchor', 'beginning')
          .style('font-size', fontSize + 'px')
          .attr('transform', 'translate(' + (gridSize + approxTextHeight) / 2 + ', -6) rotate(270)')
          .attr('class', 'columnLabel mono axis');
      }
    }

    svg.selectAll('g.column')
      .data(data)
      .enter().append('g')
      .each(function (d, i) { // function (d, i, j) might replace .each.
        d3.select(this).selectAll('rect')
          .data(d)
          .enter().append('rect')
          .attr('x', function (d) { return (i * gridSize) + 3 }) // column
          .attr('y', function (d, j) { return j * gridSize }) // row
          .attr('class', 'bordered')
          .attr('width', gridSize)
          .attr('height', gridSize)
          .style('stroke', 'white')
          .style('stroke-opacity', gridStrokeOpacity)
          .style('fill', function (d) { return d == null ? nullValueColor : colorScale(d) })
          .style('pointer-events', 'all')
          .on('mouseover', function (d, j) { return mouseOver(d, i, j) })
          .on('mouseout', function (d, j) { return mouseOut(d, i, j) })
          .on('click', function (d, j) { return click(d, i, j) });
      });

    if (highlight && highlight.length > 0) {
      updateHighlight();
    }

    // Append title to the top
    if (title) {
      svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', -60)
        .style('text-anchor', 'middle')
        .text(title);
    }

    if (subtitle) {
      svg.append('text')
        .attr('class', 'subtitle')
        .attr('x', width / 2)
        .attr('y', -40)
        .style('text-anchor', 'middle')
        .text(subtitle);
    }

    if (!hideLegend) {
      // Extra scale since the color scale is interpolated
      var countScale = d3.scaleLinear()
        .domain([0, max])
        .range([0, width]);

      // Calculate the variables for the temp gradient
      var numStops = 10;
      var countRange = countScale.domain();
      var countPoint = [];

      countRange[2] = countRange[1] - countRange[0];
      for (var i = 0; i < numStops; i++) {
        countPoint.push(i * countRange[2] / (numStops - 1) + countRange[0]);
      }// for i

      // Create the gradient
      svg.append('defs')
        .append('linearGradient')
        .attr('id', 'legend-traffic')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%')
        .selectAll('stop')
        .data(d3.range(numStops))
        .enter().append('stop')
        .attr('offset', function (d, i) {
          return countScale(countPoint[i]) / width
        })
        .attr('stop-color', function (d, i) {
          return colorScale(countPoint[i])
        });

      var legendWidth = Math.min(width * 0.8, 400);
      // Color Legend container
      var legendsvg = svg.append('g')
        .attr('class', 'legendWrapper')
        .attr('transform', 'translate(' + (width / 2) + ',' + (gridSize * rows + 40) + ')');

      // Draw the Rectangle
      legendsvg.append('rect')
        .attr('class', 'legendRect')
        .attr('x', -legendWidth / 2)
        .attr('y', 0)
        // .attr("rx", hexRadius*1.25/2)
        .attr('width', legendWidth)
        .attr('height', 10)
        .style('fill', 'url(#legend-traffic)');

      // Append title
      legendsvg.append('text')
        .attr('class', 'legendTitle')
        .attr('x', 0)
        .attr('y', -10)
        .style('text-anchor', 'middle')
        .text(legendLabel);

      // Set scale for x-axis
      var xScale = d3.scaleLinear()
        .range([-legendWidth / 2, legendWidth / 2])
        .domain([0, max]);

      // Define x-axis
      var xAxis = d3.axisBottom()
        .ticks(legendScaleTicks)
        // .tickFormat(formatPercent)
        .scale(xScale);

      // Set up X axis
      legendsvg.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0,' + (10) + ')')
        .call(xAxis);
    }
  }

  heatmap.title = function (_) {
    if (!arguments.length) { return title }
    title = _;
    return heatmap
  };

  heatmap.subtitle = function (_) {
    if (!arguments.length) { return subtitle }
    subtitle = _;
    return heatmap
  };

  heatmap.legendLabel = function (_) {
    if (!arguments.length) { return legendLabel }
    legendLabel = _;
    return heatmap
  };

  heatmap.width = function (_) {
    if (!arguments.length) { return width }
    width = _;
    return heatmap
  };

  heatmap.margin = function (_) {
    if (!arguments.length) { return margin }
    margin = _;
    return heatmap
  };

  heatmap.colorScale = function (_) {
    if (!arguments.length) { return colorScale }
    colorScale = _;
    return heatmap
  };

  heatmap.xAxisScale = function (_) {
    if (!arguments.length) { return xAxisScale }
    xAxisScale = _;
    return heatmap
  };

  heatmap.yAxisScale = function (_) {
    if (!arguments.length) { return yAxisScale }
    yAxisScale = _;
    return heatmap
  };

  heatmap.xAxisScaleTicks = function (_) {
    if (!arguments.length) { return xAxisScaleTicks }
    xAxisScaleTicks = _;
    return heatmap
  };

  heatmap.yAxisScaleTicks = function (_) {
    if (!arguments.length) { return yAxisScaleTicks }
    yAxisScaleTicks = _;
    return heatmap
  };

  heatmap.xAxisLabelFormat = function (_) {
    if (!arguments.length) { return xAxisLabelFormat }
    xAxisLabelFormat = _;
    return heatmap
  };

  heatmap.yAxisLabelFormat = function (_) {
    if (!arguments.length) { return yAxisLabelFormat }
    yAxisLabelFormat = _;
    return heatmap
  };

  heatmap.xAxisTickFormat = function (_) {
    if (!arguments.length) { return xAxisTickFormat }
    xAxisTickFormat = _;
    return heatmap
  };

  heatmap.yAxisTickFormat = function (_) {
    if (!arguments.length) { return yAxisTickFormat }
    yAxisTickFormat = _;
    return heatmap
  };

  heatmap.hideLegend = function (_) {
    if (!arguments.length) { return hideLegend }
    hideLegend = _;
    return heatmap
  };

  heatmap.legendScaleTicks = function (_) {
    if (!arguments.length) { return legendScaleTicks }
    legendScaleTicks = _;
    return heatmap
  };

  heatmap.onClick = function (_) {
    if (!arguments.length) { return clickHandler }
    clickHandler = _;
    return heatmap
  };

  heatmap.onMouseOver = function (_) {
    if (!arguments.length) { return mouseOverHandler }
    mouseOverHandler = _;
    return heatmap
  };

  heatmap.onMouseOut = function (_) {
    if (!arguments.length) { return mouseOutHandler }
    mouseOutHandler = _;
    return heatmap
  };

  heatmap.xAxisLabels = function (_) {
    if (!arguments.length) { return xAxisLabels }
    xAxisLabels = _;
    return heatmap
  };

  heatmap.yAxisLabels = function (_) {
    if (!arguments.length) { return yAxisLabels }
    yAxisLabels = _;
    return heatmap
  };

  heatmap.gridStrokeOpacity = function (_) {
    if (!arguments.length) { return gridStrokeOpacity }
    gridStrokeOpacity = _;
    return heatmap
  };

  heatmap.highlightColor = function (_) {
    if (!arguments.length) { return highlightColor }
    highlightColor = _;
    return heatmap
  };

  heatmap.highlightOpacity = function (_) {
    if (!arguments.length) { return highlightOpacity }
    highlightOpacity = _;
    return heatmap
  };

  heatmap.setHighlight = function (_) {
    if (!arguments.length) { return highlight }
    highlight = _;
    return heatmap
  };

  heatmap.invertHighlightRows = function (_) {
    if (!arguments.length) { return invertHighlightRows }
    invertHighlightRows = _;
    return heatmap
  };

  heatmap.updateHighlight = updateHighlight;

  heatmap.nullValueColor = function (_) {
    if (!arguments.length) { return nullValueColor }
    nullValueColor = _;
    return heatmap
  };

  return heatmap
};

exports.heatmap = heatmap;

Object.defineProperty(exports, '__esModule', { value: true });

})));
