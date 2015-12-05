document.addEventListener("DOMContentLoaded", function() {
    var numberOfAsteroids = 10;
    var asteroidData = [];
    var boardWidth = window.innerWidth-(window.innerWidth*0.10);
    var boardHeight = window.innerHeight-(window.innerHeight*0.10);
    var asteroidRadius = 10;
    var asteroidColor = 'gray';

    var svgSelection = d3.select('body').append("svg")
        .attr("width", boardWidth)
        .attr("height", boardHeight)
        .style("border-style", "solid");

    var playerData = [{
        cx : 500,
        cy : 600,
        r: 10,
        fill: 'orange',
        id: 'player1'
    }];

    var player = svgSelection.selectAll('circle')
        .data(playerData, function (d) {
            return d.id;
        });

    var drag = d3.behavior.drag()
        .on('drag', function() {
            player.attr('cx', d3.event.x)
                .attr('cy', d3.event.y);
        });

    player.enter()
        .append('circle')
        .attr({
            'cx': function(d){
                return d.cx;
            },
            'cy': function(d){
                return d.cy;
            },
            'r': function(d){
                return d.r;
            },
            'fill': function(d){
                return d.fill;
            }
        })
        .call(drag);


    function update() {
        asteroidData = [];
        for (var i=0; i<numberOfAsteroids; i++){
            asteroidData.push({
                'key':i,
                'cx':Math.floor(Math.random() * (boardWidth - (boardWidth * 0.10))),
                'cy': Math.floor(Math.random() * (boardHeight- (boardHeight * 0.10))),
                'r': asteroidRadius,
                'fill': asteroidColor})
        }

        var asteroids = svgSelection.selectAll('circle')
            .data(asteroidData, function(d){
                return d.key;
            });

        //One time run
        asteroids.enter() //ENTER
            .append('circle')
            .attr({
                'cx': function(d){
                    return d.cx;
                },
                'cy': function(d){
                    return d.cy;
                },
                'r': function(d){
                    return d.r;
                },
                'fill': function(d){
                    return d.fill;
                }
            });

        asteroids.transition().duration(2500)
            .attr({
                'cx': function(d){
                    return d.cx;
                },
                'cy': function(d){
                    return d.cy;
                },
                'r': function(d){
                    return d.r;
                },
                'fill': function(d){
                    return d.fill;
                }
            });
    }

    update();

    setInterval(function(){
        update();
    }, 1500);
});
