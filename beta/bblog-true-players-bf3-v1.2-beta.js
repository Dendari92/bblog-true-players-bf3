/**
 * Inspired by similar plugins for Battlefield 4 (in particular this one: https://github.com/Razer2015/TruePlayerCounts_BF4),
 * this very simple plugin will show the real players count for a server in Battlefield 3.
 *
 * # # # # # #
 * Changelog #
 * # # # # # #
 * Version 1.2-beta
 * - Added filter to count only real playing players (can be toggled in the BBLog settings menu)
 * Version 1.1
 * - Code refactoring, made it a little bit simpler and little more robust;
 * - Changed the way players count is displayed in the server browser, by default it keeps the original ("fake") players count visible;
 * - Added option to show only real players count, similar to how it was in v1.0;
 * Version 1.0
 * - Initial release;
 * # # # # # #
 *
 * @author Dendari
 * @version 1.2-beta
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
    en: {
      "only.real.players": "Show only real players",
      "only.real.players.tooltip":
        "Only show the real players count in the server browser. NOTE: sorting will still be based on the fake players count!",
      "filter.real.playing.players": "Filter only real playing players",
      "filter.real.playing.players.tooltip":
        "Filter the real online and playing players count in the server browser. NOTE: players with status set to invisible will not count!",
    },
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
    { key: "only.real.players", init: 0 },
    { key: "filter.real.playing.players", init: 0 },
  ],

  /**
   * A handler that be fired immediately (only once) after the plugin is loaded into bblog
   *
   * @param object instance The instance of your plugin which is the whole plugin object
   *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
   *    For example: If you add a new function to your addon, always pass the "instance" object
   */
  init: function (instance) {
    instance.storage(
      "getPlayersOnServerUrl",
      "https://battlelog.battlefield.com/bf3/servers/getPlayersOnServer/pc/"
    );
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
    if (
      BBLog.cache("mode") === "bf3" &&
      BBLog.getCleanUrl().endsWith("/bf3/servers/")
    ) {
      var getPlayersOnServerUrl = instance.storage("getPlayersOnServerUrl");
      var onlyRealPlayers = instance.storage("only.real.players");
      var onlyRealPlayingPlayers = instance.storage(
        "filter.real.playing.players"
      );
      $(".serverguide-bodycells:not(.bblog-true-players)").each(function () {
        var row = $(this);
        var guid = $(this).attr("guid");
        $.get(getPlayersOnServerUrl + guid, function (response) {
          var players;
          /* It seems the Battlelog API used to show the real players is buggy
           * and show more players than there are, sometimes even more than the
           * maximum allowed in a server (e.g. 70+), as a workaround filter only
           * players which are "playing". Can be toggled in BBLog settings menu.
           * NOTE: players with status set to invisible won't count.
           */
          if (onlyRealPlayingPlayers === 1) {
            players = response.players.filter(
              (player) => player.persona.user.presence.isPlaying
            ).length;
          } else {
            players = response.players.length;
          }
          if (!row.hasClass("bblog-true-players")) {
            row.find(".serverguide-cell-players").html(function () {
              if (onlyRealPlayers === 1) {
                return $(this)
                  .html()
                  .replace(
                    /^.*(?=( \/ ))/m,
                    "\n <span><b>[" + players + "]</b>"
                  ); // replace everything before the slash ("/")
              } else {
                return $(this)
                  .html()
                  .replace(/ \/ /, " <b>[" + players + "]</b> / "); // replace just the slash ("/")
              }
            });
            row.addClass("bblog-true-players");
          }
        });
      });
    }
  },
});
