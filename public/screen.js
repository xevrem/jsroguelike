/* global Game */
/* global ROT */
Game.Screen = {}

Game.Screen.start_screen = {
    enter: function(){ console.log('entered start screen...'); },
    
    exit: function(){ console.log('exited start screen...'); },
    
    update: function(){},

    render: function(display){
        //display.drawText(1,1,'%c{yellow}Hammerogue');
        var ham = 'Hammerogue';
        var ham_len = ham.length;
        var action = 'press [enter] to begin';
        var act_len = action.length;
        Game.draw_text(Game.get_width()/2 - ham_len/2, 10, ham,'rgb(255,255,255)', 'rgb(200,50,50)');
        Game.draw_text(Game.get_width()/2 - act_len/2, 15, action );
    },

    handle_input: function(input_type, input_data){
        //change to play screen when enter is pressed
        if(input_type === 'keydown'){
            if(input_data.keyCode === ROT.VK_RETURN){
                Game.switch_screen(Game.Screen.play_screen);
            }
        }
    }
}

Game.Screen.play_screen = {
    _map: null,
    _player: null,
    _center_x: 0,
    _center_y: 0,

    enter: function(){ console.log('entered play screen...'); 
        //create the blank map
        var map = [];
        var map_width = 100;
        var map_height = 100;
        for(var x = 0; x < map_width; x++){
            map.push([]);
            for (var y = 0; y < map_height; y++){
                map[x].push(Game.Tile.null_tile);
            }
        }
        
        //now to build it
        var generator = new ROT.Map.Cellular(map_width,map_height);
        generator.randomize(0.5);
        //set total iterations
        var total_iter = 3;
        for(var i = 0; i < total_iter; i++){
            generator.create();//smooth iteratively
        }
        
        //smooth then populate map
        generator.create(function(x,y,v){
            if(v === 1){
                map[x][y] = Game.Tile.floor_tile;    
            }else{
                map[x][y] = Game.Tile.wall_tile;
            }
        });
        
        //create player and position
        this._player = new Game.Entity(Game.PlayerTemplate);
        this._map = new Game.Map(map, this._player);

        //star the engine
        this._map.get_engine().start();
    },

    exit: function(){
        console.log('exited play screen...');
        Game.get_console().clear();
    },

    update: function(){
        //process player messages
        var messages = this._player.get_messages();
        for(var i = 0; i < messages.length; i++){
            new Game.Message(messages[i].text, messages[i].fg, messages[i].bg);
        }
    },

    render: function(display){
        //get screen width and height
        var sw = Game.get_width();
        var sh = Game.get_height();
        
         // Make sure the x-axis doesn't go to the left of the left bound
        var ulx = Math.max(0, this._player.get_x() - (sw/2));
        // Make sure we still have enough space to fit an entire game screen
        ulx = Math.min(ulx, this._map.get_width() - sw);
        // Make sure the y-axis doesn't above the top bound
        var uly = Math.max(0, this._player.get_y() - (sh / 2));
        // Make sure we still have enough space to fit an entire game screen
        uly = Math.min(uly, this._map.get_height() - sh)
        
        //draw the map
        for(var x = ulx; x < ulx+sw;x++){
            for(var y = uly; y < uly+sh; y++){
                var tile = this._map.get_tile(x,y);
                display.draw(x-ulx,
                            y-uly,
                            tile.get_ch(),
                            tile.get_fg(),
                            tile.get_bg());
            }
        }
        
        //draw all entities
        var entities = this._map.get_entities();
        for(var i = 0; i < entities.length; i++){
            var entity = entities[i];
            //only render if it is actually in the current view
            if(entity.get_x() >= ulx && entity.get_y()  >= uly &&
               entity.get_x() < ulx + sw &&
               entity.get_y() < uly + sh){
                display.draw(
                    entity.get_x() - ulx,
                    entity.get_y() - uly,
                    entity.get_ch(),
                    entity.get_fg(),
                    entity.get_bg());
            }
        }
    },

    handle_input: function (input_type,input_data){
        if (input_type === 'keydown'){
            if(input_data.keyCode === ROT.VK_RETURN){
                Game.switch_screen(Game.Screen.play_screen);
            }
            
            if(input_data.keyCode === ROT.VK_ESCAPE){
                Game.switch_screen(Game.Screen.start_screen);
            }
            
            //handle movement
            if(input_data.keyCode === ROT.VK_LEFT){
                //console.log('left');
                this.move(-1,0);
            }else if(input_data.keyCode === ROT.VK_RIGHT){
                //console.log('right');
                this.move(1,0);
            }else if(input_data.keyCode === ROT.VK_UP){
                //console.log('up');
                this.move(0,-1);
            }else if(input_data.keyCode === ROT.VK_DOWN){
                //console.log('down');
                this.move(0,1);
            }

            this._map.get_engine().unlock();
        }
    },
    
    move: function(dx,dy){
        var x = this._player.get_x() + dx;
        var y = this._player.get_y() + dy;
        //console.log(x,y);
        this._player.try_move(x,y, this._map);
    }
}

Game.Screen.win_screen = {
    enter: function(){ console.log('entered win screen...'); },
    
    exit: function(){ console.log('exited win screen...'); },
    
    update: function(){},

    render: function(display){
        for(var i = 0; i < 22; i++){
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            var back = ROT.Color.toRGB([r,g,b]);
            var clr = ROT.Color.toRGB([b,g,r]);
            Game.drawText(2,i+1,'You Win!!!',clr,back);
        }
    },
    
    handle_input: function (input_type,input_data){
        if (input_type === 'keydown'){
            if(input_data.keyCode === ROT.VK_RETURN){
                Game.switch_screen(Game.Screen.start_screen);
            }
        }
    }
}

Game.Screen.loose_screen = {
    enter: function(){ console.log('entered loose screen...'); },
    
    exit: function(){ console.log('exited loose screen...'); },
    
    update: function(){},

    render: function(display){
        // Render our prompt to the screen
        for (var i = 0; i < 22; i++) {
            display.draw_text(2, i + 1, "%b{red}You lose! :(");
        }
    },
    
    handle_input: function (input_type,input_data){
        if (input_type === 'keydown'){
            if(input_data.keyCode === ROT.VK_RETURN){
                Game.switch_screen(Game.Screen.start_screen);
            }
        }
    }
}
