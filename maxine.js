/**
 * Created by Maxine on 2017/3/15.
 */
(function ( global ) {
    var document = global.document,
        arr = [],
        push = arr.push,
        slice = arr.slice;
    //工厂模式
    function createInit (selector ) {
        return new createInit.fn.init( selector );
    }

    createInit.fn = createInit.prototype = {
        constructor: createInit,
        length: 0,
        splice: arr.splice,
        toArray: function ( ) {
            return slice.call( this );
        },
        get: function ( index ) {
            if( index == null ) {
                return this.toArray();
            }
            return this[ index < 0 ? this.length + index : index ];
        },
        eq: function ( index ) {
            return createInit( this[ index < 0 ? this.length + index : index ] );
        },
        first: function () {
            return this.eq( 0 );
        },
        last: function () {
            return this.eq( -1 );
        },
        each: function ( callback ) {
            createInit.each( this, callback );
            return this;
        }
        

    };

    var init = createInit.fn.init = function ( selector ) {
        // push.apply(this, document.querySelectorAll( selector ));
        if ( !!selector ) {
            return this;
        }
        else if ( createInit.isString( selector ) ) {
            if ( createInit.isHTML( selector ) ) {
                push.apply( this, createInit.parseHTML( selector ) );
            }
            else {
                push.apply( this, document.querySelectorAll( selector ) );
            }
        }
        else if ( createInit.isDOM( selector ) ) {
            this[ 0 ] = selector;
            this.length = 1;
        }
        else if ( createInit.isArrayLike( selector ) ) {
            push.apply( this, selector );
        }
        else if (createInit.isFunction( selector ) ) {
            document.addEventListener( 'DOMContentLoaded', function () {
                selector();
            })
        }
    };
    init.prototype = createInit.fn;

    createInit.extend = createInit.fn = function () {
       var i = 0,
           l = arguments.length,
           obj;

       for( ; i < l; i++ ) {
           obj = arguments[ i ];
           for( var k in obj ) {
               if( obj.hasOwnProperty( k ) ) {
                   this[ k ] = obj[ k ];
               }
           }
       }
       return this;
    };

    createInit.extend( {
        type: function ( obj ) {
            if ( obj == null ) {
                return typeof obj + '';
            }
            return typeof obj !== 'object' ? typeof obj :
                Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
        },
        parseHTML: function ( obj ) {
            var div = document.createElement( 'div' ),
                node,
                result = [];

            div.innerHTML = obj;

            for( node = div.firstChild; node; node = node.nextSibling ) {
                if( node.nodeType === 1 ) {
                    result.push( node );
                }
            }
            return result;
        },
        unique: function ( arr ) {
            var ret = [];
            createInit.each( arr, function () {
                if( ret.indexOf( this ) === -1 ) {
                    ret.push( this );
                }
            } );
           return this;
        }
    } );
    createInit.extend({
        isString: function ( obj ) {

            return typeof obj === 'string';

        },
        isHTML:function ( obj ) {

            obj = obj + '';
            return obj[ 0 ] === '<' && obj[ obj.length - 1 ] === '>' && obj.length >=3;
        },
        isDOM: function ( obj ) {
            return !!obj && !!obj.nodeType;
        },
        isArrayLike: function ( obj ) {
            var type = createInit.type,
                length = !!obj && 'length' in obj && obj.length;

            if( type === 'function' || createInit.isWindow( obj ) ) {
                return false;
            }
            return type === 'array' || length === 0 ||
                   typeof length === 'number' && length > 0 && ( length -1 ) in obj;
        },

        isFunction: function ( obj ) {
            return typeof obj === 'function';

        },

        isWindow: function () {
            return !!obj && obj.window === obj;

        }
    });

    createInit.fn.extend( {
        appendTo: function ( target ) {
            var that = this,
                ret = [],
                node;
            target = createInit( target );
            target.each( function ( i, elem ) {
                that.each( function () {
                    node = i === 0 ? this : this.cloneNode( true );
                    ret.push( node );
                    elem.appendChild( node );
                } );
            } );
            return createInit( ret );
        },
        append: function ( source ) {
            source = createInit( source );
            source.appendTo( this );
            return this;
        },
        prependTo: function ( target ) {
            var that = this,
                ret= [],
                node,
                firstChild;
            target = createInit( target );
            target.each( function ( i, elem ) {
                firstChild = elem.firstChild;
                that.each( function ( ) {
                    node = i === 0 ? this: this.cloneNode( true );
                    ret.push( node );
                    elem.insertBefore( node, firstChild );
                } );
            } );
            return createInit( ret );
        },
        prepend: function ( source ) {
            source = createInit( source );
            source.prependTo( this );
            return this;
        },
        next: function () {
            var ret = [];
            this.each( function ( i, elem ) {

                var node = elem.nextSibling;

                while ( node ) {
                    if( node.nodeType === 1 ) {
                        ret.push( node );
                        break;
                    }
                    node = node.nextSibling;
                }
            } );
            return createInit( ret );
        },
        nextAll: function () {
            var ret = [];
            this.each( function ( i, elem ) {
                var node = elem.nextSibling;

                while ( node ) {
                    if ( node.nodeType === 1 ) {
                        ret.push( node );
                    }
                    node = node.nextSibling;
                }
            } );
            return createInit( createInit.unique( ret ) );
        },
        prev: function () {
            
        },
        prevAll: function () {
            
        },
        remove: function () {
            return this.each( function (  ) {
                this.parentNode.removeChild( this );
            } );
        },
        empty: function () {
            return this.each( function (  ) {
                this.innerHTML = '';
            } );
        },
        before: function () {
            
        },
        after: function () {
            
        }
        
    } );


    if( typeof define === 'function' ) {
        define( function () {
            return createInit;
        } );
    }
    else if ( typeof exports !== 'undefined' ) {
        module.exports = createInit;
    }
    else {
        return global.$ = createInit;
    }


} (window));