document.addEventListener("DOMContentLoaded", function() {
    var numberOfAsteroids = 10;
    var asteroidData = [];
    var boardWidth = window.innerWidth-(window.innerWidth*0.10);
    var boardHeight = window.innerHeight-(window.innerHeight*0.10);
    var asteroidRadius = 10;
    var asteroidColor = 'gray';
    var counter = 0;
    var score = 0;
    var highScore = 0;


    var calculateDistance = function(x1,y1,x2,y2){
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    };

    var axes = {
        x: d3.scale.linear().domain([0,100]).range([0,boardWidth]),
        y: d3.scale.linear().domain([0,100]).range([0,boardHeight])
    };

    var playerData = [{
        cx : 500,
        cy : 600,
        r: 10,
        fill: 'orange',
        id: 'player1'
    }];


    var scoreBoardSelection = d3.select('body').select('.scoreboard');
    var collisionText = scoreBoardSelection.select('.collisions span');

    setInterval(function () {
        score += 1
        scoreBoardSelection.select('.current span').text(score);
        if(score > highScore){
            highScore = score;
            scoreBoardSelection.select('.highscore span').text(highScore);
        }

    }, 100);

    var svgSelection = d3.select('body').append("svg")
        .attr("width", boardWidth)
        .attr("height", boardHeight)
        .style("border-style", "solid")
        .style("background-color", "white");

    var player = svgSelection.selectAll('circle')
        .data(playerData, function (d) {
            return d.id;
        });

    var asteroids = svgSelection.selectAll('circle')
        .data(asteroidData, function(d){
            return d.key;
        });

    var drag = d3.behavior.drag()
        .on('drag', function() {
            player.attr('cx', d3.event.x).attr('cy', d3.event.y);
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
                return d.r+"px";
            },
            'fill': function(d){
                return d.fill;
            }
        })
        .call(drag);

    function update() {
        var allowCollision = true;


        asteroidData = [];
        for (var i=0; i<numberOfAsteroids; i++){
            asteroidData.push({
                'key':i,
                'cx':Math.floor(Math.random() * (boardWidth - (boardWidth * 0.10))),
                'cy': Math.floor(Math.random() * (boardHeight- (boardHeight * 0.10))),
                'r': asteroidRadius+"px",
                'fill': asteroidColor})
        }

        asteroids = svgSelection.selectAll('circle')
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

        asteroids
            .transition()
            .duration(2500)
            .tween('custom', function(endData){
                var asteroid = d3.select(this);
                var startPos = { x: parseFloat(asteroid.attr('cx')), y: parseFloat(asteroid.attr('cy')) };
                var endPos = { x: parseFloat(endData.cx), y: parseFloat(endData.cy) };
                var alreadyCollide = false;
                return function(t) {
                    var asteroidNextPos = { x: startPos.x + (endPos.x - startPos.x)*t, y: startPos.y + (endPos.y - startPos.y)*t };
                    var distance = calculateDistance(asteroidNextPos.x,asteroidNextPos.y,parseFloat(player.attr('cx')), parseFloat(player.attr('cy')))
                    if(distance < (parseFloat(asteroidRadius) + parseFloat(playerData[0].r))*0.9){
                        if(allowCollision) {
                            counter++;
                            svgSelection
                                .transition()
                                .duration(200)
                                .style("background-color", "red")
                                .transition()
                                .duration(200)
                                .style("background-color", "white");
                            collisionText.text(counter);
                            allowCollision = false;
                            score = 0;
                        }
                    }
                };
            })
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

        asteroids.on("tick", function(e) {
            console.log(e);
        });

    }

    update();

    setInterval(function(){
        update();
    }, 2500);
});
