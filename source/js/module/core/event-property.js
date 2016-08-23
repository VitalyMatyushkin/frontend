/**
 * Created by Anatoly on 20.08.2016.
 */

/**
 * EventProperty creates an event object.
 * */
const EventProperty = function(){
	this._callBacks = [];
};

/**
 * subscribe for the event(add event listener).
 *
 * @param {function} fn - event listener
 * */
EventProperty.prototype.on = function(fn){
	fn && this._callBacks.push(fn);
	return this;
};
/**
 * Unsubscribe from the event.
 *
 * @param {function} fn - event listener
 * Pass nothing to remove all listeners on event.
 * */
EventProperty.prototype.off = function(fn){
	if(fn){
		const i = this._callBacks.indexOf(fn);
		if(i >= 0){
			this._callBacks.splice(i, 1);
		}
	}else{
		delete this._callBacks;
		this._callBacks = [];
	}

	return this;
};
/**
 * Execute all handlers of event
 *
 * @param data - argument of event
 * */
EventProperty.prototype.trigger = function(data){
	this._callBacks.forEach(fn => fn(data));

	return this;
};

module.exports = EventProperty;