/**
* Inspired by similar plugins for Battlefield 4 (this one: https://github.com/Razer2015/TruePlayerCounts_BF4),
* this very simple plugin will show the real players count for a server in Battlefield 3.
* 
* @author Dendari
* @version 1.0
* @url https://github.com/Dendari92
*/

// initialize your plugin
BBLog.handle("add.plugin", {

    /**
    * The unique, lowercase id of my plugin
    * Allowed chars: 0-9, a-z, -
    */
    id: "true-players-bf3",

    /**
    * The name of my plugin, used to show config values in bblog options
    * Could also be translated with the translation key "plugin.name" (optional)
    *
    * @type String
    */
    name: "True Players Battlefield 3",

    /**
    * Some translations for this plugins
    * For every config flag must exist a corresponding EN translation
    *   otherwise the plugin will no be loaded
    *
    * @type Object
    */
    translations: {
        "en": {
            "toggle.plugin": "Enable True Players",
            "toggle.plugin.tooltip": "Enable/Disable True Players Battlefield 3"
        }
    },

    /**
    * Configuration Options that appears in the BBLog Menu
    * Every option must be an object with properties as shown bellow
    * Properties available:
    *   key : The name for your config flag - The user can toggle this option
    *         and you can retreive the users choice with instance instance.storage(YOUR_KEY_NAME) (0 or 1 will be returned)
    *   init : Can be 0 or 1 - Represent the initial status of the option when the user load the plugin for the first time
    *          If you want that this option is enabled on first load (opt-out) than set it to 1, otherwise to 0 (opt-in)
    *   handler(optional): When set as a function this config entry turns into a button (like the plugins button you see in the bblog menu)
    *                       The function well be executed when the user clicks the button
    */
    configFlags: [
        { "key": "toggle.plugin", "init": 1 }
    ],

    /**
    * This is the API which will return the real players on a server by appending the server GUID.
    * Example: https://battlelog.battlefield.com/bf3/servers/getPlayersOnServer/pc/aaab2d41-9227-4c62-838e-95e83cea3915
    */
    getPlayersOnServerUrl: "https://battlelog.battlefield.com/bf3/servers/getPlayersOnServer/pc/",

    /**
    * Object storing servers GUID and the real players count.
    */
    truePlayersCount: {},

    /**
    * A handler that be fired immediately (only once) after the plugin is loaded into bblog
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    init: function (instance) {
        // --- TRUE PLAYERS BF3 START ---
        if (instance.storage("toggle.plugin") === 1) {
            instance.getTruePlayers(instance);
        }
        // --- TRUE PLAYERS BF3 END ---
    },

    /**
    * A trigger that fires everytime when the dom is changing but at max only once each 200ms (5x per second) to prevent too much calls in a short time
    * Example Case: If 10 DOM changes happen in a period of 100ms than this function will only been called 200ms after the last of this 10 DOM changes
    * This make sure that all actions in battlelog been finished before this function been called
    * This is how BBLog track Battlelog for any change, like url, content or anything
    *
    * @param object instance The instance of your plugin which is the whole plugin object
    *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
    *    For example: If you add a new function to your addon, always pass the "instance" object
    */
    domchange: function (instance) {
        // --- TRUE PLAYERS BF3 START ---
        if (instance.storage("toggle.plugin") === 1) {
            instance.getTruePlayers(instance);

            if (!jQuery.isEmptyObject(instance.truePlayersCount)) {
                for (let [key, value] of Object.entries(instance.truePlayersCount)) {
                    instance.showResult(instance, key, value);
                }
            }
        }
        // --- TRUE PLAYERS BF3 END ---
    },

    /**
     * Return all the servers GUID found in the server browser.
     * @param instance The instance of your plugin which is the whole plugin object
     * @returns Servers GUID
     */
    getServersGuid: function (instance) {
        // get all server rows GUID with specific class
        return $(".serverguide-bodycells").map(function () {
            // console.log("- GUID: ", this.getAttribute("guid"))
            return this.getAttribute("guid");
        }).get();
    },

    /**
     * Call Battlelog API to retrieve real players and save it to an object.
     * @param instance The instance of your plugin which is the whole plugin object
     */
    getTruePlayers: function (instance) {
        let allServersGuid = instance.getServersGuid(instance);

        // call API to get the real players on a server
        allServersGuid.forEach(guid => {
            if ($(".serverguide-bodycells[guid='" + guid + "'").hasClass("bblog-true-players")) {
                // console.log("not getting player counts for: ", guid);
            } else {
                $.ajax({
                    async: true,
                    url: instance.getPlayersOnServerUrl + guid,
                    error: function () {
                        // console.log("Fetching: " + url + " timed out.");
                    },
                    success: function (result) {
                        // console.log("response: ", result);
                        // console.log("guid: '" + guid + "', players: '" + result.players.length + "'");
                        instance.truePlayersCount[guid] = result.players.length;
                    },
                    timeout: 5000
                });
            }
        });
    },

    /**
     * Show real players count in the server browser.
     * @param instance The instance of your plugin which is the whole plugin object
     * @param guid The server GUID
     * @param playersCount The real players count
     */
    showResult: function (instance, guid, playersCount) {
        $(".serverguide-bodycells[guid='" + guid + "'").find(".serverguide-cell-players").html(function () {
            return $(this).html().replace(/^.*(?=( \/))/m, "\n <span>*" + playersCount + "*");
        });
        $(".serverguide-bodycells[guid='" + guid + "'").addClass("bblog-true-players");
        delete instance.truePlayersCount[guid];
    }

});
