/**
* scrollVis - encapsulates
* all the code for the visualization
* using reusable charts pattern:
* http://bost.ocks.org/mike/chart/
*/
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.

    var lastIndex = -1;
  var activeIndex = 0;
var margin = {top: 40, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = null

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

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  var updateFunctions = []


  /**
  * chart
  *
  * @param selection - the current d3 selection(s)
  *  to draw the visualization in. For this
  *  example, we will be drawing it in #vis
  */
  var chart = function (selection) {
    selection.each(function (data) {
      // create svg and give it a width and height
// append the svg object to the body of the page
svg = d3.select(this)
  .append("svg")

    .datum(data)


      svg.attr('width', width + margin.left + margin.right);
      svg.attr('height', height + margin.top + margin.bottom);

      g = svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      setupVis(data);

      setupSections(data);
    });
  };




  /**
  * setupVis - creates initial elements for all
  * sections of the visualization.
  *
  * @param wordData - data object for each word.
  * @param fillerCounts - nested data that includes
  *  element for each filler word type.
  * @param histData - binned histogram data
  */
  var setupVis = function (data) {    
  g.append("g")
    .call(d3.axisBottom(x))
    .attr("transform", "translate(0," + y(.5) + ")")
    .attr("class", "x axis");


  g.append("g")
    .call(d3.axisLeft(y))
    .attr("transform", "translate(" + x(0) + ",0)")
    .attr("class", "y axis");

  var dots = g.append('g')
  dots.selectAll(".dot2")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.wk0); } )
      .attr("cy", function (d) { return y(d.trumpVoteshare); } )
      .attr("r", function(d){
        return Math.sqrt(d.pop) * 0.008
      })
      .style("fill", function(d){
        return colors(d.trumpVoteshare)
        })
      // .style("stroke", "black")
      .attr("class", function(d){
        return "dot2 " + "f" + d.fips 
      })
      .style("opacity",.4)

  d3.select(".dateLabel")
    .text(MONTHS[START_DATE.getMonth()] + " " + START_DATE.getDate() + ", " + START_DATE.getFullYear())


  var cookD =  data.filter(function(d){ return d.fips == "17031"})[0],
      shelbyD = data.filter(function(d){ return d.fips == "17173"})[0]

  console.log(cookD)

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
    .style("display","none")

  dots.append("text")
    .attr("id", "cookLabel")
    .attr("class", "countyExample exampleLabel")
    .datum(cookD)
    .attr("y", function(d){ return y(d.trumpVoteshare) })
    .attr("x", function(d){ return x(d.wk5) })
    .attr("dy", -20)
    .attr("dx", 20)
    .text("Cook County, IL")
    .style("display", "none")

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
    .style("display","none")

  dots.append("text")
    .attr("id", "shelbyLabel")
    .attr("class", "countyExample exampleLabel")
    .datum(shelbyD)
    .attr("y", function(d){ return y(d.trumpVoteshare) })
    .attr("x", function(d){ return x(d.wk5) })
    .attr("dy", -10)
    .attr("dx", 10)
    .text("Shelby County, IL")
    .style("display", "none")

  dots.append("text")
    .attr("class", "countyExample exampleDateLabel")
    .datum(shelbyD)
    .attr("y", function(d){ return y(d.trumpVoteshare) })
    .attr("x", function(d){ return x(d.wk5) })
    .attr("dy", -10)
    .attr("dx", -30)
    .text("3/24/2020")
    .style("display", "none")

  dots.append("text")
    .attr("class", "countyExample exampleDateLabel")
    .datum(cookD)
    .attr("y", function(d){ return y(d.trumpVoteshare) })
    .attr("x", function(d){ return x(d.wk5) })
    .attr("dy", -18)
    .attr("dx", -30)
    .text("3/24/2020")
    .style("display", "none")

  dots.append("circle")
    .attr("class", "countyExample exampleStartDot")
    .datum(cookD)
    .attr("cy", function(d){ return y(d.trumpVoteshare) })
    .attr("cx", function(d){ return x(d.wk5) })
    .attr("r", 10)
    .style("fill" ,"#fdbf11")
    .style("display", "none")

  dots.append("circle")
    .attr("class", "countyExample exampleStartDot")
    .datum(shelbyD)
    .attr("cy", function(d){ return y(d.trumpVoteshare) })
    .attr("cx", function(d){ return x(d.wk5) })
    .attr("r", 3)
    .style("fill" ,"#fdbf11")
    .style("display", "none")



  };

  /**
  * setupSections - each section is activated
  * by a separate function. Here we associate
  * these functions to the sections based on
  * the section's index.
  *
  */
  var setupSections = function (data) {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = function(){console.log("blank 0")}
    activateFunctions[1] = function(){ step1(data) };
    activateFunctions[2] = function(){ step2(data) };
    activateFunctions[3] = function(){ step3(data) };
    activateFunctions[4] = function(){ };
    activateFunctions[5] = function(){ step4(data) };
    activateFunctions[6] = function(){  };
    activateFunctions[7] = function(){  };


    updateFunctions[0] = function(offset){ }
    updateFunctions[1] = function(offset){ update1(data, offset) }
    updateFunctions[2] = function(){}
    updateFunctions[3] = function(offset){ update2(data, offset) }
    updateFunctions[4] = function(){}
    updateFunctions[5] = function(){}
    updateFunctions[6] = function(){}
    updateFunctions[7] = function(){}

    
  };

  /**
  * ACTIVATE FUNCTIONS
  *
  * These will be called their
  * section is scrolled to.
  *
  * General pattern is to ensure
  * all content for the current section
  * is transitioned in, while hiding
  * the content for the previous section
  * as well as the next section (as the
  * user may be scrolling up or down).
  *
  */

  function step1(data) {
    console.log("blank 1")
    d3.selectAll(".countyExample").style("display", "none")
  }

  function step2(data){
    // console.log(2, data)
    // "17173"
    // "17031"
    // d3.select(".dot2.f17031").style("stroke","red").style("stroke-width","3px")
        d3.selectAll(".dot2").style("stroke","none")
        d3.selectAll(".countyExample").style("display", "none")


  }
  function step3(data){
    // console.log(2, data)
    // "17173"
    // "17031"
    d3.selectAll(".countyExample").style("display", "block")

    d3.selectAll(".dot2")
            .style("stroke","none")

    d3.select(".dot2.f17173").style("stroke","#fdbf11").style("stroke-width","10px").style("opacity",1)
    d3.select(".dot2.f17031").style("stroke","#fdbf11").style("stroke-width","10px").style("opacity",1)
    
    d3.select(".dot2.f17173").node().parentNode.appendChild(d3.select(".dot2.f17173").node())
    d3.select(".dot2.f17031").node().parentNode.appendChild(d3.select(".dot2.f17031").node())

    d3.selectAll(".axisLabel.x").style("display", "block")
    d3.selectAll(".axisLabel.x.change").style("display", "none")

  }
  function step4(data){
    
    d3.selectAll(".countyExample").style("display", "none")
    d3
    .selectAll(".dot2")
      .style("stroke","#fdbf11")
      .style("stroke-width","1px")
            .style("opacity", function(d){
              console.log(d)
            if( +d["hide64"] == 0 || +d["hide5"] == 0 ){
              return 0

            }else{
              return .4;
            }
          })
      .transition()
      // .delay(function(d,i){ return d.trumpVoteshare * 500})

      .ease(d3.easeLinear)
      .attr("cx", function (d) {return x(d["wk64"] -  d["wk5"]); } )


    d3.selectAll(".axisLabel.x").style("display", "none")
    d3.selectAll(".axisLabel.x.change").style("display", "block")


      d3.select(".dateLabel")
        .html("March 24, 2020 &ndash;May 11, 2021")
      // .style("stroke", "#fdbf11")
      // .style("stroke-width","2px")
      // .on("end", function(){
      //     d3.select(this).style("opacity", function(d){ return d["wk" + wkNum] == -999 ? 0 : .4})

      // })


  }


  function getTweenedWeekNum(offset, startOffset, endOffset, startStep, endStep){
    wkInterval = (endOffset-startOffset)/(endStep+1 - startStep)

    var wkNum;
    if(offset < startOffset) wkNum = startStep
    else if(offset > endOffset) wkNum = endStep
    else wkNum = startStep + d3.max([0,Math.floor((offset-startOffset)/wkInterval)])
    
    return wkNum
  }


  function updateDotPlotWeek(wkNum){
    d3
    .selectAll(".dot2")
      .transition()
      // .delay(function(d,i){ return d.trumpVoteshare * 500})
      .style("opacity", function(d){

            if( +d["hide" + wkNum] == 0){
              return 0
            }
            else if(activeIndex == 3 && (d.fips == "17173" || d.fips == "17031")){
              return 1;
            }else{
              return .4;
            }
          })
      .ease(d3.easeLinear)
      .attr("cx", function (d) {
        // if(d["wk" + wkNum] < -90) console.log(d["wk" + wkNum])
        return x(d["wk" + wkNum]); 
      } )

      d3.select("#cookLine")
      .transition()
          .ease(d3.easeLinear)

        .attr("x2", function(d){ return x(d["wk" + wkNum]) })

      d3.select("#cookLabel")
      .transition()
          .ease(d3.easeLinear)
        .attr("x", function(d){ return x(d["wk" + wkNum]) })


      d3.select("#shelbyLine")
      .transition()
          .ease(d3.easeLinear)

        .attr("x2", function(d){ return x(d["wk" + wkNum]) })

      d3.select("#shelbyLabel")
      .transition()
          .ease(d3.easeLinear)
        .attr("x", function(d){ return x(d["wk" + wkNum]) })



      newDate = new Date(START_DATE.getTime())
      newDate.setDate(newDate.getDate() + wkNum*7)
      var dateStr = MONTHS[newDate.getMonth()] + " " + newDate.getDate() + ", " + newDate.getFullYear();
      d3.select(".dateLabel")
        .text(dateStr)

      // console.log(wkNum)
      // if(wkNum == 52){
      d3.select(".dateCaption").style("display", wkNum == 52 ? "block" : "none")
  }

  function update1(data,offset){
    // console.log("asdf")
    // console.log(offset)
    var wkNum = getTweenedWeekNum(offset, 0, .95, 0, 5)
    updateDotPlotWeek(wkNum)



  }
  function update2(data,offset){
    var wkNum = getTweenedWeekNum(offset, 0, .95, 6, 64)
    updateDotPlotWeek(wkNum)
    
  }




  /**
  * DATA FUNCTIONS
  *
  * Used to coerce the data into the
  * formats we need to visualize
  *
  */


  // function getData(data) {
  //   return data.map(function (d, i) {
  //     d.wealth = +d.wealth;
  //     d.recaptureTwo = +d.wealth;
  //     d.recaptureThree = +d.wealth;
  //     return d;
  //   });
  // }

  /**
  * activate -
  *
  * @param index - index of the activated section
  */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };
  chart.update = function(index, offset){
    // var sign = (index - lastIndex) < 0 ? -1 : 1;
    // var scrolledSections = d3.range(lastIndex + sign, index + sign, sign);
    // scrolledSections.forEach(function (i) {
      updateFunctions[index](offset);
    // });
  }
  return chart;
};



/**
* display - called once data
* has been loaded.
* sets up the scroller and
* displays the visualization.
*
* @param data - loaded tsv data
*/
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();

  d3.select('#vis')
    // .style("left", function(){
    //     return "inherit"
    // })
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // scroll.on('resized', function(){
  //   d3.select("#vis svg").remove()
  //   display(rawData)
  // })

  // setup event handling
  scroll.on('active', function (index) {
    plot.activate(index);  
  });
  scroll.on('update', function (index, offset) {
    plot.update(index, offset);  
  });

}

// load data and display
d3.csv("data/weeklyData.csv", function(data){
  // data = data.filter(function(d){ return d.state == "Illinois"})
  display(data)
});
// 
