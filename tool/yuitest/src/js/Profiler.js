YAHOO.namespace("tool");

/**
 * Profiles functions in JavaScript.
 * @namespace YAHOO.tool
 * @class Profiler
 * @static
 */
YAHOO.tool.Profiler = {

    //-------------------------------------------------------------------------
    // Private Properties
    //-------------------------------------------------------------------------

    /**
     * Call information for functions.
     * @type Object
     * @private
     * @static
     */
    _report : {},
    
    //-------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------
    
    /**
     * Called when a method ends execution. Marks the start and end time of the 
     * method so it can calculate how long the function took to execute. Also 
     * updates min/max/avg calculations for the function.
     * @param {String} name The name of the function to mark as stopped.
     * @param {Date} start The Date object representing the time that the 
     *        function started executing.
     * @param {Date} stop The Date object representing the time that the 
     *        function stopped executing.
     * @return {Void}
     * @private
     * @static
     */
    _saveData : function (name /*:String*/, start /*:Date*/, stop /*:Date*/){

        var duration = stop.valueOf() - start.valueOf();
        
        //get the function data
        var functionData /*:Object*/ = this._report[name];
    
        //increment the calls
        functionData.calls++;

        //if it's already been called at least once, do more complex calculations
        if (functionData.calls > 1) {
            functionData.avg = ((functionData.avg*(functionData.calls-1))+duration)/functionData.calls;
            functionData.min = Math.min(functionData.min, duration);
            functionData.max = Math.max(functionData.max, duration);
        } else {
            functionData.avg = duration;
            functionData.min = duration;
            functionData.max = duration;
        }                             
    
    },

    //-------------------------------------------------------------------------
    // Reporting Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Returns the average amount of time (in milliseconds) that the function
     * with the given name takes to execute.
     * @param {String} name The name of the function whose data should be returned.
     *      If an object type method, it should be 'constructor.prototype.methodName';
     *      a normal object method would just be 'object.methodName'.
     * @return {float} The average time it takes the function to execute.
     * @static
     */
    getAverage : function (name /*:String*/) /*:float*/ {
        return this._report[name].avg;
    },

    /**
     * Returns the number of times that the given function has been called.
     * @param {String} name The name of the function whose data should be returned.
     * @return {int} The number of times the function was called.
     * @static
     */
    getCallCount : function (name /*:String*/) /*:int*/ {
        return this._report[name].calls;    
    },
    
    /**
     * Returns the maximum amount of time (in milliseconds) that the function
     * with the given name takes to execute.
     * @param {String} name The name of the function whose data should be returned.
     *      If an object type method, it should be 'constructor.prototype.methodName';
     *      a normal object method would just be 'object.methodName'.
     * @return {float} The maximum time it takes the function to execute.
     */
    getMax : function (name /*:String*/) /*:int*/ {
        return this._report[name].max;
    },
    
    /**
     * Returns the minimum amount of time (in milliseconds) that the function
     * with the given name takes to execute.
     * @param {String} name The name of the function whose data should be returned.
     *      If an object type method, it should be 'constructor.prototype.methodName';
     *      a normal object method would just be 'object.methodName'.
     * @return {float} The minimum time it takes the function to execute.
     */
    getMin : function (name /*:String*/) /*:int*/ {
        return this._report[name].min;
    },

    /**
     * Returns an object containing profiling data for all of the functions 
     * that were profiled. The object has an entry for each function and 
     * returns all information (min, max, average, calls, etc.) for each
     * function.
     * @return {Object} An object containing all profile data.
     * @static
     */
    getReport : function (filter /*:Function*/) /*:Object*/ {
    
        if (YAHOO.lang.isFunction(filter)) {
            var report = {};
            
            for (var name in this._report){
                if (filter(this._report[name])){
                    report[name] = this._report[name];    
                }
            }
            
            return report;
        } else {
            return this._report;
        }
    },

    //-------------------------------------------------------------------------
    // Profiling Methods
    //-------------------------------------------------------------------------    
        
    /**
     * Sets up an object method for profiling. It essentially overwrites the method with one
     * that calls _funcStart() and _funcStop(). This method also creates an entry for the
     * function in the profile report.
     * @param {String} objectName The name of the object that owns the method to profile.
     * @param {Object} object The object that owns the method.
     * @param {String} methodName The name of the method to profile.
     * @return {Void}
     * @static
     */
    registerMethod : function (objectName /*:String*/, object /*:Object*/, methodName /*:String*/) /*:Void*/ {
        
        var funcName /*:String*/ = objectName + "." + methodName;
        var method = object[methodName];
        
        //make sure it's not already being profiled
        if (!object[methodName].__yui_profiled){
            
            //create a new slot for the original method
            object["__yui_unprofiled_" + methodName] = method;
            
            //replace the function with the profiling one
            object[methodName] = function () {

                var start = new Date();     
                var retval = method.apply(this, arguments);
                var stop = new Date();
                
                YAHOO.tool.Profiler._saveData(funcName, start, stop);
                
                return retval;                
            
            };

            //set profiled flag
            object[methodName].__yui_profiled = true;
            
            //store function information
            this._report[funcName] = {
                calls: 0,
                max: 0,
                min: 0,
                avg: 0
            };
        }
    
    },
    
    /**
     * Sets up an object for profiling. It takes the object and looks for functions.
     * When a function is found, registerMethod() is called on it. If set to recrusive
     * mode, it will also setup objects found inside of this object for profiling, 
     * using the same methodology.
     * @param {String} name The name of the object to profile (shows up in report).
     * @param {Object} object The object to profile.
     * @param {Boolean} recurse (Optional) Determines if subobject methods are also profiled.
     * @return {Void}
     * @static
     */
    registerObject : function (name /*:String*/, object /*:Object*/, recurse /*:Boolean*/) /*:Void*/{
    
        for (var prop in object) {
            if (typeof object[prop] == "function" && prop.indexOf("__yui_unprofiled_") == -1){
                this.registerMethod(name, object, prop);
            } else if (typeof object[prop] == "object" && recurse){
                this.registerObject(name + "." + prop, object[prop], recurse);
            }
        }
    
    },
    
    /**
     * Sets up an object type for profiling. This injects measurement information into
     * the constructor as well as all of the methods on its prototype.
     * @param {String} objectName The name of the object that owns the constructor to profile.
     * @param {Object} object The object that owns the constructor.
     * @param {String} constructorName The name of the constructor to profile.
     * @return {Void}
     * @static
     */
    registerObjectType : function (objectName /*:String*/, object /*:Object*/, constructorName /*:String*/) /*:Void*/ {

        //get the prototype - it will be overwritten in the next step
        var prototype /*:Object*/ = object[constructorName].prototype;
                
        //profile the constructor
        this.registerMethod(objectName, object, constructorName);
        
        //restore the prototype
        object[constructorName].prototype = prototype;
        
        //profile the methods on the prototype
        for (var prop in prototype){
            if (typeof prototype[prop] == "function"){
                this.registerMethod(objectName + "." + constructorName + ".prototype", prototype, prop);
            }
        }    
    },

    /**
     * Unregisters an object method for profiling by restoring the original method to its original name.
     * @param {String} objectName The name of the object that owns the method to unregister.
     * @param {Object} object The object that owns the method.
     * @param {String} methodName The name of the method to unregister.
     * @return {Void}
     * @static
     */
    unregisterMethod : function (objectName /*:String*/, object /*:Object*/, methodName /*:String*/) /*:Void*/ {
        
        var funcName /*:String*/ = objectName + "." + methodName;
        var method = object[methodName];
        
        //make sure it's not already being profiled
        if (object[methodName].__yui_profiled){
            
            //restore original
            object[methodName] = object["__yui_unprofiled_" + methodName];
            delete object["__yui_unprofiled_" + methodName];
            
        }
    
    },
    
    /**
     * Unregisters an object for profiling. It takes the object and looks for functions.
     * When a function is found, unregisterMethod() is called on it. If set to recrusive
     * mode, it will also unregister objects found inside of this object, 
     * using the same methodology.
     * @param {String} name The name of the object to unregister.
     * @param {Object} object The object to profile.
     * @param {Boolean} recurse (Optional) Determines if subobject methods should also be
     *      unregistered.
     * @return {Void}
     * @static
     */
    unregisterObject : function (name /*:String*/, object /*:Object*/, recurse /*:Boolean*/) /*:Void*/{
    
        for (var prop in object) {
            if (typeof object[prop] == "function"){
                this.unregisterMethod(name, object, prop);
            } else if (typeof object[prop] == "object" && recurse){
                this.unregisterObject(name + "." + prop, object[prop], recurse);
            }
        }
    
    },
    
    /**
     * Unregisters an object type for profiling. This unregisters
     * the constructor as well as all of the methods on its prototype.
     * @param {String} objectName The name of the object that owns the constructor to unregister.
     * @param {Object} object The object that owns the constructor.
     * @param {String} constructorName The name of the constructor to unregister.
     * @return {Void}
     * @static
     */
    unregisterObjectType : function (objectName /*:String*/, object /*:Object*/, constructorName /*:String*/) /*:Void*/ {

        //get the prototype - it will be overwritten in the next step
        var prototype /*:Object*/ = object[constructorName].prototype;
                
        //profile the constructor
        this.unregisterMethod(objectName, object, constructorName);
        
        //restore the prototype
        object[constructorName].prototype = prototype;
        
        //profile the methods on the prototype
        for (var prop in prototype){
            if (typeof prototype[prop] == "function"){
                this.unregisterMethod(objectName + "." + constructorName + ".prototype", prototype, prop);
            }
        }    
    }        

};