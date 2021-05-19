// Scroller based on Jim Vallandingham's `scroll_demo` https://github.com/vlandham/scroll_demo
var scrollVis = function () {
  // set up variables in chart's scope
  var lastIndex = -1;
  var activeIndex = 0;
  var margin = {top: 40, right: 30, bottom: 30, left: 30},
  width = 960 - margin.left - margin.right,
  height = 700 - margin.top - margin.bottom;

  var svg = null;

  var g = null;

  var x = d3.scaleLinear()
    .domain([-92, 30])
    .range([ 0, width ]);

  var y = d3.scaleLinear()
    .domain([0, 1])
    .range([ height, 0]);

  var colors = d3.scaleLinear()
    .domain([0,1])
    .range(["#0FB2F2","#F22E2E"]);

  var activateFunctions = [],
      updateFunctions = [];

  var chart = function (selection) {
    selection.each(function (data) {
      svg = d3.select(this)
        .append("svg")
        .datum(data);

      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      g = svg.append('g');

      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      setupVis(data);
      setupSections(data);
    });
  };

  var setupVis = function (data) {  
    // build out chart elements and set initial postiions
    g.append("g")
      .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + y(.5) + ")")
        .attr("class", "x axis");

    g.append("g")
      .call(d3.axisLeft(y))
        .attr("transform", "translate(" + x(0) + ",0)")
        .attr("class", "y axis");

    //dots, positioned by voteshare and mobility data
    //sized by population 
    var dots = g.append('g');

    dots.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.wk0); } )
        .attr("cy", function (d) { return y(d.trumpVoteshare); } )
        .attr("r", function(d){
          return Math.sqrt(d.pop) * 0.008;
        })
        .style("fill", function(d){
          return colors(d.trumpVoteshare);
        })
        .attr("class", function(d){
          return "dot " + "f" + d.fips;
        })
        .style("opacity",.4)

    d3.select(".dateLabel")
      .text(MONTHS[START_DATE.getMonth()] + " " + START_DATE.getDate() + ", " + START_DATE.getFullYear());


    // annotation layer, add various labels and markers for the Cook County/Shelby County annotation
    var cookD =  data.filter(function(d){ return d.fips == "17031"})[0],
        shelbyD = data.filter(function(d){ return d.fips == "17173"})[0];

    dots.append("line")
      .attr("id", "cookLine")
      .attr("class", "countyExample exampleLine")
      .datum(cookD)
      .attr("x1", function(d){ return x(d.wk5) })
      .attr("x2", function(d){ return x(d.wk5) })
      .attr("y1", function(d){ return y(d.trumpVoteshare) })
      .attr("y2", function(d){ return y(d.trumpVoteshare) })
      .style("stroke", "#fdbf11")
      .style("stroke-width", "10px")
      .style("display","none");

    dots.append("text")
      .attr("id", "cookLabel")
      .attr("class", "countyExample exampleLabel")
      .datum(cookD)
      .attr("y", function(d){ return y(d.trumpVoteshare) })
      .attr("x", function(d){ return x(d.wk5) })
      .attr("dy", -20)
      .attr("dx", 20)
      .text("Cook County, IL")
      .style("display", "none");

    dots.append("line")
      .attr("id", "shelbyLine")
      .attr("class", "countyExample exampleLine")
      .datum(shelbyD)
      .attr("x1", function(d){ return x(d.wk5) })
      .attr("x2", function(d){ return x(d.wk5) })
      .attr("y1", function(d){ return y(d.trumpVoteshare) })
      .attr("y2", function(d){ return y(d.trumpVoteshare) })
      .style("stroke", "#fdbf11")
      .style("stroke-width", "4px")
      .style("display","none");

    dots.append("text")
      .attr("id", "shelbyLabel")
      .attr("class", "countyExample exampleLabel")
      .datum(shelbyD)
      .attr("y", function(d){ return y(d.trumpVoteshare) })
      .attr("x", function(d){ return x(d.wk5) })
      .attr("dy", -10)
      .attr("dx", 10)
      .text("Shelby County, IL")
      .style("display", "none");

    dots.append("text")
      .attr("class", "countyExample exampleDateLabel")
      .datum(shelbyD)
      .attr("y", function(d){ return y(d.trumpVoteshare) })
      .attr("x", function(d){ return x(d.wk5) })
      .attr("dy", -10)
      .attr("dx", -30)
      .text("3/24/2020")
      .style("display", "none");

    dots.append("text")
      .attr("class", "countyExample exampleDateLabel")
      .datum(cookD)
      .attr("y", function(d){ return y(d.trumpVoteshare) })
      .attr("x", function(d){ return x(d.wk5) })
      .attr("dy", -18)
      .attr("dx", -30)
      .text("3/24/2020")
      .style("display", "none");

    dots.append("circle")
      .attr("class", "countyExample exampleStartDot")
      .datum(cookD)
      .attr("cy", function(d){ return y(d.trumpVoteshare) })
      .attr("cx", function(d){ return x(d.wk5) })
      .attr("r", 10)
      .style("fill" ,"#fdbf11")
      .style("display", "none");

    dots.append("circle")
      .attr("class", "countyExample exampleStartDot")
      .datum(shelbyD)
      .attr("cy", function(d){ return y(d.trumpVoteshare) })
      .attr("cx", function(d){ return x(d.wk5) })
      .attr("r", 3)
      .style("fill" ,"#fdbf11")
      .style("display", "none");

    // Legend for circle sizes
    var legend = g.append("g")
      .attr("id", "dotLegend");

    legend.attr("transform", "translate(" + (width - 50) + "," + (height - 35) + ")");

    legend.append("circle")
      .attr("class", "legendCircle")
      .attr("r", Math.sqrt(10000000) * 0.008);
    legend.append("circle")
      .attr("class", "legendCircle")
      .attr("r", Math.sqrt(5000000) * 0.008)
      .attr("cy", 8);
    legend.append("circle")
      .attr("class", "legendCircle")
      .attr("r", Math.sqrt(1000000) * 0.008)
      .attr("cy", 18.5);
    legend.append("text")
      .attr("class", "legendText")
      .attr("y", -27)
      .attr("x", -12)
      .text("10M");
    legend.append("text")
      .attr("class", "legendText")
      .attr("y", -11)
      .attr("x", -9)
      .text("5M");
    legend.append("text")
      .attr("class", "legendText")
      .attr("y", 9)
      .attr("x", -9)
      .text("1M");
    legend.append("text")
      .attr("class", "legendText")
      .attr("y", 40)
      .attr("x", -54)
      .text("County population");
  };


  var setupSections = function (data) {
    // functions that will load as each card reaches the center of the screen, on scroll
    activateFunctions[0] = function(){ };
    activateFunctions[1] = function(){ hideExampleEls(data) };
    activateFunctions[2] = function(){ hideExampleEls(data) };
    activateFunctions[3] = function(){ showExampleEls(data) };
    activateFunctions[4] = function(){ };
    activateFunctions[5] = function(){ styleChangeChart(data) };
    activateFunctions[6] = function(){  };
    activateFunctions[7] = function(){  };

    // functions which will run continuously as the user scrolls in between sections
    updateFunctions[0] = function(){ };
    updateFunctions[1] = function(offset){ update1(data, offset) };
    updateFunctions[2] = function(){ };
    updateFunctions[3] = function(offset){ update2(data, offset) };
    updateFunctions[4] = function(){ };
    updateFunctions[5] = function(){ };
    updateFunctions[6] = function(){ };
    updateFunctions[7] = function(){ };
  };

  function hideExampleEls(data) {
    // remove styles from the annotation step
    d3.selectAll(".countyExample").style("display", "none");
    d3.selectAll(".dot").style("stroke","none");
  }
  function showExampleEls(data){
    // show the annotations for Cook county and Shelby county
    d3.selectAll(".countyExample").style("display", "block");

    d3.selectAll(".dot")
      .style("stroke","none");

    d3.select(".dot.f17173")
      .style("stroke","#fdbf11")
      .style("stroke-width","10px")
      .style("opacity",1);
    d3.select(".dot.f17031")
      .style("stroke","#fdbf11")
      .style("stroke-width","10px")
      .style("opacity",1);

    d3.select(".dot.f17173").node().parentNode.appendChild(d3.select(".dot.f17173").node());
    d3.select(".dot.f17031").node().parentNode.appendChild(d3.select(".dot.f17031").node());

    d3.selectAll(".axisLabel.x")
      .style("display", "block");
    d3.selectAll(".axisLabel.x.change")
      .style("display", "none");
  }
  function styleChangeChart(data){
    // Style the final chart, which has alternate x axis labels and a yellow stroke
    // to link to the previous steps
    d3.selectAll(".countyExample").style("display", "none")
    d3.selectAll(".dot")
      .style("stroke","#fdbf11")
      .style("stroke-width","1px")
      .style("opacity", function(d){
        if( +d["hide64"] == 0 || +d["hide5"] == 0 ){
          return 0;

        }else{
          return .4;
        }
      })
      .transition()
      .ease(d3.easeLinear)
        .attr("cx", function (d) {return x(d["wk64"] -  d["wk5"]); } )

    d3.selectAll(".axisLabel.x").style("display", "none");
    d3.selectAll(".axisLabel.x.change").style("display", "block");

    d3.select(".dateLabel")
      .html("March 24, 2020 &ndash;May 11, 2021");
  }


  function getTweenedWeekNum(offset, startOffset, endOffset, startStep, endStep){
    // For the update steps, calculate the week based on scroll position
    var wkInterval = (endOffset-startOffset)/(endStep+1 - startStep);
    var wkNum;
    
    if(offset < startOffset) wkNum = startStep;
    else if(offset > endOffset) wkNum = endStep;
    else wkNum = startStep + d3.max([0,Math.floor((offset-startOffset)/wkInterval)]);

    return wkNum;
  }

  function updateDotPlotWeek(wkNum){
    // the main animation function—update the dot positions based on the date (week number)
    d3.selectAll(".dot")
      .transition()
      .style("opacity", function(d){
        if( +d["hide" + wkNum] == 0){
          return 0;
        }
        else if(activeIndex == 3 && (d.fips == "17173" || d.fips == "17031")){
          return 1;
        }else{
          return .4;
        }
      })
      .ease(d3.easeLinear)
        .attr("cx", function (d) {
          return x(d["wk" + wkNum]); 
        } )

    // update the annotation positions
    d3.select("#cookLine")
      .transition()
      .ease(d3.easeLinear)
        .attr("x2", function(d){ return x(d["wk" + wkNum]) });

    d3.select("#cookLabel")
      .transition()
      .ease(d3.easeLinear)
        .attr("x", function(d){ return x(d["wk" + wkNum]) });

    d3.select("#shelbyLine")
      .transition()
      .ease(d3.easeLinear)
        .attr("x2", function(d){ return x(d["wk" + wkNum]) });

    d3.select("#shelbyLabel")
      .transition()
      .ease(d3.easeLinear)
        .attr("x", function(d){ return x(d["wk" + wkNum]) });

    // update the date label
    newDate = new Date(START_DATE.getTime());
    newDate.setDate(newDate.getDate() + wkNum*7);

    var dateStr = MONTHS[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();
    d3.select(".dateLabel")
      .text(dateStr);

    // If it's Mardi Gras, show the caption
    d3.select(".dateCaption").style("display", wkNum == 52 ? "block" : "none");
  }

  function update1(data,offset){
    // Animate between Feb 18 2020 and March 24 2020
    var wkNum = getTweenedWeekNum(offset, 0, .95, 0, 5);
    updateDotPlotWeek(wkNum);
  }
  function update2(data,offset){
    // Animate between March 24 2020 and May 11 2020
    var wkNum = getTweenedWeekNum(offset, 0, .95, 6, 64);
    updateDotPlotWeek(wkNum);
  }

  chart.activate = function (index) {
    // fire the activateFunctions based on the section index
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };
  chart.update = function(index, offset){
    // fire the updateFunction based on the section index and scroll offset
    updateFunctions[index](offset);
  }

  return chart;
};



function display(data) {
  var plot = scrollVis();

  d3.select('#vis')
    .datum(data)
    .call(plot);

  var scroll = scroller()
    .container(d3.select('#graphic'));

  scroll(d3.selectAll('.step'));

  scroll.on('active', function (index) {
    plot.activate(index);  
  });
  scroll.on('update', function (index, offset) {
    plot.update(index, offset);  
  });

}

// load data and display
d3.csv("data/weeklyData.csv").then(function(data){
  display(data)
});
