( function( global, factory ){

    factory(global);

} )( window, function(global){

    //creat main object
    var gridbox = function( selector, context ){

        return new gridbox.fn.init( selector, context );

    };

    //regexp [classname, id, tag]
    var rgSelector = /(?:\.([-\w]+)|#([-\w]+)|([^\.#][-\w]+))/;

    //basic prototype
    gridbox.fn = gridbox.prototype = {};

    //init constructor
    gridbox.fn.init = function( selector, context ){

        var elem,
            match = [],
            ctx = context? context : document;

        //check if any input
        if(!selector) return this;

        //check if input is striing
        if( typeof selector === 'string' ){

            match = rgSelector.exec(selector);

            //classname
            if( match && match[1] ){ 
                elem = ctx.getElementsByClassName( match[1] )[0];
                console.log(elem, 'class');
            }
            //id
            else if( match && match[2] ){
                elem = ctx.getElementById( match[2] );
                console.log(elem, 'id');
            }
            //tagname
            else if( match && match[3] ){
                elem = ctx.getElementsByTagName( match[3] )[0];
                console.log(elem, 'tag');
            }
            //no match
            else {
                return this;
            }

            this[0] = elem;
            this.length = 1;

            return this;

        } else { return this; }

    };

    //chain prototype
    gridbox.fn.init.prototype = gridbox.fn;

    //expose to global environment
    return global.g = gridbox;
} );