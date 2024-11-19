# MARK: Rebirth

...is a top-down shooter where your character changes every time you get eliminated.

**Play the game here: https://erikgxdev.itch.io/mark-rebirth**

Visit the jam here: https://itch.io/jam/kajam

The code base is rather messy because of the time limitations I had during the game jam,
but here are some notable files/folders that may be important:

### [/maps/](https://github.com/ErikGXDev/kajam-game-2024/tree/main/maps)

Contains the .ldtk file used for creating the different rooms found in the game.
Also contains the map data of the existing rooms.

### [audio.ts](https://github.com/ErikGXDev/kajam-game-2024/blob/main/src/audio.ts)

A custom audio system that allowed me to synchronize the "Rocker Mark" character to the music and to
seamlessly toggle between different music files.

### [map.ts](https://github.com/ErikGXDev/kajam-game-2024/blob/main/src/map.ts)

Contains code regarding loading & spawning maps into the game, including camera logic.

### [/objects/](https://github.com/ErikGXDev/kajam-game-2024/tree/main/src/objects)

Folder containing all entities found in the game.

### [/scenes/](https://github.com/ErikGXDev/kajam-game-2024/tree/main/src/scenes)

The game and main menu scene.

### Assets

[Sprites](https://github.com/ErikGXDev/kajam-game-2024/tree/main/public/sprites)
and
[Sounds](https://github.com/ErikGXDev/kajam-game-2024/tree/main/public/sounds)
