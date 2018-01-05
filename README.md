## dfi-base - abstract classes written in ES6 with typescript: 

### base utils
* **dfiObject**      - private properties implementation with WeakMap  
* **dfiEventObject** - dfiObject extended with event emitter (correctly handling symbols as events)
* **dfiUtils**       - utils collection
  * maybeCallbackOnce
  * maybeCallback
  * obj2map
  * cloneLiteral
  * formatError
  
### model + collection
backbone inspired event emitting model and collection with private properties(dfiObject)   
* **dfiModel**  - model representation
  * get id - return set or autogenerated id
  * get lastUpdate - return last obj modification.
  * public destroy() - remove attributes and properties emit 
  * public toJSON() - return plain object with attributes only
  * public toPlain()- return plain object with attributes and properties
  * protected get() - get attribute 
  * protected set() - set attribute: if not set emmit DfiModel.events.ADD, always emit DfiModel.events.UPDATE
  * protected has() - check attribute is set
  * protected remove() - remove attribute: emmit DfiModel.events.REMOVE and DfiModel.events.UPDATE
  * protected stampLastUpdate - mark object wit current timestamp
  
* dfiCollection  - collection of dfiModels -implement Map object.


object event emitter with private properties
model with attributes
collection
