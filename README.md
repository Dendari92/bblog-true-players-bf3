# bblog-true-players-bf3
A very simple Better Battlelog plugin for Battlefield 3 which shows the real players count for a server.

# How to Install
1. Have Better Battlelog browser plugin installed and active (you can find it here: https://getbblog.com, Firefox users try [this how-to install](https://github.com/brainfoolong/better-battlelog#how-to-install-on-firefox));
2. Go to Battlefield 3 Battlelog webpage (https://battlelog.battlefield.com/bf3);
3. On the left you should see a "Better Battlelog" sidebutton:

   ![image](https://user-images.githubusercontent.com/8669503/140802508-987a4ec9-173a-4523-88d4-55587aa8b905.png)
   
4. Hover over it or click on it, it should open Better Battlelog sidebar with all the options:
 
   ![image](https://user-images.githubusercontent.com/8669503/140802715-cced6978-a690-48bc-9079-a26cb98d54c6.png)
   
5. Click on the "Plugins" button, it should open a pop-up window:
   
   ![image](https://user-images.githubusercontent.com/8669503/140803130-c1ecac88-ca78-424b-9ef6-42512be6101a.png)
   
6. In this window you can either copy and paste direct links to plugins or copy and paste an entire plugin code and modify it on the fly.
   - For easy installation just copy this link: https://dendari92.github.io/bblog-true-players-bf3/bblog-true-players-bf3.js in the first text field (just above the "Plugin Editor" label) and press enter. Reload the webpage to apply the changes.
     
     ![image](https://user-images.githubusercontent.com/8669503/140805431-b93526dc-81cd-4222-ac56-a29375e6ba65.png)

     ![image](https://user-images.githubusercontent.com/8669503/140805613-9afc4dae-6a63-493b-b5cb-ceaf1f5a402f.png)
     
     ![image](https://user-images.githubusercontent.com/8669503/142509481-db93e0fd-4602-439a-bc8d-f679d240a30d.png)

   - If you want to see the code and play around with it you can copy and paste the code in the big textarea at the bottom of the pop-up window. You can find the plugin code here: https://github.com/Dendari92/bblog-true-players-bf3/blob/main/bblog-true-players-bf3.js

# Known Issues and Limitations
## Too many "real" players
Sometimes the plugin will show more "real" players than are actually possible (e.g. 70/64). With version 1.2 a toggle has been added in the BBLog settings meny to count only playing "real" players.

![image](https://user-images.githubusercontent.com/8669503/162817785-5f847574-7853-44e0-b0bd-bb08bc7f6d2c.png)

## Filter fake accounts inside a server
Some servers use in-game bot to boost their numbers. With version 1.2 it's possible to filter players names (e.g. the bots names).

NOTE: it is possible to use [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)!

![image](https://user-images.githubusercontent.com/8669503/163254460-717ce8a5-7db9-49dc-bf2d-982221c9ed16.png)

![image](https://user-images.githubusercontent.com/8669503/163254568-1adf8cd0-aa4f-4acd-b01a-fe9ec1f36337.png)

## Sort by "real" players count
Sorting by real players count isn't possible, so you might see empty servers at the top when sorting by players.

## More fancy way of showing the "real" players count
The way the plugin shows real players it's kinda ugly, just wanted something (mostly) functional.

# Special Thanks

To Better Battlelog team, for the great plugin. [https://getbblog.com, https://github.com/brainfoolong/better-battlelog]

To Battlefield 4 True Player Counts plugin, for the inspiration. [https://github.com/Razer2015/TruePlayerCounts_BF4]
