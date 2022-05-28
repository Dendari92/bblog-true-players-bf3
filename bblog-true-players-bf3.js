/**
 * Inspired by similar plugins for Battlefield 4 (in particular this one: https://github.com/Razer2015/TruePlayerCounts_BF4),
 * this very simple plugin will show the real players count for a server in Battlefield 3.
 *
 * # # # # # #
 * Changelog #
 * # # # # # #
 * Version 1.2
 * - Enabled plugin to work on favorites and history pages
 * - Added filter to count only real playing players (can be toggled in the BBLog settings menu)
 * - Added filter to not count specified players names (can be toggled and customized in the BBLog settings menu)
 * - Added some comments in the code for better readability (the plugin is getting a little bit bigger...)
 * Version 1.1
 * - Code refactoring, made it a little bit simpler and little more robust;
 * - Changed the way players count is displayed in the server browser, by default it keeps the original ("fake") players count visible;
 * - Added option to show only real players count, similar to how it was in v1.0;
 * Version 1.0
 * - Initial release;
 * # # # # # #
 *
 * @author Dendari
 * @version 1.2
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
      "filter.players.names": "Filter players names",
      "filter.players.names.tooltip":
        "Insert the players names to ignore when counting players in a server. Seperate multiple names using a comma (','). Case sensitive.",
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
    {
      key: "filter.players.names",
      init: 0,
      handler: function (instance) {
        instance.getPlayersNamesToFilter(instance);
      },
    },
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
      BBLog.getCleanUrl().match(/.*\/bf3\/servers.*/)
    ) {
      /*
       * --- RETRIEVE SETTINGS FROM BBLOG STORAGE ---
       */
      // Battlelog API URL to retrieve players on a server
      var getPlayersOnServerUrl = instance.storage("getPlayersOnServerUrl");
      // Toggle in BBLog settings to show only the "real" players count without keeping the "fake" one
      var onlyRealPlayers = instance.storage("only.real.players");
      // Toggle in BBLog settings to filter "real" players who Battlelog see as playing
      var filterRealPlayingPlayers = instance.storage(
        "filter.real.playing.players"
      );
      // Toggle in BBLog settings to filter "real" players by names (e.g. servers using actual in-game bots)
      var filterPlayersNames = instance.storage("filter.players.names");
      // The string containing all players names to filter out, multiple names should be separated by a comma
      var filteredPlayersNames = instance.storage("filteredPlayersNames");

      /*
       * This is the main function, it checks for all the rows in the servers
       * browser and takes their GUID, unless it's been already done.
       * The GUID is then used to call the Battlelog API for retrieving
       * the actual players count.
       * This already filter out all the "Unknown" players from the server
       * so it should be enough for most case, but in case it isn't
       * there are some extra filters provided in the plugin settings.
       */
      $(".serverguide-bodycells:not(.bblog-true-players)").each(function () {
        var row = $(this);
        var guid = $(this).attr("guid");
        $.get(getPlayersOnServerUrl + guid, function (response) {
          var players;
          var playersCount;

          /*
           * Some servers use actual in-game bots players to fill their servers.
           * These are still counted by the Battlelog API, with this option
           * users can filter unwanted bots.
           */
          if (filterPlayersNames === 1 && filteredPlayersNames) {
            var filteredPlayersNamesRegex = new RegExp(
              filteredPlayersNames.join("|")
            );
            players = response.players.filter(
              (player) =>
                !player.persona.personaName.match(filteredPlayersNamesRegex) ||
                !player.persona.user.username.match(filteredPlayersNamesRegex)
            );
          } else {
            players = response.players;
          }

          /*
           * It seems the Battlelog API used to show the real players is buggy
           * and show more players than there are, sometimes even more than the
           * maximum allowed in a server (e.g. 70+), as a workaround filter only
           * players which are "playing". Can be toggled in BBLog settings menu.
           * NOTE: players with status set to invisible won't count.
           */
          if (filterRealPlayingPlayers === 1) {
            playersCount = players.filter(
              (player) => player.persona.user.presence.isPlaying
            ).length;
          } else {
            playersCount = players.length;
          }

          // Either replace or add the "real" players count in the server's players cell
          if (!row.hasClass("bblog-true-players")) {
            row.find(".serverguide-cell-players").html(function () {
              if (onlyRealPlayers === 1) {
                // replace everything before the slash ("/"). Expected result: *realPlayers* / *maxPlayers*
                return $(this)
                  .html()
                  .replace(
                    /^.*(?=( \/ ))/m,
                    "\n <span><b>[" + playersCount + "]</b>"
                  );
              } else {
                // replace just the slash ("/"). Expected result: *fakePlayers* [*realPlayers*] / *maxPlayers*
                return $(this)
                  .html()
                  .replace(/ \/ /, " <b>[" + playersCount + "]</b> / ");
              }
            });

            // Add this CSS class to mark row as done
            row.addClass("bblog-true-players");
          }
        });
      });
    }
  },

  /**
   * This function allows the users to input the players names they want to filter out from the main function.
   * The input should be a string, in case of multiple names they should be separated by a comma.
   * It is the converted to an array which is saved into BBLog storage.
   * To retrieve the array use '**instance.storage("filteredPlayersNames")**'.
   * Users can clean the saved players names by inserting an empty input.
   * Notice the "instance" parameter, you should always pass the instance to any own function
   *
   * @param object instance The instance of your plugin which is the whole plugin object
   *    Always use "instance" to access any plugin related function, not use "this" because it's not working properly
   *    For example: If you add a new function to your addon, always pass the "instance" object
   */
  getPlayersNamesToFilter: function (instance) {
    var filteredPlayersNames = instance.storage("filteredPlayersNames");

    var playersNamesString;
    if (filteredPlayersNames) {
      playersNamesString = prompt(
        instance.t("filter.players.names.tooltip"),
        filteredPlayersNames
      );
    } else {
      playersNamesString = prompt(instance.t("filter.players.names.tooltip"));
    }

    if (playersNamesString) {
      var playersNames = playersNamesString.split(",");

      instance.storage("filteredPlayersNames", playersNames);
    } else {
      instance.storage("filteredPlayersNames", "");
    }
  },
});
