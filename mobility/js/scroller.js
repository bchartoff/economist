// Scroller based on Jim Vallandingham's `scroll_demo` https://github.com/vlandham/scroll_demo
function scroller() {
  var container = d3.select('body');
  var dispatch = d3.dispatch('active','resized', 'update');

  var sections = null;

  var sectionPositions = [];
  var currentIndex = -1;
  var containerStart = 0;

  function scroll(els) {
    sections = els;

    d3.select(window)
      .on('scroll.scroller', position)
      .on('resize.scroller', resize);

    resize();

    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  function resize() {
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
    dispatch.call('resized', this);
  }


  function fixVis(){
    if(d3.select("#topText").node().getBoundingClientRect().bottom <= 50){
      d3.select("#vis")
        .classed("posFixed", true)
        .style("top", "20px")  
        .style("left", .5*(window.innerWidth-960) + "px");
    }
    else{
      d3.select("#vis")
        .classed("posFixed", false)  
        .style("top", "inherit")
        .style("left", "inherit");
    }    
  }
  window.setInterval(function(){
    fixVis();
  }, 20);

  function position() {
    var pos = window.pageYOffset - 100 - containerStart;
    fixVis();
    var sectionIndex = d3.bisect(sectionPositions, pos) - 1;
    sectionIndex = Math.max(0,Math.min(sections.size() -1, sectionIndex));


    if (currentIndex !== sectionIndex) {
      dispatch.call('active', this, sectionIndex);
      currentIndex = sectionIndex;
      d3.select("#sectionIndex").attr("data-index",currentIndex);
    }else{
      var sectionOffset = (pos - sectionPositions[sectionIndex])/(sectionPositions[sectionIndex + 1] - sectionPositions[sectionIndex]);
      dispatch.call('update', this, sectionIndex, sectionOffset);
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
  }


  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}