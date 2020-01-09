class Wall {
    constructor() {
        this.type = "wall";
        this.description = "just a wall";
        this.passable = false;
    }
};
class Floor {
    constructor() {
        this.type = "floor";
        this.description = "just a floor";
        this.passable = true;
    }
};

class Player {
    constructor() {
        this.x = 1;
        this.y = 1;
        this.type = "player";
        this.health = 100;
    }

};

$(document).ready(function() {
            // var world = [
            //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            //         [1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            //         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            //     ];

//***********************************************************************//
    var worldHeight = 25;
    var worldWidth = 25;
    var world = [...Array(worldHeight)].map(e => Array(worldWidth).fill(new Floor));

    makeWorld();
    makeRooms(0, worldHeight, worldHeight, 0, worldWidth, worldWidth, 5);
    displayWorld();

//***********************************************************************//
    function makeWorld() {
        for(var i = 0; i < world.length; i++) {
            // console.log(i)
            world[i][0] = new Wall;
            world[i][world.length] = new Wall;
        }
        for(var i = 0; i < world[0].length; i++) {
            world[0][i] = new Wall;
            world[world.length-1][i] = new Wall;
        }
    }
            
    function randomInt(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function makeRooms(minY, maxY, remainY, minX, maxX, remainX, depth) {
        var ranHeight = randomInt(remainY/4, remainY/2);
        var ranWidth = randomInt(remainX/4, remainX/2);
        
        var remainY = remainY - ranHeight;
        var remainX = worldWidth - ranWidth;

        if (remainY >= 4 && ranHeight > 3) {
            // console.log('**************')
            // console.log('depth = ' + depth)
            // console.log('minY = ' + minY)
            // console.log('ranHeight = ' + ranHeight)
            // console.log('ranWidth = ' + ranWidth)
            // console.log('remainY = ' + remainY)

            for (var i = minY; i < minY + ranHeight; i++) {
                world[i][ranWidth+minX] = new Wall;
                for (var j = 0; j < worldWidth; j++) {
                    world[ranHeight+minY][j] = new Wall;
                }
                if (remainX < (worldHeight * 0.5)) {
                    var newWidth = remainX / 2;
                    for (var k = minY; k < minY + ranHeight; k++) {
                        world[k][newWidth+ranWidth] = new Wall;
                        remainX = worldWidth - newWidth;
                    }
                    var door = randomInt(minY+1, ranHeight-1);
                    world[door][newWidth+ranWidth] = new Floor;
                }
            }

            var doorOne = randomInt(minX+1, ranWidth-1);
            var doorTwo = randomInt(ranWidth+1, worldWidth-1);

            world[ranHeight+minY][doorOne] = new Floor;
            world[ranHeight+minY][doorTwo] = new Floor;

            var door = randomInt(minY+1, minY+ranHeight-1);
            world[door][ranWidth+minX] = new Floor;

            makeRooms(minY + ranHeight, maxY, remainY, minX, maxX, worldWidth, depth-1 );
        }              
    }

    function displayWorld() {
        var output = '';

        for(var i=0; i<world.length; i++) {
            output += "<div class='row'>";
            for(var j=0; j<world[i].length; j++) {
                if (world[i][j].type == "player") {
                    // console.log("player at i = " + i + "j = " + j);
                    output += "<div class='box player'></div>";
                }
                else if (world[i][j] == 2)
                    output += "<div class='box red'></div>";
                else if(world[i][j].type == "wall")
                    output += "<div class='box wall'></div>";
                else if (world[i][j].type == "floor") 
                    output += "<div class='box floor'></div>";
            }
            output +=  "</div>";
        }
        $('#world').html(output);
    }
    player = new Player;
    world[1][1] = player;
    var obj = new Floor;

    function showDescBox(desc) {
        $('#text').text(desc);
    }

    $(document).keydown(function(e) {
        // console.log(e.keyCode);
        // Down-40, Left-37, Right-39, Up-38
        // console.log(player.y, player.x);
        // Down
        $('#text').text("");
        if (e.keyCode == 40) {
            if (world[player.y+1][player.x].passable == true) {
                obj = world[player.y+1][player.x]
                world[player.y][player.x] = obj;
                player.y++;
                world[player.y][player.x] = player;
            }
            else {
                console.log(world[player.y+1][player.x].description);
                showDescBox(world[player.y+1][player.x].description);
            }
        }
        // Up
        if (e.keyCode == 38) {
            if (world[player.y-1][player.x].passable == true) {
                world[player.y][player.x] = obj;
                player.y--;
                obj = world[player.y][player.x];
                world[player.y][player.x] = player;
            }
            else {
                console.log(world[player.y-1][player.x].description);
                showDescBox(world[player.y-1][player.x].description);
            }
        }
        // Left
        if (e.keyCode == 37) {
            if (world[player.y][player.x - 1].passable == true) {
                world[player.y][player.x] = obj;
                player.x--;

                world[player.y][player.x] = player;
            }
            else {
                console.log(world[player.y][player.x-1].description);
                showDescBox(world[player.y][player.x-1].description);
            }
        }
        // Right
        if (e.keyCode == 39) {
            if (world[player.y][player.x + 1].passable == true) {
                world[player.y][player.x] = obj;
                player.x++;
                world[player.y][player.x] = player;
            }
            else {
                console.log(world[player.y][player.x+1]);
                showDescBox(world[player.y][player.x+1].description);
            }
        }
        displayWorld();
    });
});
//***********************************************************************//