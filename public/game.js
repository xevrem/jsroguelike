var Game = {
    _display: null,
    _current_screen: null,
    _screen_width: 50,
    _screen_height: 24,
    _console: null,
    _console_display: null,
    _console_width: 50,
    _console_height: 5,

    init: function(){
        this._display = new ROT.Display({width:this._screen_width,
                                        height:this._screen_height,
                                        forceSquareRatio:true});
        this._console_display = new ROT.Display({width:this._console_width,
                                                 height:this._console_height,
                                                 forceSquareRatio:true});
        this._console = new Game.Console(this._console_display, this._console_height);
        this._console.init();

        var game = this;

        var bind_event_to_screen = function(event){
            window.addEventListener(event, function(e){
               //send any events to current screen
               if(game._current_screen !== null){
                   game._current_screen.handle_input(event, e);

               }
            });

        }

        bind_event_to_screen('keydown');
        //bind_event_to_screen('keyup');
        //bind_event_to_screen('keypress');
    },

    get_display: function(){
        return this._display;
    },

    get_console: function(){
        return this._console;
    },

    get_console_display: function(){
        return this._console_display;
    },

    draw_text: function(x,y, text,foreground,background){
        var fg = foreground || 'white';//foreground !== null ? foreground : ROT.Color.toRGB([255,255,255]);
        var bg = background || 'black';//background !== null ? background : ROT.Color.toRGB([0,0,0,]);
        this._display.drawText(x,y,'%c{'+fg+'}%b{'+bg+'}'+text);
    },

    refresh: function(){
        //clear screen
        this._display.clear();

        //render the screen
        this._current_screen.update();
        this._current_screen.render(this._display);

        this._console_display.clear();
        this._console.render();
    },

    switch_screen: function(screen){
        //exit current screen if defined
        if(this._current_screen !== null){
            this._current_screen.exit();
        }
        //clear display
        this.get_display().clear();
        //enter current screen, send notification, render it
        this._current_screen = screen;
        if(this._current_screen !== null){
            this._current_screen.enter();
            this.refresh();
        }
    },

    get_display: function(){
        return this._display;
    },

    get_width: function(){
        return this._screen_width;
    },

    get_height: function(){
        return this._screen_height;
    },

    send_message: function(recipient, text, foreground, background){
        if(recipient.has_mixin(Game.Mixins.MessageRecipient)){
            recipient.receive_message({text:text,
                                       fg:foreground,
                                       bg:background});
        }
    },

    send_message_nearby: function(map, x, y, text, foreground, background){
        //console.log(map,x,y,text,foreground,background);
        //grab close entities
        var entities = map.get_entities_within_range(x, y, 5);
        //console.log(entities);
        //send those whom can receive it, the message
        for(var i = 0; i < entities.length; i++){
            if(entities[i].has_mixin(Game.Mixins.MessageRecipient)){
                entities[i].receive_message({text: text,
                                             fg: foreground,
                                             bg: background});
            }
        }
    }
}


window.onload = function(){
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        alert("The rot.js library isn't supported by your browser.");
    } else {
        Game.init();
        // Add the container to our HTML page
        var display_canvas = Game.get_display().getContainer();
        display_canvas.id = "display";
        document.getElementById("display").appendChild(display_canvas);

        var console_canvas = Game.get_console_display().getContainer();
        console_canvas.id = "console";
        document.getElementById("console").appendChild(console_canvas);

        Game.switch_screen(Game.Screen.start_screen);
    }
}