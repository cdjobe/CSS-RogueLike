$(document).ready(function() {
window.addEventListener("keydown", function(e) {
    // space and arrow keys
	if ( [32, 37, 38, 39, 40].indexOf(e.keyCode) > -1 ) {
        e.preventDefault();
	}
}, false);

function randomInt(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var doorList = []

class Wall {
    constructor() {
        this.type = "wall";
        this.output = "<div class='box wall'></div>";
        this.description = "just a wall";
        this.passable = false;
    }
};

class Floor {
    constructor() {
        this.type = "floor";
        this.output = "<div class='box floor'></div>";
        this.description = "just a floor";
        this.passable = true;
    }
};

class Door {
    constructor( location ) {
        this.type = "door";
        this.x = location[1]
        this.y = location[0]
        this.output = "<div class='box'><div class='door'></div></div>"
        this.description = "a door. opened or closed it's just a door"
        this.passable = true;
    } 
}

class Room {
    constructor( topLeft, bottomRight ) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
        // console.log(topLeft, bottomRight)
        
        this.createRoom = function() {
            var height = bottomRight[0] - bottomRight[0];
            var width = bottomRight[1] - bottomRight[1];
            
            for ( var i = topLeft[0]; i < bottomRight[0]; i++ ) {              
                // console.log( world[i][topLeft[1]].type )
                // left wall
                // if ( world[i][topLeft[1]].type == 'floor' || world[i][topLeft[1]].type == 'door') {
                //     world[i][topLeft[1]] = new Wall;
                // }
                // right wall
                if ( world[i][bottomRight[1]].type == 'floor' ) {
                    world[i][bottomRight[1]] = new Wall;
                }
                for ( var j = topLeft[1]; j <= bottomRight[1]; j++ ) {
                    // top wall
                    // if ( world[topLeft[0]][j].type == 'floor' )
                    //     world[topLeft[0]][j] = new Wall();
                    // bottom wall
                    if ( world[bottomRight[0]][j].type == 'floor' ) {
                    // console.log("bottomright 0  = ", bottomRight[0])
                        world[bottomRight[0]][j] = new Wall();
                    }
                }
            }
            // this.createDoors()
        }

        this.createDoors = function() {
            let doorOneIsValid = false;
            let doorTwoIsValid = false;
            var doorY = randomInt(topLeft[0]+1, bottomRight[0]-1);
            let doorX = randomInt(topLeft[1]+1, bottomRight[1]-1);
            let numberOfDoors = randomInt(1,2)
            var directions = ['right', 'down']
            var direction = directions[ randomInt(0,1)]
            console.log(direction)
            console.log(numberOfDoors)
            
            if ( direction == 'down' && bottomRight[0] < worldHeight -1 ) {
                world[bottomRight[0]][doorX] = new Door( [ doorY, bottomRight[1] ])
                doorList.push(world[doorY][bottomRight[1]])
            }

            if ( bottomRight[1] < worldWidth-1 ) {
                // console.log(`doorY = ${doorY} bottomRight[1] = ${bottomRight[1]}`)
                if ( world[doorY][bottomRight[1]+1].type == 'floor' && world[doorY][bottomRight[1]-1].type == 'floor') {
                    world[doorY][bottomRight[1]] = new Door( [ doorY, bottomRight[1] ])
                    doorList.push(world[doorY][bottomRight[1]])
                }
            }
            // Lower wall
            if ( bottomRight[0] < worldHeight-1) {
                if ( world[bottomRight[0]+1][doorX].type == 'floor' && world[bottomRight[0]-1][doorX].type == 'floor' )
                    world[bottomRight[0]][doorX] = new Door( [ bottomRight[0], doorX ])
                    doorList.push(world[bottomRight[0]][doorX])
            }
        }

        
        this.createRoom();
        // this.createDoors();
        return this;
    }
};

class Player {
    constructor() {
        this.output = "<div class='player-background'><div class='box player'></div></div>";
        this.x = 1;
        this.y = 1;
        this.type = "player";
        this.health = 100;
    }
    
};

    var worldHeight = 30;
    var worldWidth = 30;
    var world = [...Array(worldHeight)].map(e => Array(worldWidth).fill(new Floor));
    makeWorld();
    displayWorld();
    
    //***********************************************************************//
    function makeWorld() {
        for(var i = 0; i < worldWidth; i++) {
            // console.log(i)
            world[i][0] = new Wall;
            world[i][worldWidth-1] = new Wall;
        }
        for(var i = 0; i < worldHeight; i++) {
            world[0][i] = new Wall;
            world[worldHeight-1][i] = new Wall;
        }
        player = new Player;
        world[1][1] = player;
        var minWidth = Math.floor(worldWidth/6);
        // console.log(`min width = ${minWidth}`);
        var maxWidth = Math.floor(worldWidth/3);
        var minHeight = Math.floor(worldHeight/6);
        // console.log(`min height = ${minHeight}`);
        var maxHeight = Math.floor(worldHeight/3);
        // top left coordinates
        var minY = 0;
        var minX = 0;
        // bottom right coordinates
        var maxY = worldHeight - 1;
        var maxX = worldWidth -1;

        var remainingHeight = worldHeight - minY;
        var remainingWidth = worldWidth - minX;
        var roomList = [];

        makeRooms(minY, minX, maxY, maxX);
        for ( var i = 0; i < roomList.length; i++ ) {
            console.log(roomList[i])
            roomList[i].createDoors()

        }

        function makeRooms(minY, minX, maxY, maxX) {
            var roomHeight = maxY - minY;
            var roomWidth = maxX - minX;
            // console.log(`Height = ${roomHeight}, Width = ${roomWidth}`);
            
            if ( roomHeight < minHeight || roomWidth < minWidth ) {
                while (roomHeight <= minHeight) {
                    roomHeight++;
                }
                while ( roomWidth <= minWidth) {
                    roomWidth++;
                }
                // console.log("returning nothing");
                // return new Room([minY, minX], [maxY, maxX]);
                return roomList.push(new Room( [minY, minX], [maxY, maxX ]) )
            }
            
            if (    ((roomWidth <= maxWidth) && (roomWidth => minWidth))  &&
                    ((roomHeight <= maxHeight) && (roomHeight => minHeight))
                ){
                    // return new Room([minY, minX], [maxY, maxX]);
                    return roomList.push(new Room( [minY, minX], [maxY, maxX]) )
            };
        
            if ( roomHeight > roomWidth  ) {
                // console.log( "room height > room width")
                var randomHeight = randomInt( minHeight, maxHeight );
                var newRoom = makeRooms(  minY, minX, 
                            minY + randomHeight, maxX 
                );
                
                var newRoomTwo = makeRooms(  minY + randomHeight, minX, 
                            maxY, maxX
                );
            }
            else if ( roomHeight  <  roomWidth ) {
                // console.log( "room height < room width")
                var randomWidth = randomInt ( minWidth, maxWidth );
                makeRooms(  minY, minX,   // minY, minX
                            maxY, minX + randomWidth  // maxY, maxX
                );
                makeRooms(  minY, minX + randomWidth, 
                            maxY, maxX
                );
            }
            else {
                var direction = randomInt(1,2);
                // console.log(`direction = ${direction}`);
                
                if ( direction == 1 ) {

                    var randomHeight = randomInt( minHeight, maxHeight )
                    while ( minY + randomHeight < minHeight ) {
                        randomHeight++;
                    }
                    makeRooms(  minY, minX,
                                minY + randomHeight, maxX
                    );
                    makeRooms ( minY + randomHeight, minX,
                                maxY, maxX
                    );
                }
                else {
                    var randomWidth = randomInt ( minWidth, maxWidth )
                    while ( minX + randomWidth < minWidth ) {
                        randomWidth++;
                    }
                    makeRooms(  minY, minX,
                                maxY, minX + randomWidth
                    );
                    makeRooms(  minY, minX + randomWidth ,
                                maxY, maxX
                    );
                }
            }
        }
    }     

    function displayWorld() {
        var output = '';

        for(var i=0; i<worldHeight; i++) {
            output += "<div class='row'>";
            for(var j=0; j<worldWidth; j++) {
                output += world[i][j].output;
        }
            output +=  "</div>";
        }
        $('#world').html(output);
    }


    function showDescBox(desc) {
        $('#text').text(desc);
    }

    $(document).keydown(function(e) {
        // console.log(e.keyCode);
        // Down-40, Left-37, Right-39, Up-38
        // console.log(player.y, player.x);
        
        // Down
        obj = new Floor();
        $('#text').text("");
        if (e.keyCode == 40) {
            if (world[player.y+1][player.x].passable == true) {
                world[player.y][player.x] = obj;
                obj = world[player.y+1][player.x]
                player.y++;
                world[player.y][player.x] = player;
            }
            else {
                // console.log(world[player.y+1][player.x].description);
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
                // console.log(world[player.y-1][player.x].description);
                showDescBox(world[player.y-1][player.x].description);
            }
        }
        // Left
        if (e.keyCode == 37) {
            if (world[player.y][player.x - 1].passable == true) {
                console.log(obj)
                world[player.y][player.x] = obj;
                player.x--;
                obj = world[player.y][player.x];
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
                obj = world[player.y][player.x];
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
