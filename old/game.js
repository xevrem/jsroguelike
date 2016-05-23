//var ROT = require('rot');

var Game = {
    display: null,
    map: {},

    init: function(){
        // Create a display 80 characters wide and 20 characters tall
        this.display = new ROT.Display({width:80, height:24});
        this.container = this.display.getContainer();
        // Add the container to our HTML page
        document.body.appendChild(this.container);

        this._generate_map();

        //SHOW(this.display.getContainer());
    },

    _generate_map: function(){
        var digger = new ROT.Map.Digger();
        var free_cells = [];

        var dig_callback = function(x,y,value){
            if(value){return;} //dont store walls
            var key = x +','+y;
            free_cells.push(key);
            this.map[key] = '.'
        };

        digger.create(dig_callback.bind(this));

        this._generate_boxes(free_cells);

        this._draw_whole_map();
    },

    _draw_whole_map: function(){
        for(var key in this.map){
            var parts = key.split(',');
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            this.display.draw(x,y,this.map[key]);
        };
    },

    _generate_boxes: function(free_cells){
        for (var i = 10 - 1; i >= 0; i--) {
            var index = Math.floor(ROT.RNG.getUniform() * free_cells.length);
            var key = free_cells.splice(index, 1)[0];
            this.map[key] = 'b';
        };
    }
}