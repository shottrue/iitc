// PLUGIN HOOKS ////////////////////////////////////////////////////////
// Plugins may listen to any number of events by specifying the name of
// the event to listen to and handing a function that should be exe-
// cuted when an event occurs. Callbacks will receive additional data
// the event created as their first parameter. The value is always a
// hash that contains more details.
//
// For example, this line will listen for portals to be added and print
// the data generated by the event to the console:
// window.addHook('portalAdded', function(data) { console.log(data) });
//
// Boot hook: booting is handled differently because IITC may not yet
//            be available. Have a look at the plugins in plugins/. All
//            code before “// PLUGIN START” and after “// PLUGIN END” is
//            required to successfully boot the plugin.
//
// Here’s more specific information about each event:
// portalAdded: called when a portal has been received and is about to
//              be added to its layer group. Note that this does NOT
//              mean it is already visible or will be, shortly after.
//              If a portal is added to a hidden layer it may never be
//              shown at all. Injection point is in
//              code/map_data.js#renderPortal near the end. Will hand
//              the Leaflet CircleMarker for the portal in "portal" var.
// portalDetailsUpdated: fired after the details in the sidebar have
//              been (re-)rendered Provides data about the portal that
//              has been selected.
// publicChatDataAvailable: this hook runs after data for any of the
//              public chats has been received and processed, but not
//              yet been displayed. The data hash contains both the un-
//              processed raw ajax response as well as the processed
//              chat data that is going to be used for display.
// factionChatDataAvailable: this hook runs after data for the faction
//              chat has been received and processed, but not yet been
//              displayed. The data hash contains both the unprocessed
//              raw ajax response as well as the processed chat data
//              that is going to be used for display.
// portalDataLoaded: callback is passed the argument of
//              {portals : [portal, portal, ...]} where "portal" is the
//              data element and not the leaflet object. "portal" is an
//              array [GUID, time, details]. Plugin can manipulate the
//              array to change order or add additional values to the
//              details of a portal.
// beforePortalReRender: the callback argument is
//              {portal: ent[2], oldPortal : d, reRender : false}.
//              The callback needs to update the value of reRender to
//              true if the plugin has a reason to have the portal
//              redrawn. It is called early on in the
//              code/map_data.js#renderPortal as long as there was an
//              old portal for the guid.
// checkRenderLimit: callback is passed the argument of
//              {reached : false} to indicate that the renderlimit is reached
//              set reached to true.
// requestFinished: called after each request finished. Argument is
//              {success: boolean} indicated the request success or fail.



window._hooks = {}
window.VALID_HOOKS = ['portalAdded', 'portalDetailsUpdated',
  'publicChatDataAvailable', 'factionChatDataAvailable', 'portalDataLoaded',
  'beforePortalReRender', 'checkRenderLimit', 'requestFinished'];

window.runHooks = function(event, data) {
  if(VALID_HOOKS.indexOf(event) === -1) throw('Unknown event type: ' + event);

  if(!_hooks[event]) return;
  $.each(_hooks[event], function(ind, callback) {
    callback(data);
  });
}


window.addHook = function(event, callback) {
  if(VALID_HOOKS.indexOf(event) === -1) throw('Unknown event type: ' + event);
  if(typeof callback !== 'function') throw('Callback must be a function.');

  if(!_hooks[event])
    _hooks[event] = [callback];
  else
    _hooks[event].push(callback);
}