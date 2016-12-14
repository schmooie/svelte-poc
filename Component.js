var Component = (function () { 'use strict';

function applyComputations ( state, newState, oldState ) {
	if ( ( 'time' in newState && typeof state.time === 'object' || state.time !== oldState.time ) ) {
		state.hours = newState.hours = template.computed.hours( state.time );
	}
	
	if ( ( 'time' in newState && typeof state.time === 'object' || state.time !== oldState.time ) ) {
		state.minutes = newState.minutes = template.computed.minutes( state.time );
	}
	
	if ( ( 'time' in newState && typeof state.time === 'object' || state.time !== oldState.time ) ) {
		state.seconds = newState.seconds = template.computed.seconds( state.time );
	}
}

var template = (function () {
  return {
    data() {
      return {
        time: new Date(),
        secondsElapsed: 0,
      };
    },

    computed: {
      hours: time => time.getHours(),
      minutes: time => time.getMinutes(),
      seconds: time => time.getSeconds()
    },

    onrender() {
      this.startTimer();
    },

    methods: {
      tick() {
        this.set({ secondsElapsed: this.get('secondsElapsed') + 1 });
      },

      toggleTimer() {
        var interval = this.get('interval');

        if (interval) {
          clearInterval(interval);
          this.set({ interval: null });
        } else {
          this.startTimer();
        }
      },

      startTimer() {
        var interval = setInterval(this.tick.bind(this), 1000);

        this.set({ interval });
      }
    }
  }
}());

let addedCss = false;
function addCss () {
	var style = document.createElement( 'style' );
	style.textContent = "                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            \n  .time[svelte-3086400527], [svelte-3086400527] .time {\n    font-weight: bold;\n  }\n  aside[svelte-3086400527], [svelte-3086400527] aside {\n    padding: 20px;\n  }\n  button[svelte-3086400527], [svelte-3086400527] button {\n    background-color: #dd0707;\n    border-radius: 5px;\n    color: white;\n  }\n";
	document.head.appendChild( style );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var aside = document.createElement( 'aside' );
	aside.setAttribute( 'svelte-3086400527', '' );
	
	var text = document.createTextNode( root.secondsElapsed );
	aside.appendChild( text );
	aside.appendChild( document.createTextNode( " seconds since " ) );
	
	var span = document.createElement( 'span' );
	span.className = "time";
	
	aside.appendChild( span );
	var text2 = document.createTextNode( root.hours );
	span.appendChild( text2 );
	span.appendChild( document.createTextNode( ":" ) );
	var text4 = document.createTextNode( root.minutes );
	span.appendChild( text4 );
	aside.appendChild( document.createTextNode( "\n  " ) );
	
	var button = document.createElement( 'button' );
	
	function clickHandler ( event ) {
		component.toggleTimer();
	}
	
	button.addEventListener( 'click', clickHandler, false );
	
	aside.appendChild( button );
	var ifBlock_anchor = document.createComment( "#if interval" );
	button.appendChild( ifBlock_anchor );
	
	function getBlock ( root ) {
		if ( root.interval ) return renderIfBlock_0;
		return renderIfBlock_1;
	}
	
	var currentBlock = getBlock( root );
	var ifBlock = currentBlock && currentBlock( root, component );
	
	if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );

	return {
		mount: function ( target, anchor ) {
			target.insertBefore( aside, anchor );
		},

		update: function ( changed, root ) {
			text.data = root.secondsElapsed;
			
			text2.data = root.hours;
			
			text4.data = root.minutes;
			
			var _currentBlock = currentBlock;
			currentBlock = getBlock( root );
			if ( _currentBlock === currentBlock && ifBlock) {
				ifBlock.update( changed, root );
			} else {
				if ( ifBlock ) ifBlock.teardown( true );
				ifBlock = currentBlock && currentBlock( root, component );
				if ( ifBlock ) ifBlock.mount( ifBlock_anchor.parentNode, ifBlock_anchor );
			}
		},

		teardown: function ( detach ) {
			button.removeEventListener( 'click', clickHandler, false );
			if ( ifBlock ) ifBlock.teardown( false );
			
			if ( detach ) {
				aside.parentNode.removeChild( aside );
			}
		}
	};
}

function renderIfBlock_1 ( root, component ) {
	var text = document.createTextNode( "Play" );

	return {
		mount: function ( target, anchor ) {
			target.insertBefore( text, anchor );
		},

		update: function ( changed, root ) {
			
		},

		teardown: function ( detach ) {
			if ( detach ) {
				text.parentNode.removeChild( text );
			}
		}
	};
}

function renderIfBlock_0 ( root, component ) {
	var text = document.createTextNode( "Pause" );

	return {
		mount: function ( target, anchor ) {
			target.insertBefore( text, anchor );
		},

		update: function ( changed, root ) {
			
		},

		teardown: function ( detach ) {
			if ( detach ) {
				text.parentNode.removeChild( text );
			}
		}
	};
}

function Component ( options ) {
	options = options || {};

	var component = this;
	var state = Object.assign( template.data(), options.data );
applyComputations( state, state, {} );

	var observers = {
		immediate: Object.create( null ),
		deferred: Object.create( null )
	};

	var callbacks = Object.create( null );

	function dispatchObservers ( group, newState, oldState ) {
		for ( var key in group ) {
			if ( !( key in newState ) ) continue;

			var newValue = newState[ key ];
			var oldValue = oldState[ key ];

			if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

			var callbacks = group[ key ];
			if ( !callbacks ) continue;

			for ( var i = 0; i < callbacks.length; i += 1 ) {
				var callback = callbacks[i];
				if ( callback.__calling ) continue;

				callback.__calling = true;
				callback.call( component, newValue, oldValue );
				callback.__calling = false;
			}
		}
	}

	this.fire = function fire ( eventName, data ) {
		var handlers = eventName in callbacks && callbacks[ eventName ].slice();
		if ( !handlers ) return;

		for ( var i = 0; i < handlers.length; i += 1 ) {
			handlers[i].call( this, data );
		}
	};

	this.get = function get ( key ) {
		return key ? state[ key ] : state;
	};

	this.set = function set ( newState ) {
		var oldState = state;
		state = Object.assign( {}, oldState, newState );
		applyComputations( state, newState, oldState )
		
		dispatchObservers( observers.immediate, newState, oldState );
		if ( mainFragment ) mainFragment.update( newState, state );
		dispatchObservers( observers.deferred, newState, oldState );
	};

	this._mount = function mount ( target, anchor ) {
		mainFragment.mount( target, anchor );
	}

	this.observe = function ( key, callback, options ) {
		var group = ( options && options.defer ) ? observers.deferred : observers.immediate;

		( group[ key ] || ( group[ key ] = [] ) ).push( callback );

		if ( !options || options.init !== false ) {
			callback.__calling = true;
			callback.call( component, state[ key ] );
			callback.__calling = false;
		}

		return {
			cancel: function () {
				var index = group[ key ].indexOf( callback );
				if ( ~index ) group[ key ].splice( index, 1 );
			}
		};
	};

	this.on = function on ( eventName, handler ) {
		var handlers = callbacks[ eventName ] || ( callbacks[ eventName ] = [] );
		handlers.push( handler );

		return {
			cancel: function () {
				var index = handlers.indexOf( handler );
				if ( ~index ) handlers.splice( index, 1 );
			}
		};
	};

	this.teardown = function teardown ( detach ) {
		this.fire( 'teardown' );

		mainFragment.teardown( detach !== false );
		mainFragment = null;

		state = {};
	};

	this.root = options.root;
	this.yield = options.yield;

	if ( !addedCss ) addCss();
	
	var mainFragment = renderMainFragment( state, this );
	if ( options.target ) this._mount( options.target );
	
	if ( options.root ) {
		options.root.__renderHooks.push({ fn: template.onrender, context: this });
	} else {
		template.onrender.call( this );
	}
}

Component.prototype = template.methods;

return Component;

}());