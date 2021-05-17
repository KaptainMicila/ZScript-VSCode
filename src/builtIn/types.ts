import { MarkdownString } from "vscode";

/**
 * This is the base type. It shouldn't be (please don't) used by itself.
 *
 * @abstract
 */
export interface ZScriptType {
    /**
     * This is the "name" of the type
     */
    label: string;

    /**
     * Some types have aliases for their name.
     * This will create additional `ZScriptCompletionItem`s
     */
    aliases?: string[];

    /**
     * This is the description given to the type.
     * It can be used alone or used it as templates for all types.
     */
    description?: MarkdownString;
}

export interface ZScriptInteger extends ZScriptType {
    /**
     * The lowest value this integer type can reach.
     */
    lvalue?: string;

    /**
     * The highest value this integer can reach.
     */
    hvalue?: string;
}

export const integers: ZScriptInteger[] = [
    {
        label: "int",
        lvalue: "-2,147,483,648",
        hvalue: "2,147,483,647",
        description: new MarkdownString("Range of integers from `-2,147,483,648` to `2,147,483,647`"),
    },
    {
        label: "uint",
        lvalue: "0",
        hvalue: "4,294,967,296",
        description: new MarkdownString("Range of integers from `0` to `4,294,967,296`"),
    },
    {
        label: "int16",
        lvalue: "-32,768",
        hvalue: "32,767",
        aliases: ["short"],
        description: new MarkdownString("Range of integers from `-32,768` to `32,767`"),
    },
    {
        label: "uint16",
        lvalue: "0",
        hvalue: "65,535",
        aliases: ["ushort"],
        description: new MarkdownString("Range of integers from `0` to `65,535`"),
    },
    {
        label: "int8",
        lvalue: "-128",
        hvalue: "127",
        aliases: ["sbyte"],
        description: new MarkdownString("Range of integers from `-128` to `127`"),
    },
    {
        label: "uint8",
        lvalue: "0",
        hvalue: "255",
        aliases: ["byte"],
        description: new MarkdownString("Range of integers from `0` to `255`"),
    },
];

export interface ZScriptFloat extends ZScriptType {}

export const floats: ZScriptFloat[] = [
    {
        label: "double",
        description: new MarkdownString("64-bit floating-point number."),
        aliases: ["float64"],
    },
    {
        label: "float",
        description: new MarkdownString("32-bit in structures and classes, 64-bit otherwise."),
    },
];

export interface ZScriptClass extends ZScriptType {
    extends?: string;
    methods?: ZScriptFunction[];
    parameters?: ZScriptVariable[];
}

export const classes: ZScriptClass[] = [
    {
        label: "Object",
        description: new MarkdownString(
            "`Object` is the very front-most class which all other classes inherit from, either directly or through other inheriting classes. "
        ),
    },
    {
        label: "ActorIterator",
        description: new MarkdownString(
            "`ActorIterator` is a lighter-in-comparison iterator compared to its brothers, `ThinkerIterator` and `BlockThingsIterator` which is much less resource intensive. However, actors require a TID in order for this to qualify them as part of the iteration. As such, a tid of `0` will not work at all. "
        ),
    },
    {
        label: "AltHud",
    },
    {
        label: "BaseStatusBar",
        description: new MarkdownString(
            "`BaseStatusBar` is the base class that all standard status bars inherit from. It handles drawing the HUD both when the status bar is visible and when the game is running in fullscreen (i.e. the status bar is hidden). It does not handle GZDoom's alternative HUD, however."
        ),
    },
    {
        label: "DoomStatusBar",
    },
    {
        label: "HereticStatusBar",
    },
    {
        label: "HexenStatusBar",
    },
    {
        label: "SBarInfoWrapper",
    },
    {
        label: "StrifeStatusBar",
    },
    {
        label: "BlockLinesIterator",
        description: new MarkdownString(
            "`BlockLinesIterator` is a type of iterator used to search for lines in the `Blockmap`. Contrary to the name, this does not grab only blocking lines but all lines. Instead it gets any line that exists in a blockmap square within the given radius. You can use this to get nearby lines instead of having to iterate through all of them. If you wish to get only blocking lines you'll have to manually check the flags on each line found in the iterator."
        ),
    },
    {
        label: "BlockThingsIterator",
        description: new MarkdownString(
            "`BlockThingsIterator` is a type of iterator used to search for entities that are within the `Blockmap`. This excludes all actors with the `NOBLOCKMAP` flag. Any Actor in a blockmap square within the provided radius is taken, so this does not guarantee they are at radius distance or lower (manual checking will have to be done if a strict distance is necessary). Generally they are best used for getting surrounding Actors within a small area as opposed to every Actor. "
        ),
    },
    {
        label: "Bot",
    },
    {
        label: "BrokenLines",
    },
    {
        label: "DynamicValueInterpolator",
        description: new MarkdownString(
            "Used for interpolating between one value to the next. Can be used to gradually scale the start and end of the approach to and from its destination."
        ),
    },
    {
        label: "HUDFont",
        description: new MarkdownString(
            "This class is used in text-drawing functions as the font to use when drawing text. It also controls how the text is displayed, such as spacing and shadows."
        ),
    },
    {
        label: "HUDMessageBase",
    },
    {
        label: "InterBackground",
    },
    {
        label: "InventoryBarState",
        description: new MarkdownString(
            "Used for showing the inventory items and cycling through them, if they possess `INVENTORY.INVBAR`."
        ),
    },
    {
        label: "LevelCompatibility",
    },
    {
        label: "LinearValueInterpolator",
        description: new MarkdownString("Used for interpolating between one value to the next on a linear course."),
    },
    {
        label: "LineIdIterator",
    },
    {
        label: "LineTracer",
        description: new MarkdownString(
            "`LineTracer` is a class that allows for custom ray tracing (aka hitscan) behavior."
        ),
    },
    {
        label: "Menu",
    },
    {
        label: "ConversationMenu",
    },
    {
        label: "EnterKey",
    },
    {
        label: "GenericMenu",
    },
    {
        label: "ReadThisMenu",
    },
    {
        label: "ListMenu",
    },
    {
        label: "LoadSaveMenu",
    },
    {
        label: "LoadMenu",
    },
    {
        label: "SaveMenu",
    },
    {
        label: "PlayerMenu",
    },
    {
        label: "MessageBoxMenu",
    },
    {
        label: "OptionMenu",
    },
    {
        label: "ColorpickerMenu",
    },
    {
        label: "CompatibilityMenu",
    },
    {
        label: "GameplayMenu",
    },
    {
        label: "GLTextureGLOptions",
    },
    {
        label: "JoystickConfigMenu",
    },
    {
        label: "NewPlayerMenu",
    },
    {
        label: "os_Menu",
    },
    {
        label: "ReverbEdit",
    },
    {
        label: "ReverbSave",
    },
    {
        label: "ReverbSelect",
    },
    {
        label: "VideoModeMenu",
    },
    {
        label: "TextEnterMenu",
    },
    {
        label: "MenuDescriptor",
    },
    {
        label: "ListMenuDescriptor",
    },
    {
        label: "OptionMenuDescriptor",
    },
    {
        label: "MenuItemBase",
    },
    {
        label: "ListMenuItem",
    },
    {
        label: "ListMenuItemPlayerDisplay",
    },
    {
        label: "PlayerMenuPlayerDisplay",
    },
    {
        label: "ListMenuItemSelectable",
    },
    {
        label: "ListMenuItemPatchItem",
    },
    {
        label: "ListMenuItemPlayerNameBox",
    },
    {
        label: "ListMenuItemSlider",
    },
    {
        label: "ListMenuItemTextItem",
    },
    {
        label: "ListMenuItemValueText",
    },
    {
        label: "ListMenuItemStaticPatch",
    },
    {
        label: "ListMenuItemStaticPatchCentered",
    },
    {
        label: "ListMenuItemStaticText",
    },
    {
        label: "ListMenuItemStaticTextCentered",
    },
    {
        label: "OptionMenuItem",
    },
    {
        label: "OptionMenuFieldBase",
    },
    {
        label: "OptionMenuItemNumberField",
    },
    {
        label: "OptionMenuItemTextField",
    },
    {
        label: "OptionMenuItemPlayerNameField",
    },
    {
        label: "os_SearchField",
    },
    {
        label: "OptionMenuItemColorPicker",
    },
    {
        label: "OptionMenuItemControlBase",
    },
    {
        label: "OptionMenuItemControl",
    },
    {
        label: "OptionMenuItemMapControl",
    },
    {
        label: "OptionMenuItemOptionBase",
    },
    {
        label: "OptionMenuItemInverter",
    },
    {
        label: "OptionMenuItemJoyMap",
    },
    {
        label: "OptionMenuItemOption",
    },
    {
        label: "os_AnyOrAllOption",
    },
    {
        label: "OptionMenuItemPlayerClassItem",
    },
    {
        label: "OptionMenuItemPlayerColorItem",
    },
    {
        label: "OptionMenuItemPlayerGenderItem",
    },
    {
        label: "OptionMenuItemPlayerSkinItem",
    },
    {
        label: "OptionMenuItemPlayerSwitchOnPickupItem",
    },
    {
        label: "OptionMenuItemPlayerTeamItem",
    },
    {
        label: "OptionMenuItemReverbOption",
    },
    {
        label: "OptionMenuItemReverbSaveSelect",
    },
    {
        label: "OptionMenuItemScreenResolution",
    },
    {
        label: "OptionMenuItemStaticText",
    },
    {
        label: "OptionMenuItemStaticTextSwitchable",
    },
    {
        label: "OptionMenuItemSubMenu",
    },
    {
        label: "OptionMenuItemCommand",
    },
    {
        label: "OptionMenuItemSafeCommand",
    },
    {
        label: "OptionMenuItemJoyConfigMenu",
    },
    {
        label: "OptionMenuItemLabeledSubmenu",
    },
    {
        label: "OptionMenuItemReverbSelect",
    },
    {
        label: "OptionMenuSliderBase",
    },
    {
        label: "OptionMenuItemAutoaimSlider",
    },
    {
        label: "OptionMenuItemPlayerColorSlider",
    },
    {
        label: "OptionMenuItemSlider",
    },
    {
        label: "OptionMenuItemScaleSlider",
    },
    {
        label: "OptionMenuItemSliderReverbEditOption",
    },
    {
        label: "OptionMenuSliderJoyDeadZone",
    },
    {
        label: "OptionMenuSliderJoyScale",
    },
    {
        label: "OptionMenuSliderJoySensitivity",
    },
    {
        label: "OptionMenuSliderVar",
    },
    {
        label: "os_Query",
    },
    {
        label: "PointLightFlickerRandomAdditive",
    },
    {
        label: "PointLightFlickerRandomAttenuated",
    },
    {
        label: "PSprite",
    },
    {
        label: "ScriptUtil",
    },
    {
        label: "SectorTagIterator",
    },
    {
        label: "SeqNode",
    },
    {
        label: "Shape2D",
        description: new MarkdownString(
            "`Shape2D` is a class that can be used to create arbitrary flat shapes to be rendered to the screen"
        ),
    },
    {
        label: "Shape2DTransform",
    },
    {
        label: "SpotState",
    },
    {
        label: "StaticEventHandler",
        description: new MarkdownString("Event handler which persist outside of maps but are never saved to savegames"),
    },
    {
        label: "EventHandler",
        description: new MarkdownString("Event handler which is only available within maps but are saved"),
    },
    {
        label: "StatusScreen",
    },
    {
        label: "CoopStatusScreen",
    },
    {
        label: "DeathmatchStatusScreen",
    },
    {
        label: "DoomStatusScreen",
    },
    {
        label: "RavenStatusScreen",
    },
    {
        label: "Thinker",
        description: new MarkdownString(
            "A `Thinker` class is derived from `Object`, and is used as the base for an Actor and more. Unlike actors, thinkers are not physically present in the game at all."
        ),
    },
    {
        label: "Actor",
        description: new MarkdownString(
            "`Actor` (internally `AActor`) is the base class for all DECORATE actors. When a parent class isn't declared in an actor definition, it uses `Actor` as the parent."
        ),
    },
    {
        label: "AlienAspClimber",
    },
    {
        label: "AlienBubbleColumn",
    },
    {
        label: "AlienCeilingBubble",
    },
    {
        label: "AlienChunkLarge",
    },
    {
        label: "AlienChunkSmall",
    },
    {
        label: "AlienFloorBubble",
    },
    {
        label: "AlienSpiderLight",
    },
    {
        label: "AmbientSound",
        description: new MarkdownString(
            "The `AmbientSound` thing plays an ambient sound determined by its first parameter. The sounds themselves must be defined in `SNDINFO`."
        ),
    },
    {
        label: "AmbientSoundNoGravity",
        description: new MarkdownString(
            "This thing is used like the `AmbientSound` thing in the `UDMF` or `Hexen` map format, but in addition is not affected by gravity and can therefore be placed at specific heights. It plays an ambient sound determined by its first parameter. The sounds themselves must be defined in `SNDINFO`."
        ),
    },
    {
        label: "AmmoFiller",
    },
    {
        label: "Anvil",
    },
    {
        label: "Arachnotron",
    },
    {
        label: "StealthArachnotron",
    },
    {
        label: "ArachnotronPlasma",
    },
    {
        label: "Archvile",
    },
    {
        label: "StealthArchvile",
    },
    {
        label: "ArchvileFire",
    },
    {
        label: "Arrow",
    },
    {
        label: "AxeBlood",
    },
    {
        label: "AxePuff",
    },
    {
        label: "AxePuffGlow",
    },
    {
        label: "Bang4Cloud",
    },
    {
        label: "BaronBall",
    },
    {
        label: "BaronOfHell",
    },
    {
        label: "Flembrane",
    },
    {
        label: "HellKnight",
    },
    {
        label: "StealthHellKnight",
    },
    {
        label: "StealthBaron",
    },
    {
        label: "BarricadeColumn",
    },
    {
        label: "Bat",
    },
    {
        label: "Beast",
    },
    {
        label: "BeastBall",
    },
    {
        label: "BFGBall",
    },
    {
        label: "LAZBall",
    },
    {
        label: "BFGExtra",
    },
    {
        label: "BigTree",
    },
    {
        label: "ChexBananaTree",
    },
    {
        label: "BigTree2",
    },
    {
        label: "Bishop",
    },
    {
        label: "BishopBlur",
    },
    {
        label: "BishopFX",
    },
    {
        label: "BishopMissile",
    },
    {
        label: "BishopPainBlur",
    },
    {
        label: "BishopPuff",
    },
    {
        label: "BlastEffect",
    },
    {
        label: "BlasterPuff",
    },
    {
        label: "BlasterSmoke",
    },
    {
        label: "Blood",
        description: new MarkdownString("The blood splat actor is spawned when an actor is hit and is able to bleed."),
    },
    {
        label: "BloodPool",
    },
    {
        label: "BloodscourgeDrop",
    },
    {
        label: "BloodSplash",
    },
    {
        label: "BloodSplashBase",
    },
    {
        label: "BloodSplatter",
    },
    {
        label: "BloodyTwitch",
    },
    {
        label: "NonsolidTwitch",
    },
    {
        label: "BlueTorch",
    },
    {
        label: "ChexSlimeFountain",
    },
    {
        label: "BossBrain",
    },
    {
        label: "BossEye",
    },
    {
        label: "BrainStem",
    },
    {
        label: "BrassTorch",
    },
    {
        label: "BridgeBall",
    },
    {
        label: "BulletPuff",
        description: new MarkdownString(
            "A puff actor spawned by weapon and monster hitscan attacks (i.e. bullets) in Doom."
        ),
    },
    {
        label: "BurningBarrel",
    },
    {
        label: "BurningBowl",
    },
    {
        label: "BurningBrazier",
    },
    {
        label: "Cacodemon",
    },
    {
        label: "DeadCacodemon",
    },
    {
        label: "StealthCacodemon",
    },
    {
        label: "CacodemonBall",
    },
    {
        label: "CageLight",
    },
    {
        label: "CajunBodyNode",
    },
    {
        label: "CajunTrace",
    },
    {
        label: "Candelabra",
    },
    {
        label: "ChexGasTank",
    },
    {
        label: "Candle",
    },
    {
        label: "Candlestick",
    },
    {
        label: "ChexChemicalFlask",
    },
    {
        label: "CavePillarBottom",
    },
    {
        label: "CavePillarTop",
    },
    {
        label: "CeilingChain",
    },
    {
        label: "CeilingTurret",
    },
    {
        label: "Centaur",
    },
    {
        label: "CentaurLeader",
    },
    {
        label: "CentaurMash",
    },
    {
        label: "CentaurFX",
    },
    {
        label: "CentaurShield",
    },
    {
        label: "CentaurSword",
    },
    {
        label: "CFlameFloor",
    },
    {
        label: "ChaingunGuy",
    },
    {
        label: "StealthChaingunGuy",
    },
    {
        label: "ChimneyStack",
    },
    {
        label: "CircleFlame",
    },
    {
        label: "ClericBoss",
    },
    {
        label: "Clink",
    },
    {
        label: "ColonGibs",
    },
    {
        label: "ColorSetter",
    },
    {
        label: "Column",
    },
    {
        label: "ChexLandingLight",
    },
    {
        label: "CommanderKeen",
    },
    {
        label: "Computer",
    },
    {
        label: "CorpseBit",
    },
    {
        label: "CorpseBloodDrip",
    },
    {
        label: "CrossbowFX1",
    },
    {
        label: "CrossbowFX2",
    },
    {
        label: "CrossbowFX3",
    },
    {
        label: "CrossbowFX4",
    },
    {
        label: "Crusader",
    },
    {
        label: "CrusaderMissile",
    },
    {
        label: "CStaffMissile",
    },
    {
        label: "CStaffPuff",
    },
    {
        label: "CustomBridge",
        description: new MarkdownString(
            "`CustomBridge` can be used to create either a Doom-style or Hexen-style invisible bridge"
        ),
    },
    {
        label: "Bridge",
        description: new MarkdownString(
            'The bridge is a "3D" element that can be placed at any height and allows players and monsters alike to walk upon it.'
        ),
    },
    {
        label: "ZBridge",
        description: new MarkdownString(
            'The bridge is a "3D" element that can be placed at any height and allows players and monsters alike to walk upon it.'
        ),
    },
    {
        label: "CustomSprite",
        description: new MarkdownString("Just an actor to make the Build sprites show up."),
    },
    {
        label: "Cyberdemon",
    },
    {
        label: "Dart",
    },
    {
        label: "PoisonDart",
    },
    {
        label: "DeadAcolyte",
    },
    {
        label: "DeadCrusader",
    },
    {
        label: "DeadMarine",
    },
    {
        label: "DeadPeasant",
    },
    {
        label: "DeadReaver",
    },
    {
        label: "DeadRebel",
    },
    {
        label: "DeadStick",
    },
    {
        label: "ChexTallFlower2",
    },
    {
        label: "DeadStrifePlayer",
    },
    {
        label: "Decal",
        description: new MarkdownString(
            "The Decal is a useful tool to add graphics to walls without requiring a custom texture."
        ),
    },
    {
        label: "Demon",
    },
    {
        label: "DeadDemon",
    },
    {
        label: "FlemoidusCycloptisCommonus",
    },
    {
        label: "Spectre",
    },
    {
        label: "StealthDemon",
    },
    {
        label: "Demon1",
    },
    {
        label: "Demon1Mash",
    },
    {
        label: "Demon2",
    },
    {
        label: "Demon2Mash",
    },
    {
        label: "Demon1FX1",
    },
    {
        label: "Demon2FX1",
    },
    {
        label: "DemonChunk",
    },
    {
        label: "Demon1Chunk1",
    },
    {
        label: "Demon1Chunk2",
    },
    {
        label: "Demon1Chunk3",
    },
    {
        label: "Demon1Chunk4",
    },
    {
        label: "Demon1Chunk5",
    },
    {
        label: "Demon2Chunk1",
    },
    {
        label: "Demon2Chunk2",
    },
    {
        label: "Demon2Chunk3",
    },
    {
        label: "Demon2Chunk4",
    },
    {
        label: "Demon2Chunk5",
    },
    {
        label: "Dirt1",
    },
    {
        label: "Dirt2",
    },
    {
        label: "Dirt3",
    },
    {
        label: "Dirt4",
    },
    {
        label: "Dirt5",
    },
    {
        label: "Dirt6",
    },
    {
        label: "DirtClump",
    },
    {
        label: "DoomBuilderCamera",
        description: new MarkdownString("Doom Builder places this thing on the maps it edits for its 3D editing mode."),
    },
    {
        label: "DoomImp",
    },
    {
        label: "ArmoredFlemoidusBipedicus",
    },
    {
        label: "DeadDoomImp",
    },
    {
        label: "StealthDoomImp",
    },
    {
        label: "DoomImpBall",
    },
    {
        label: "DoomUnusedStates",
    },
    {
        label: "Dragon",
    },
    {
        label: "DragonExplosion",
    },
    {
        label: "DragonFireball",
    },
    {
        label: "DynamicLight",
        description: new MarkdownString("The base class for all dynamic lights."),
    },
    {
        label: "PointLight",
    },
    {
        label: "PointLightAdditive",
    },
    {
        label: "PointLightAttenuated",
    },
    {
        label: "PointLightFlicker",
    },
    {
        label: "PointLightFlickerAdditive",
    },
    {
        label: "PointLightFlickerAttenuated",
    },
    {
        label: "PointLightFlickerSubtractive",
    },
    {
        label: "PointLightFlickerRandom",
    },
    {
        label: "PointLightFlickerRandomSubtractive",
    },
    {
        label: "PointLightPulse",
    },
    {
        label: "PointLightPulseAdditive",
    },
    {
        label: "PointLightPulseAttenuated",
    },
    {
        label: "PointLightPulseSubtractive",
    },
    {
        label: "PointLightSubtractive",
    },
    {
        label: "SectorPointLight",
    },
    {
        label: "SectorPointLightAdditive",
    },
    {
        label: "SectorPointLightAttenuated",
    },
    {
        label: "SectorPointLightSubtractive",
    },
    {
        label: "SVELight",
    },
    {
        label: "SVELight7958",
    },
    {
        label: "SVELight7959",
    },
    {
        label: "SVELight7960",
    },
    {
        label: "SVELight7961",
    },
    {
        label: "SVELight7962",
    },
    {
        label: "SVELight7964",
    },
    {
        label: "SVELight7965",
    },
    {
        label: "SVELight7971",
    },
    {
        label: "SVELight7972",
    },
    {
        label: "SVELight7973",
    },
    {
        label: "SVELight7974",
    },
    {
        label: "SpotLight",
    },
    {
        label: "SectorSpotLight",
    },
    {
        label: "SectorSpotLightAdditive",
    },
    {
        label: "SectorSpotLightAttenuated",
    },
    {
        label: "SectorSpotLightSubtractive",
    },
    {
        label: "SpotLightAdditive",
    },
    {
        label: "SpotLightAttenuated",
    },
    {
        label: "SpotLightFlicker",
    },
    {
        label: "SpotLightFlickerAdditive",
    },
    {
        label: "SpotLightFlickerAttenuated",
    },
    {
        label: "SpotLightFlickerSubtractive",
    },
    {
        label: "SpotLightFlickerRandom",
    },
    {
        label: "SpotLightFlickerRandomAdditive",
    },
    {
        label: "SpotLightFlickerRandomAttenuated",
    },
    {
        label: "SpotLightFlickerRandomSubtractive",
    },
    {
        label: "SpotLightPulse",
    },
    {
        label: "SpotLightPulseAdditive",
    },
    {
        label: "SpotLightPulseAttenuated",
    },
    {
        label: "SpotLightPulseSubtractive",
    },
    {
        label: "SpotLightSubtractive",
    },
    {
        label: "VavoomLight",
        description: new MarkdownString("Base class for Vavoom-type lights."),
    },
    {
        label: "VavoomLightColor",
    },
    {
        label: "VavoomLightWhite",
    },
    {
        label: "ElectricBolt",
    },
    {
        label: "EntityNest",
    },
    {
        label: "EntityPod",
    },
    {
        label: "Ettin",
    },
    {
        label: "EttinMash",
    },
    {
        label: "EttinMace",
    },
    {
        label: "EvilEye",
    },
    {
        label: "ChexChemicalBurner",
    },
    {
        label: "ExplosiveBarrel",
    },
    {
        label: "ExplosiveBarrel2",
    },
    {
        label: "FadeSetter",
        description: new MarkdownString(
            "Sets the containing sector's fade (fog) color using the values specified by its arguments"
        ),
    },
    {
        label: "FastProjectile",
    },
    {
        label: "BlasterFX1",
    },
    {
        label: "CFlameMissile",
    },
    {
        label: "MageWandMissile",
    },
    {
        label: "FatShot",
    },
    {
        label: "Fatso",
    },
    {
        label: "StealthFatso",
    },
    {
        label: "Feather",
    },
    {
        label: "FighterBoss",
    },
    {
        label: "FireBall",
    },
    {
        label: "FireBomb",
    },
    {
        label: "FireDemon",
    },
    {
        label: "FireDemonMissile",
    },
    {
        label: "FireDemonRock1",
    },
    {
        label: "FireDemonRock2",
    },
    {
        label: "FireDemonRock3",
    },
    {
        label: "FireDemonRock4",
    },
    {
        label: "FireDemonRock5",
    },
    {
        label: "FireDemonSplotch1",
    },
    {
        label: "FireDemonSplotch2",
    },
    {
        label: "FireDroplet",
    },
    {
        label: "FireThing",
    },
    {
        label: "FlameLargeTemp",
    },
    {
        label: "FlameMissile",
    },
    {
        label: "FastFlameMissile",
    },
    {
        label: "FlamePuff",
    },
    {
        label: "FlamePuff2",
    },
    {
        label: "FlameSmallTemp",
    },
    {
        label: "FloatingSkull",
    },
    {
        label: "FogPatchSmall",
    },
    {
        label: "FogPatchMedium",
    },
    {
        label: "FogPatchLarge",
    },
    {
        label: "FogSpawner",
    },
    {
        label: "ForceFieldGuard",
    },
    {
        label: "FrostMissile",
    },
    {
        label: "IceShard",
    },
    {
        label: "FSwordFlame",
    },
    {
        label: "FSwordMissile",
    },
    {
        label: "GauntletPuff1",
    },
    {
        label: "GauntletPuff2",
    },
    {
        label: "GibbedMarine",
    },
    {
        label: "GibbedMarineExtra",
    },
    {
        label: "GlassJunk",
    },
    {
        label: "GlassShard",
    },
    {
        label: "SGShard0",
    },
    {
        label: "SGShard1",
    },
    {
        label: "SGShard2",
    },
    {
        label: "SGShard3",
    },
    {
        label: "SGShard4",
    },
    {
        label: "SGShard5",
    },
    {
        label: "SGShard6",
    },
    {
        label: "SGShard7",
    },
    {
        label: "SGShard8",
    },
    {
        label: "SGShard9",
    },
    {
        label: "GoldWandFX1",
    },
    {
        label: "GoldWandFX2",
    },
    {
        label: "GoldWandPuff2",
    },
    {
        label: "GoldWandPuff1",
    },
    {
        label: "GreenTorch",
    },
    {
        label: "ChexCivilian1",
    },
    {
        label: "Grenade",
    },
    {
        label: "GrenadeSmokeTrail",
    },
    {
        label: "HammerMissile",
    },
    {
        label: "HammerPuff",
    },
    {
        label: "HangBNoBrain",
    },
    {
        label: "HangNoGuts",
    },
    {
        label: "HangTLookingDown",
    },
    {
        label: "HangTLookingUp",
    },
    {
        label: "HangTNoBrain",
    },
    {
        label: "HangTSkull",
    },
    {
        label: "HateTarget",
    },
    {
        label: "HeadCandles",
    },
    {
        label: "HeadFX1",
    },
    {
        label: "HeadFX2",
    },
    {
        label: "HeadFX3",
    },
    {
        label: "HeadOnAStick",
    },
    {
        label: "HeadsOnAStick",
    },
    {
        label: "ChexTallFlower",
    },
    {
        label: "HeartColumn",
    },
    {
        label: "HeartsInTank",
    },
    {
        label: "HEGrenade",
    },
    {
        label: "Heresiarch",
    },
    {
        label: "HereticImp",
    },
    {
        label: "HereticImpLeader",
    },
    {
        label: "HereticImpBall",
    },
    {
        label: "HereticImpChunk1",
    },
    {
        label: "HereticImpChunk2",
    },
    {
        label: "HolyMissile",
    },
    {
        label: "HolyMissilePuff",
    },
    {
        label: "HolyPuff",
    },
    {
        label: "HolySpirit",
    },
    {
        label: "HolyTail",
    },
    {
        label: "HolyTailTrail",
    },
    {
        label: "HornRodFX1",
    },
    {
        label: "HornRodFX2",
    },
    {
        label: "HugeTorch",
    },
    {
        label: "HWaterDrip",
    },
    {
        label: "IceChunk",
    },
    {
        label: "IceFXPuff",
    },
    {
        label: "IceGuy",
    },
    {
        label: "IceGuyBit",
    },
    {
        label: "IceGuyFX",
    },
    {
        label: "IceGuyFX2",
    },
    {
        label: "IceGuyWisp1",
    },
    {
        label: "IceGuyWisp2",
    },
    {
        label: "Inquisitor",
    },
    {
        label: "InquisitorArm",
    },
    {
        label: "InquisitorShot",
    },
    {
        label: "InterpolationPoint",
    },
    {
        label: "InterpolationSpecial",
    },
    {
        label: "Inventory",
    },
    {
        label: "Ammo",
    },
    {
        label: "Cell",
    },
    {
        label: "CellPack",
    },
    {
        label: "PhasingZorch",
    },
    {
        label: "PhasingZorchPack",
    },
    {
        label: "Clip",
    },
    {
        label: "ClipBox",
    },
    {
        label: "MiniZorchPack",
    },
    {
        label: "MiniZorchRecharge",
    },
    {
        label: "ClipOfBullets",
    },
    {
        label: "BoxOfBullets",
    },
    {
        label: "ElectricBolts",
    },
    {
        label: "EnergyPod",
    },
    {
        label: "EnergyPack",
    },
    {
        label: "HEGrenadeRounds",
    },
    {
        label: "Mana1",
    },
    {
        label: "Mana2",
    },
    {
        label: "MiniMissiles",
    },
    {
        label: "CrateOfMissiles",
    },
    {
        label: "PhosphorusGrenadeRounds",
    },
    {
        label: "PoisonBolts",
    },
    {
        label: "RocketAmmo",
    },
    {
        label: "PropulsorZorch",
    },
    {
        label: "PropulsorZorchPack",
    },
    {
        label: "RocketBox",
    },
    {
        label: "Shell",
    },
    {
        label: "LargeZorchPack",
    },
    {
        label: "LargeZorchRecharge",
    },
    {
        label: "ShellBox",
    },
    {
        label: "Armor",
    },
    {
        label: "BasicArmor",
    },
    {
        label: "BasicArmorBonus",
    },
    {
        label: "ArmorBonus",
    },
    {
        label: "SlimeRepellent",
    },
    {
        label: "BasicArmorPickup",
    },
    {
        label: "BlueArmor",
    },
    {
        label: "BlueArmorForMegasphere",
    },
    {
        label: "SuperChexArmor",
    },
    {
        label: "GreenArmor",
    },
    {
        label: "ChexArmor",
    },
    {
        label: "LeatherArmor",
    },
    {
        label: "MetalArmor",
    },
    {
        label: "HexenArmor",
    },
    {
        label: "AmuletOfWarding",
    },
    {
        label: "FalconShield",
    },
    {
        label: "MeshArmor",
    },
    {
        label: "PlatinumHelm",
    },
    {
        label: "ArtiBoostArmor",
    },
    {
        label: "ArtiDarkServant",
    },
    {
        label: "ArtiHealingRadius",
    },
    {
        label: "ArtiPoisonBag",
    },
    {
        label: "ArtiPoisonBag1",
    },
    {
        label: "ArtiPoisonBag2",
    },
    {
        label: "ArtiPoisonBag3",
    },
    {
        label: "ArtiPoisonBagGiver",
    },
    {
        label: "ArtiPoisonBagShooter",
    },
    {
        label: "ArtiTeleport",
    },
    {
        label: "ArtiTeleportOther",
    },
    {
        label: "BackpackItem",
    },
    {
        label: "AmmoSatchel",
    },
    {
        label: "Backpack",
    },
    {
        label: "Zorchpack",
    },
    {
        label: "BeldinsRing",
    },
    {
        label: "BrokenPowerCoupling",
    },
    {
        label: "Coin",
    },
    {
        label: "Gold10",
    },
    {
        label: "Gold25",
    },
    {
        label: "Gold300",
    },
    {
        label: "Gold50",
    },
    {
        label: "Communicator",
    },
    {
        label: "DegninOre",
    },
    {
        label: "DehackedPickup",
    },
    {
        label: "DummyStrifeItem",
    },
    {
        label: "AmmoFillup",
    },
    {
        label: "CloseDoor222",
    },
    {
        label: "HealthFillup",
    },
    {
        label: "OpenDoor222",
    },
    {
        label: "OpenDoor224",
    },
    {
        label: "RaiseAlarm",
    },
    {
        label: "SlideshowStarter",
    },
    {
        label: "SVEOpenDoor225",
    },
    {
        label: "UpgradeAccuracy",
    },
    {
        label: "UpgradeStamina",
    },
    {
        label: "Ear",
    },
    {
        label: "FakeInventory",
    },
    {
        label: "FlameThrowerParts",
    },
    {
        label: "GuardUniform",
    },
    {
        label: "GunTraining",
    },
    {
        label: "Health",
    },
    {
        label: "CrystalVial",
    },
    {
        label: "HealthBonus",
    },
    {
        label: "GlassOfWater",
    },
    {
        label: "MaxHealth",
    },
    {
        label: "Medikit",
    },
    {
        label: "BowlOfVegetables",
    },
    {
        label: "MegasphereHealth",
    },
    {
        label: "Soulsphere",
    },
    {
        label: "SuperchargeBreakfast",
    },
    {
        label: "Stimpack",
    },
    {
        label: "BowlOfFruit",
    },
    {
        label: "HealthPickup",
    },
    {
        label: "ArtiHealth",
    },
    {
        label: "ArtiSuperHealth",
    },
    {
        label: "MedicalKit",
    },
    {
        label: "MedPatch",
    },
    {
        label: "SurgeryKit",
    },
    {
        label: "HealthTraining",
    },
    {
        label: "Info",
    },
    {
        label: "InterrogatorReport",
    },
    {
        label: "Key",
    },
    {
        label: "DoomKey",
    },
    {
        label: "BlueCard",
    },
    {
        label: "ChexBlueCard",
    },
    {
        label: "BlueSkull",
    },
    {
        label: "RedCard",
    },
    {
        label: "ChexRedCard",
    },
    {
        label: "RedSkull",
    },
    {
        label: "YellowCard",
    },
    {
        label: "ChexYellowCard",
    },
    {
        label: "YellowSkull",
    },
    {
        label: "HexenKey",
    },
    {
        label: "KeyAxe",
    },
    {
        label: "KeyCastle",
    },
    {
        label: "KeyCave",
    },
    {
        label: "KeyDungeon",
    },
    {
        label: "KeyEmerald",
    },
    {
        label: "KeyFire",
    },
    {
        label: "KeyHorn",
    },
    {
        label: "KeyRusted",
    },
    {
        label: "KeySilver",
    },
    {
        label: "KeySteel",
    },
    {
        label: "KeySwamp",
    },
    {
        label: "PrisonPass",
    },
    {
        label: "StrifeKey",
    },
    {
        label: "BaseKey",
    },
    {
        label: "BlueCrystalKey",
    },
    {
        label: "BrassKey",
    },
    {
        label: "CatacombKey",
    },
    {
        label: "ChapelKey",
    },
    {
        label: "CoreKey",
    },
    {
        label: "FactoryKey",
    },
    {
        label: "GoldKey",
    },
    {
        label: "GovsKey",
    },
    {
        label: "IDBadge",
    },
    {
        label: "IDCard",
    },
    {
        label: "MaulerKey",
    },
    {
        label: "MilitaryID",
    },
    {
        label: "MineKey",
    },
    {
        label: "NewKey5",
    },
    {
        label: "OracleKey",
    },
    {
        label: "OrderKey",
    },
    {
        label: "Passcard",
    },
    {
        label: "Power1Key",
    },
    {
        label: "Power2Key",
    },
    {
        label: "Power3Key",
    },
    {
        label: "PrisonKey",
    },
    {
        label: "RedCrystalKey",
    },
    {
        label: "SecurityKey",
    },
    {
        label: "SeveredHand",
    },
    {
        label: "SilverKey",
    },
    {
        label: "WarehouseKey",
    },
    {
        label: "MapRevealer",
    },
    {
        label: "Allmap",
    },
    {
        label: "ComputerAreaMap",
    },
    {
        label: "StrifeMap",
    },
    {
        label: "OfferingChalice",
    },
    {
        label: "OfficersUniform",
    },
    {
        label: "OraclePass",
    },
    {
        label: "Powerup",
    },
    {
        label: "PowerBuddha",
    },
    {
        label: "PowerDamage",
    },
    {
        label: "PowerDoubleFiringSpeed",
    },
    {
        label: "PowerDrain",
    },
    {
        label: "PowerFlight",
    },
    {
        label: "PowerFrightener",
    },
    {
        label: "PowerHighJump",
    },
    {
        label: "PowerInfiniteAmmo",
    },
    {
        label: "PowerInvisibility",
    },
    {
        label: "PowerGhost",
    },
    {
        label: "PowerShadow",
    },
    {
        label: "PowerInvulnerable",
    },
    {
        label: "PowerIronFeet",
    },
    {
        label: "PowerMask",
    },
    {
        label: "PowerLightAmp",
    },
    {
        label: "PowerTorch",
    },
    {
        label: "PowerMinotaur",
    },
    {
        label: "PowerMorph",
    },
    {
        label: "PowerProtection",
    },
    {
        label: "PowerReflection",
    },
    {
        label: "PowerRegeneration",
    },
    {
        label: "PowerScanner",
    },
    {
        label: "PowerSpeed",
    },
    {
        label: "PowerStrength",
    },
    {
        label: "PowerTargeter",
    },
    {
        label: "PowerTimeFreezer",
    },
    {
        label: "PowerWeaponLevel2",
    },
    {
        label: "PowerupGiver",
    },
    {
        label: "ArtiFly",
    },
    {
        label: "ArtiInvulnerability",
    },
    {
        label: "ArtiInvulnerability2",
    },
    {
        label: "ArtiSpeedBoots",
    },
    {
        label: "ArtiTorch",
    },
    {
        label: "BlurSphere",
    },
    {
        label: "EnvironmentalSuit",
    },
    {
        label: "Infrared",
    },
    {
        label: "InvulnerabilitySphere",
    },
    {
        label: "RadSuit",
    },
    {
        label: "SlimeProofSuit",
    },
    {
        label: "Scanner",
    },
    {
        label: "ShadowArmor",
    },
    {
        label: "Targeter",
    },
    {
        label: "ProgLevelEnder",
    },
    {
        label: "PuzzleItem",
    },
    {
        label: "PuzzBook1",
    },
    {
        label: "PuzzBook2",
    },
    {
        label: "PuzzCWeapon",
    },
    {
        label: "PuzzFlameMask",
    },
    {
        label: "PuzzFWeapon",
    },
    {
        label: "PuzzGear1",
    },
    {
        label: "PuzzGear2",
    },
    {
        label: "PuzzGear3",
    },
    {
        label: "PuzzGear4",
    },
    {
        label: "PuzzGemBig",
    },
    {
        label: "PuzzGemBlue1",
    },
    {
        label: "PuzzGemBlue2",
    },
    {
        label: "PuzzGemGreen1",
    },
    {
        label: "PuzzGemGreen2",
    },
    {
        label: "PuzzGemRed",
    },
    {
        label: "PuzzMWeapon",
    },
    {
        label: "PuzzSkull",
    },
    {
        label: "QuestItem",
    },
    {
        label: "QuestItem1",
    },
    {
        label: "QuestItem10",
    },
    {
        label: "QuestItem11",
    },
    {
        label: "QuestItem12",
    },
    {
        label: "QuestItem13",
    },
    {
        label: "QuestItem14",
    },
    {
        label: "QuestItem15",
    },
    {
        label: "QuestItem16",
    },
    {
        label: "QuestItem17",
    },
    {
        label: "QuestItem18",
    },
    {
        label: "QuestItem19",
    },
    {
        label: "QuestItem2",
    },
    {
        label: "QuestItem20",
    },
    {
        label: "QuestItem21",
    },
    {
        label: "QuestItem22",
    },
    {
        label: "QuestItem23",
    },
    {
        label: "QuestItem24",
    },
    {
        label: "QuestItem25",
    },
    {
        label: "QuestItem26",
    },
    {
        label: "QuestItem27",
    },
    {
        label: "QuestItem28",
    },
    {
        label: "QuestItem29",
    },
    {
        label: "QuestItem3",
    },
    {
        label: "QuestItem30",
    },
    {
        label: "QuestItem31",
    },
    {
        label: "QuestItem4",
    },
    {
        label: "QuestItem5",
    },
    {
        label: "QuestItem6",
    },
    {
        label: "QuestItem7",
    },
    {
        label: "QuestItem8",
    },
    {
        label: "QuestItem9",
    },
    {
        label: "RainTracker",
    },
    {
        label: "ScoreItem",
    },
    {
        label: "EvilSceptre",
    },
    {
        label: "UnholyBible",
    },
    {
        label: "StateProvider",
    },
    {
        label: "CustomInventory",
    },
    {
        label: "ArtiBlastRadius",
    },
    {
        label: "ArtiBoostMana",
    },
    {
        label: "ArtiEgg",
    },
    {
        label: "ArtiPork",
    },
    {
        label: "Berserk",
    },
    {
        label: "Mana3",
    },
    {
        label: "Megasphere",
    },
    {
        label: "Weapon",
    },
    {
        label: "Beak",
    },
    {
        label: "BeakPowered",
    },
    {
        label: "Chainsaw",
    },
    {
        label: "SuperBootspork",
    },
    {
        label: "ClericWeapon",
    },
    {
        label: "CWeapFlame",
    },
    {
        label: "CWeapMace",
    },
    {
        label: "CWeapStaff",
    },
    {
        label: "CWeapWraithverge",
    },
    {
        label: "DoomWeapon",
    },
    {
        label: "BFG9000",
    },
    {
        label: "LAZDevice",
    },
    {
        label: "Chaingun",
    },
    {
        label: "RapidZorcher",
    },
    {
        label: "Pistol",
    },
    {
        label: "MiniZorcher",
    },
    {
        label: "PlasmaRifle",
    },
    {
        label: "PhasingZorcher",
    },
    {
        label: "RocketLauncher",
    },
    {
        label: "ZorchPropulsor",
    },
    {
        label: "Shotgun",
    },
    {
        label: "LargeZorcher",
    },
    {
        label: "SuperShotgun",
    },
    {
        label: "SuperLargeZorcher",
    },
    {
        label: "FighterWeapon",
    },
    {
        label: "FWeapAxe",
    },
    {
        label: "FWeapFist",
    },
    {
        label: "FWeapHammer",
    },
    {
        label: "FWeapQuietus",
    },
    {
        label: "Fist",
    },
    {
        label: "Bootspoon",
    },
    {
        label: "Gauntlets",
    },
    {
        label: "GauntletsPowered",
    },
    {
        label: "HereticWeapon",
    },
    {
        label: "Blaster",
    },
    {
        label: "BlasterPowered",
    },
    {
        label: "Crossbow",
    },
    {
        label: "CrossbowPowered",
    },
    {
        label: "GoldWand",
    },
    {
        label: "GoldWandPowered",
    },
    {
        label: "Mace",
    },
    {
        label: "MacePowered",
    },
    {
        label: "SkullRod",
    },
    {
        label: "SkullRodPowered",
    },
    {
        label: "Staff",
    },
    {
        label: "StaffPowered",
    },
    {
        label: "MageWeapon",
    },
    {
        label: "MWeapBloodscourge",
    },
    {
        label: "MWeapFrost",
    },
    {
        label: "MWeapLightning",
    },
    {
        label: "MWeapWand",
    },
    {
        label: "PhoenixRod",
    },
    {
        label: "PhoenixRodPowered",
    },
    {
        label: "Sigil",
    },
    {
        label: "Sigil1",
    },
    {
        label: "Sigil2",
    },
    {
        label: "Sigil3",
    },
    {
        label: "Sigil4",
    },
    {
        label: "Sigil5",
    },
    {
        label: "Snout",
    },
    {
        label: "StrifeWeapon",
    },
    {
        label: "AssaultGun",
    },
    {
        label: "FlameThrower",
    },
    {
        label: "Mauler",
    },
    {
        label: "Mauler2",
    },
    {
        label: "MiniMissileLauncher",
    },
    {
        label: "PunchDagger",
    },
    {
        label: "StrifeCrossbow",
    },
    {
        label: "StrifeCrossbow2",
    },
    {
        label: "StrifeGrenadeLauncher",
    },
    {
        label: "StrifeGrenadeLauncher2",
    },
    {
        label: "WeaponGiver",
    },
    {
        label: "AssaultGunStanding",
    },
    {
        label: "SVEBlueChalice",
    },
    {
        label: "SVEFlagSpotBlue",
    },
    {
        label: "SVEFlagSpotRed",
    },
    {
        label: "SVETalismanPowerup",
    },
    {
        label: "SVETalismanRed",
    },
    {
        label: "SVETalismanBlue",
    },
    {
        label: "SVETalismanGreen",
    },
    {
        label: "TeleporterBeacon",
    },
    {
        label: "WeaponHolder",
    },
    {
        label: "WeaponPiece",
    },
    {
        label: "ClericWeaponPiece",
    },
    {
        label: "CWeaponPiece1",
    },
    {
        label: "CWeaponPiece2",
    },
    {
        label: "CWeaponPiece3",
    },
    {
        label: "FighterWeaponPiece",
    },
    {
        label: "FWeaponPiece1",
    },
    {
        label: "FWeaponPiece2",
    },
    {
        label: "FWeaponPiece3",
    },
    {
        label: "MageWeaponPiece",
    },
    {
        label: "MWeaponPiece1",
    },
    {
        label: "MWeaponPiece2",
    },
    {
        label: "MWeaponPiece3",
    },
    {
        label: "InvisibleBridge",
    },
    {
        label: "InvisibleBridge16",
    },
    {
        label: "InvisibleBridge32",
    },
    {
        label: "InvisibleBridge8",
    },
    {
        label: "Ironlich",
    },
    {
        label: "ItemFog",
    },
    {
        label: "KlaxonWarningLight",
    },
    {
        label: "KneelingGuy",
    },
    {
        label: "Knight",
    },
    {
        label: "KnightGhost",
    },
    {
        label: "KnightAxe",
    },
    {
        label: "RedAxe",
    },
    {
        label: "Korax",
    },
    {
        label: "KoraxBolt",
    },
    {
        label: "KoraxSpirit",
    },
    {
        label: "LargeTorch",
    },
    {
        label: "LavaSmoke",
    },
    {
        label: "LavaSplash",
    },
    {
        label: "Leaf1",
    },
    {
        label: "Leaf2",
    },
    {
        label: "LeafSpawner",
    },
    {
        label: "LightBrownFluorescent",
    },
    {
        label: "LightGlobe",
    },
    {
        label: "LightGoldFluorescent",
    },
    {
        label: "Lightning",
    },
    {
        label: "LightningCeiling",
    },
    {
        label: "LightningFloor",
    },
    {
        label: "LightningZap",
    },
    {
        label: "LightSilverFluorescent",
    },
    {
        label: "LittleFly",
    },
    {
        label: "LiveStick",
    },
    {
        label: "Loremaster",
    },
    {
        label: "LoreShot",
    },
    {
        label: "LoreShot2",
    },
    {
        label: "LostSoul",
    },
    {
        label: "BetaSkull",
    },
    {
        label: "ChexSoul",
    },
    {
        label: "DeadLostSoul",
    },
    {
        label: "MaceFX1",
    },
    {
        label: "MaceFX2",
    },
    {
        label: "MaceFX3",
    },
    {
        label: "MaceFX4",
    },
    {
        label: "Macil1",
    },
    {
        label: "Macil2",
    },
    {
        label: "MageBoss",
    },
    {
        label: "MageStaffFX2",
    },
    {
        label: "MageWandSmoke",
    },
    {
        label: "MapMarker",
    },
    {
        label: "MapSpot",
    },
    {
        label: "FS_Mapspot",
    },
    {
        label: "MapSpotGravity",
    },
    {
        label: "MaulerPuff",
    },
    {
        label: "MaulerTorpedo",
    },
    {
        label: "MaulerTorpedoWave",
    },
    {
        label: "MBFHelperDog",
    },
    {
        label: "Meat",
    },
    {
        label: "Junk",
    },
    {
        label: "Meat2",
    },
    {
        label: "NonsolidMeat2",
    },
    {
        label: "Meat3",
    },
    {
        label: "NonsolidMeat3",
    },
    {
        label: "Meat4",
    },
    {
        label: "NonsolidMeat4",
    },
    {
        label: "Meat5",
    },
    {
        label: "NonsolidMeat5",
    },
    {
        label: "MediumTorch",
    },
    {
        label: "Merchant",
    },
    {
        label: "Armorer",
    },
    {
        label: "BarKeep",
    },
    {
        label: "Medic",
    },
    {
        label: "WeaponSmith",
    },
    {
        label: "MetalPot",
    },
    {
        label: "MiniMissile",
    },
    {
        label: "Minotaur",
    },
    {
        label: "MinotaurFriend",
    },
    {
        label: "MinotaurFX1",
    },
    {
        label: "MinotaurFX2",
    },
    {
        label: "MinotaurFX3",
    },
    {
        label: "MinotaurSmoke",
    },
    {
        label: "MinotaurSmokeExit",
    },
    {
        label: "MorphedMonster",
    },
    {
        label: "Chicken",
    },
    {
        label: "Pig",
    },
    {
        label: "MorphProjectile",
    },
    {
        label: "EggFX",
    },
    {
        label: "PorkFX",
    },
    {
        label: "Mug",
    },
    {
        label: "Mummy",
    },
    {
        label: "MummyGhost",
    },
    {
        label: "MummyLeader",
    },
    {
        label: "MummyLeaderGhost",
    },
    {
        label: "MummyFX1",
    },
    {
        label: "MummySoul",
    },
    {
        label: "Oracle",
    },
    {
        label: "OutsideLamp",
    },
    {
        label: "PainElemental",
    },
    {
        label: "PalmTree",
    },
    {
        label: "ParticleFountain",
    },
    {
        label: "BlackParticleFountain",
    },
    {
        label: "BlueParticleFountain",
    },
    {
        label: "GreenParticleFountain",
    },
    {
        label: "PurpleParticleFountain",
    },
    {
        label: "RedParticleFountain",
    },
    {
        label: "WhiteParticleFountain",
    },
    {
        label: "YellowParticleFountain",
    },
    {
        label: "PathFollower",
    },
    {
        label: "ActorMover",
    },
    {
        label: "MovingCamera",
    },
    {
        label: "PatrolPoint",
    },
    {
        label: "PatrolSpecial",
    },
    {
        label: "PhoenixFX1",
    },
    {
        label: "PhoenixFX2",
    },
    {
        label: "PhoenixPuff",
    },
    {
        label: "PhosphorousFire",
    },
    {
        label: "PhosphorousGrenade",
    },
    {
        label: "PickupFlash",
    },
    {
        label: "PileOfGuts",
    },
    {
        label: "PillarAlienPower",
    },
    {
        label: "PillarAztec",
    },
    {
        label: "PillarAztecDamaged",
    },
    {
        label: "PillarAztecRuined",
    },
    {
        label: "PillarHugeTech",
    },
    {
        label: "PillarTechno",
    },
    {
        label: "Piston",
    },
    {
        label: "Pitcher",
    },
    {
        label: "PlasmaBall",
    },
    {
        label: "PhaseZorchMissile",
    },
    {
        label: "PlasmaBall1",
    },
    {
        label: "PlasmaBall2",
    },
    {
        label: "PlayerPawn",
    },
    {
        label: "ChickenPlayer",
    },
    {
        label: "ClericPlayer",
    },
    {
        label: "DoomPlayer",
    },
    {
        label: "ChexPlayer",
    },
    {
        label: "FighterPlayer",
    },
    {
        label: "HereticPlayer",
    },
    {
        label: "MagePlayer",
    },
    {
        label: "PigPlayer",
    },
    {
        label: "PlayerChunk",
    },
    {
        label: "BloodyFighterSkull",
    },
    {
        label: "BloodySkull",
    },
    {
        label: "IceChunkHead",
    },
    {
        label: "StrifePlayer",
    },
    {
        label: "PlayerSpeedTrail",
    },
    {
        label: "Pod",
    },
    {
        label: "PodGenerator",
    },
    {
        label: "PodGoo",
    },
    {
        label: "PointPuller",
    },
    {
        label: "PointPusher",
    },
    {
        label: "PoisonBag",
    },
    {
        label: "ZPoisonShroom",
    },
    {
        label: "PoisonBolt",
    },
    {
        label: "PoisonCloud",
    },
    {
        label: "PoleLantern",
    },
    {
        label: "Pot",
    },
    {
        label: "PottedTree",
    },
    {
        label: "Pottery1",
    },
    {
        label: "Pottery2",
    },
    {
        label: "Pottery3",
    },
    {
        label: "PotteryBit",
    },
    {
        label: "PowerCoupling",
    },
    {
        label: "PowerCrystal",
    },
    {
        label: "Programmer",
    },
    {
        label: "ProgrammerBase",
    },
    {
        label: "ProjectileBlade",
    },
    {
        label: "Puffy",
    },
    {
        label: "PunchPuff",
    },
    {
        label: "QuietusDrop",
    },
    {
        label: "RainPillar",
    },
    {
        label: "RandomSpawner",
    },
    {
        label: "RatBuddy",
    },
    {
        label: "RealGibs",
    },
    {
        label: "Gibs",
    },
    {
        label: "Reaver",
    },
    {
        label: "RebelBoots",
    },
    {
        label: "RebelHelmet",
    },
    {
        label: "RebelShirt",
    },
    {
        label: "RedTorch",
    },
    {
        label: "Revenant",
    },
    {
        label: "StealthRevenant",
    },
    {
        label: "RevenantTracer",
    },
    {
        label: "RevenantTracerSmoke",
    },
    {
        label: "Ripper",
    },
    {
        label: "RipperBall",
    },
    {
        label: "Rock1",
    },
    {
        label: "Rock2",
    },
    {
        label: "Rock3",
    },
    {
        label: "Rocket",
    },
    {
        label: "PropulsorMissile",
    },
    {
        label: "RocketSmokeTrail",
    },
    {
        label: "RocketTrail",
    },
    {
        label: "Rubble1",
    },
    {
        label: "Rubble2",
    },
    {
        label: "Rubble3",
    },
    {
        label: "Rubble4",
    },
    {
        label: "Rubble5",
    },
    {
        label: "Rubble6",
    },
    {
        label: "Rubble7",
    },
    {
        label: "Rubble8",
    },
    {
        label: "SacrificedGuy",
    },
    {
        label: "ScriptedMarine",
    },
    {
        label: "MarineBFG",
    },
    {
        label: "MarineChaingun",
    },
    {
        label: "MarineChainsaw",
    },
    {
        label: "MarineFist",
    },
    {
        label: "MarineBerserk",
    },
    {
        label: "MarineRocket",
    },
    {
        label: "MarinePistol",
    },
    {
        label: "MarinePlasma",
    },
    {
        label: "MarineRailgun",
    },
    {
        label: "MarineShotgun",
    },
    {
        label: "MarineSSG",
    },
    {
        label: "SecretTrigger",
    },
    {
        label: "SectorAction",
    },
    {
        label: "MusicChanger",
    },
    {
        label: "SecActDamage3D",
    },
    {
        label: "SecActDamageCeiling",
    },
    {
        label: "SecActDamageFloor",
    },
    {
        label: "SecActDeath3D",
    },
    {
        label: "SecActDeathCeiling",
    },
    {
        label: "SecActDeathFloor",
    },
    {
        label: "SecActEnter",
    },
    {
        label: "SecActExit",
    },
    {
        label: "SecActEyesAboveC",
    },
    {
        label: "SecActEyesBelowC",
    },
    {
        label: "SecActEyesDive",
    },
    {
        label: "SecActEyesSurface",
    },
    {
        label: "SecActHitCeil",
    },
    {
        label: "SecActHitFakeFloor",
    },
    {
        label: "SecActHitFloor",
    },
    {
        label: "SecActUse",
    },
    {
        label: "SecActUseWall",
    },
    {
        label: "SectorFlagSetter",
    },
    {
        label: "SectorSilencer",
    },
    {
        label: "SecurityCamera",
    },
    {
        label: "AimingCamera",
    },
    {
        label: "Sentinel",
    },
    {
        label: "SentinelFX1",
    },
    {
        label: "SentinelFX2",
    },
    {
        label: "Serpent",
    },
    {
        label: "SerpentLeader",
    },
    {
        label: "SerpentFX",
    },
    {
        label: "SerpentGib1",
    },
    {
        label: "SerpentGib2",
    },
    {
        label: "SerpentGib3",
    },
    {
        label: "SerpentHead",
    },
    {
        label: "ShortBlueTorch",
    },
    {
        label: "ChexLightColumn",
    },
    {
        label: "ShortBush",
    },
    {
        label: "ShortGreenColumn",
    },
    {
        label: "ChexSubmergedPlant",
    },
    {
        label: "ShortGreenTorch",
    },
    {
        label: "ChexCivilian2",
    },
    {
        label: "ShortRedColumn",
    },
    {
        label: "ChexMineCart",
    },
    {
        label: "ShortRedTorch",
    },
    {
        label: "ChexCivilian3",
    },
    {
        label: "ShotgunGuy",
    },
    {
        label: "DeadShotgunGuy",
    },
    {
        label: "FlemoidusBipedicus",
    },
    {
        label: "StealthShotgunGuy",
    },
    {
        label: "SigilBanner",
    },
    {
        label: "SkullColumn",
    },
    {
        label: "ChexFlagOnPole",
    },
    {
        label: "SkyPicker",
    },
    {
        label: "SkyViewpoint",
    },
    {
        label: "SkyCamCompat",
    },
    {
        label: "StackPoint",
    },
    {
        label: "LowerStackLookOnly",
    },
    {
        label: "UpperStackLookOnly",
    },
    {
        label: "SlimeChunk",
    },
    {
        label: "SlimeSplash",
    },
    {
        label: "SludgeChunk",
    },
    {
        label: "SludgeSplash",
    },
    {
        label: "SmallBloodPool",
    },
    {
        label: "SmallTorchLit",
    },
    {
        label: "SmallTorchUnlit",
    },
    {
        label: "Snake",
    },
    {
        label: "SnakeProjA",
    },
    {
        label: "SnakeProjB",
    },
    {
        label: "SnoutPuff",
    },
    {
        label: "SorcBall",
    },
    {
        label: "SorcBall1",
    },
    {
        label: "SorcBall2",
    },
    {
        label: "SorcBall3",
    },
    {
        label: "Sorcerer1",
    },
    {
        label: "Sorcerer2",
    },
    {
        label: "Sorcerer2FX1",
    },
    {
        label: "Sorcerer2FX2",
    },
    {
        label: "Sorcerer2FXSpark",
    },
    {
        label: "Sorcerer2Telefade",
    },
    {
        label: "SorcererFX1",
    },
    {
        label: "SorcFX1",
    },
    {
        label: "SorcFX2",
    },
    {
        label: "SorcFX2T1",
    },
    {
        label: "SorcFX3",
    },
    {
        label: "SorcFX3Explosion",
    },
    {
        label: "SorcFX4",
    },
    {
        label: "SorcSpark1",
    },
    {
        label: "SoundEnvironment",
    },
    {
        label: "SoundSequence",
    },
    {
        label: "HereticSoundSequence1",
    },
    {
        label: "HereticSoundSequence10",
    },
    {
        label: "HereticSoundSequence2",
    },
    {
        label: "HereticSoundSequence3",
    },
    {
        label: "HereticSoundSequence4",
    },
    {
        label: "HereticSoundSequence5",
    },
    {
        label: "HereticSoundSequence6",
    },
    {
        label: "HereticSoundSequence7",
    },
    {
        label: "HereticSoundSequence8",
    },
    {
        label: "HereticSoundSequence9",
    },
    {
        label: "SoundSequenceSlot",
    },
    {
        label: "SoundWaterfall",
    },
    {
        label: "SoundWind",
    },
    {
        label: "SoundWindHexen",
    },
    {
        label: "Spark",
    },
    {
        label: "SpawnFire",
    },
    {
        label: "SpawnShot",
    },
    {
        label: "SpecialSpot",
    },
    {
        label: "BossSpot",
    },
    {
        label: "BossTarget",
    },
    {
        label: "MaceSpawner",
    },
    {
        label: "SpectralLightningBase",
    },
    {
        label: "SpectralLightningBall1",
    },
    {
        label: "SpectralLightningBall2",
    },
    {
        label: "SpectralLightningDeath1",
    },
    {
        label: "SpectralLightningBigV1",
    },
    {
        label: "SpectralLightningBigV2",
    },
    {
        label: "SpectralLightningSpot",
    },
    {
        label: "SpectralLightningDeath2",
    },
    {
        label: "SpectralLightningBigBall1",
    },
    {
        label: "SpectralLightningBigBall2",
    },
    {
        label: "SpectralLightningDeathShort",
    },
    {
        label: "SpectralLightningV1",
    },
    {
        label: "SpectralLightningV2",
    },
    {
        label: "SpectralLightningH1",
    },
    {
        label: "SpectralLightningH2",
    },
    {
        label: "SpectralLightningH3",
    },
    {
        label: "SpectralLightningHTail",
    },
    {
        label: "SpectralMonster",
    },
    {
        label: "AlienSpectre1",
    },
    {
        label: "AlienSpectre2",
    },
    {
        label: "AlienSpectre3",
    },
    {
        label: "AlienSpectre4",
    },
    {
        label: "AlienSpectre5",
    },
    {
        label: "EntityBoss",
    },
    {
        label: "EntitySecond",
    },
    {
        label: "SpiderMastermind",
    },
    {
        label: "SRock1",
    },
    {
        label: "SRock2",
    },
    {
        label: "SRock3",
    },
    {
        label: "SRock4",
    },
    {
        label: "SStalactiteBig",
    },
    {
        label: "SStalactiteSmall",
    },
    {
        label: "SStalagmiteBig",
    },
    {
        label: "SStalagmiteSmall",
    },
    {
        label: "StaffPuff",
    },
    {
        label: "BeakPuff",
    },
    {
        label: "StaffPuff2",
    },
    {
        label: "Stalagmite",
    },
    {
        label: "Stalagtite",
    },
    {
        label: "ChexAppleTree",
    },
    {
        label: "Stalker",
    },
    {
        label: "Statue",
    },
    {
        label: "StatueRuined",
    },
    {
        label: "StickInWater",
    },
    {
        label: "Stool",
    },
    {
        label: "StrifeBishop",
    },
    {
        label: "StrifeBurningBarrel",
    },
    {
        label: "StrifeCandelabra",
    },
    {
        label: "StrifeHumanoid",
    },
    {
        label: "Acolyte",
    },
    {
        label: "AcolyteBlue",
    },
    {
        label: "AcolyteDGreen",
    },
    {
        label: "AcolyteGold",
    },
    {
        label: "AcolyteGray",
    },
    {
        label: "AcolyteLGreen",
    },
    {
        label: "AcolyteRed",
    },
    {
        label: "AcolyteRust",
    },
    {
        label: "AcolyteShadow",
    },
    {
        label: "AcolyteTan",
    },
    {
        label: "AcolyteToBe",
    },
    {
        label: "Beggar",
    },
    {
        label: "Beggar1",
    },
    {
        label: "Beggar2",
    },
    {
        label: "Beggar3",
    },
    {
        label: "Beggar4",
    },
    {
        label: "Beggar5",
    },
    {
        label: "Peasant",
    },
    {
        label: "Peasant1",
    },
    {
        label: "Peasant10",
    },
    {
        label: "Peasant11",
    },
    {
        label: "Peasant12",
    },
    {
        label: "Peasant13",
    },
    {
        label: "Peasant14",
    },
    {
        label: "Peasant15",
    },
    {
        label: "Peasant16",
    },
    {
        label: "Peasant17",
    },
    {
        label: "Peasant18",
    },
    {
        label: "Peasant19",
    },
    {
        label: "Peasant2",
    },
    {
        label: "Peasant20",
    },
    {
        label: "Peasant21",
    },
    {
        label: "Peasant22",
    },
    {
        label: "Peasant3",
    },
    {
        label: "Peasant4",
    },
    {
        label: "Peasant5",
    },
    {
        label: "Peasant6",
    },
    {
        label: "Peasant7",
    },
    {
        label: "Peasant8",
    },
    {
        label: "Peasant9",
    },
    {
        label: "Rebel",
    },
    {
        label: "Rebel1",
    },
    {
        label: "Rebel2",
    },
    {
        label: "Rebel3",
    },
    {
        label: "Rebel4",
    },
    {
        label: "Rebel5",
    },
    {
        label: "Rebel6",
    },
    {
        label: "Zombie",
    },
    {
        label: "StrifePuff",
    },
    {
        label: "MiniMissilePuff",
    },
    {
        label: "StrifeSpark",
    },
    {
        label: "SummoningDoll",
    },
    {
        label: "SurgeryCrab",
    },
    {
        label: "SVEOreSpawner",
    },
    {
        label: "SwitchableDecoration",
    },
    {
        label: "BatSpawner",
    },
    {
        label: "FlameLarge",
    },
    {
        label: "FlameLarge2",
    },
    {
        label: "FlameSmall",
    },
    {
        label: "FlameSmall2",
    },
    {
        label: "SwitchingDecoration",
    },
    {
        label: "ZGemPedestal",
    },
    {
        label: "ZWingedStatueNoSkull",
    },
    {
        label: "ZCauldron",
    },
    {
        label: "ZCauldronUnlit",
    },
    {
        label: "ZFireBull",
    },
    {
        label: "ZFireBullUnlit",
    },
    {
        label: "ZTwinedTorch",
    },
    {
        label: "ZTwinedTorchUnlit",
    },
    {
        label: "ZWallTorch",
    },
    {
        label: "ZWallTorchUnlit",
    },
    {
        label: "TableShit1",
    },
    {
        label: "TableShit10",
    },
    {
        label: "TableShit2",
    },
    {
        label: "TableShit3",
    },
    {
        label: "TableShit4",
    },
    {
        label: "TableShit5",
    },
    {
        label: "TableShit6",
    },
    {
        label: "TableShit7",
    },
    {
        label: "TableShit8",
    },
    {
        label: "TableShit9",
    },
    {
        label: "TallBush",
    },
    {
        label: "TallGreenColumn",
    },
    {
        label: "ChexCavernStalagmite",
    },
    {
        label: "TallRedColumn",
    },
    {
        label: "ChexCavernColumn",
    },
    {
        label: "Tank1",
    },
    {
        label: "Tank2",
    },
    {
        label: "Tank3",
    },
    {
        label: "Tank4",
    },
    {
        label: "Tank5",
    },
    {
        label: "Tank6",
    },
    {
        label: "TargetPractice",
    },
    {
        label: "TechLamp",
    },
    {
        label: "TechLamp2",
    },
    {
        label: "TechLampBrass",
    },
    {
        label: "TechLampSilver",
    },
    {
        label: "TechPillar",
    },
    {
        label: "ChexSpaceship",
    },
    {
        label: "TeleGlitter1",
    },
    {
        label: "TeleGlitter2",
    },
    {
        label: "TeleGlitterGenerator1",
    },
    {
        label: "TeleGlitterGenerator2",
    },
    {
        label: "TeleportDest",
    },
    {
        label: "TeleportDest2",
    },
    {
        label: "TeleportDest3",
    },
    {
        label: "TeleportFog",
    },
    {
        label: "TeleportSwirl",
    },
    {
        label: "TeleSmoke",
    },
    {
        label: "TelOtherFX1",
    },
    {
        label: "TelOtherFX2",
    },
    {
        label: "TelOtherFX3",
    },
    {
        label: "TelOtherFX4",
    },
    {
        label: "TelOtherFX5",
    },
    {
        label: "Templar",
    },
    {
        label: "ThrowingBomb",
    },
    {
        label: "ThrustFloor",
    },
    {
        label: "ThrustFloorDown",
    },
    {
        label: "ThrustFloorUp",
    },
    {
        label: "TorchTree",
    },
    {
        label: "ChexOrangeTree",
    },
    {
        label: "Tray",
    },
    {
        label: "TreeDestructible",
    },
    {
        label: "TreeStub",
    },
    {
        label: "Tub",
    },
    {
        label: "Unknown",
    },
    {
        label: "SpeakerIcon",
    },
    {
        label: "Volcano",
    },
    {
        label: "VolcanoBlast",
    },
    {
        label: "VolcanoTBlast",
    },
    {
        label: "WaterBottle",
    },
    {
        label: "WaterDrip",
    },
    {
        label: "WaterDropOnFloor",
    },
    {
        label: "WaterfallSplash",
    },
    {
        label: "WaterFountain",
    },
    {
        label: "WaterSplash",
    },
    {
        label: "WaterSplashBase",
    },
    {
        label: "WaterZone",
    },
    {
        label: "Whirlwind",
    },
    {
        label: "Wizard",
    },
    {
        label: "WizardFX1",
    },
    {
        label: "WolfensteinSS",
    },
    {
        label: "WoodenBarrel",
    },
    {
        label: "Wraith",
    },
    {
        label: "WraithBuried",
    },
    {
        label: "WraithFX1",
    },
    {
        label: "WraithFX2",
    },
    {
        label: "WraithFX3",
    },
    {
        label: "WraithFX4",
    },
    {
        label: "WraithFX5",
    },
    {
        label: "WraithvergeDrop",
    },
    {
        label: "ZArmorChunk",
    },
    {
        label: "ZBannerTattered",
    },
    {
        label: "ZBarrel",
    },
    {
        label: "ZBell",
    },
    {
        label: "ZBlueCandle",
    },
    {
        label: "ZBucket",
    },
    {
        label: "ZCandle",
    },
    {
        label: "ZChainBit32",
    },
    {
        label: "ZChainBit64",
    },
    {
        label: "ZChainEndHeart",
    },
    {
        label: "ZChainEndHook1",
    },
    {
        label: "ZChainEndHook2",
    },
    {
        label: "ZChainEndSkull",
    },
    {
        label: "ZChainEndSpike",
    },
    {
        label: "ZChandelier",
    },
    {
        label: "ZChandelierUnlit",
    },
    {
        label: "ZCorpseHanging",
    },
    {
        label: "ZCorpseKabob",
    },
    {
        label: "ZCorpseLynched",
    },
    {
        label: "ZCorpseLynchedNoHeart",
    },
    {
        label: "ZCorpseSitting",
    },
    {
        label: "ZCorpseSleeping",
    },
    {
        label: "ZIronMaiden",
    },
    {
        label: "ZLog",
    },
    {
        label: "ZMossCeiling1",
    },
    {
        label: "ZMossCeiling2",
    },
    {
        label: "ZombieMan",
    },
    {
        label: "DeadZombieMan",
    },
    {
        label: "FlemoidusCommonus",
    },
    {
        label: "StealthZombieMan",
    },
    {
        label: "ZombieSpawner",
    },
    {
        label: "ZRock1",
    },
    {
        label: "ZRock2",
    },
    {
        label: "ZRock3",
    },
    {
        label: "ZRock4",
    },
    {
        label: "ZRockBlack",
    },
    {
        label: "ZRockBrown1",
    },
    {
        label: "ZRockBrown2",
    },
    {
        label: "ZRubble1",
    },
    {
        label: "ZRubble2",
    },
    {
        label: "ZRubble3",
    },
    {
        label: "ZShroomLarge1",
    },
    {
        label: "ZShroomLarge2",
    },
    {
        label: "ZShroomLarge3",
    },
    {
        label: "ZShroomSmall1",
    },
    {
        label: "ZShroomSmall2",
    },
    {
        label: "ZShroomSmall3",
    },
    {
        label: "ZShroomSmall4",
    },
    {
        label: "ZShroomSmall5",
    },
    {
        label: "ZShrub1",
    },
    {
        label: "ZShrub2",
    },
    {
        label: "ZStalactiteIceLarge",
    },
    {
        label: "ZStalactiteIceMedium",
    },
    {
        label: "ZStalactiteIceSmall",
    },
    {
        label: "ZStalactiteIceTiny",
    },
    {
        label: "ZStalactiteLarge",
    },
    {
        label: "ZStalactiteMedium",
    },
    {
        label: "ZStalactiteSmall",
    },
    {
        label: "ZStalagmiteIceLarge",
    },
    {
        label: "ZStalagmiteIceMedium",
    },
    {
        label: "ZStalagmiteIceSmall",
    },
    {
        label: "ZStalagmiteIceTiny",
    },
    {
        label: "ZStalagmiteLarge",
    },
    {
        label: "ZStalagmiteMedium",
    },
    {
        label: "ZStalagmitePillar",
    },
    {
        label: "ZStalagmiteSmall",
    },
    {
        label: "ZStatueGargoyleBlueShort",
    },
    {
        label: "ZStatueGargoyleBlueTall",
    },
    {
        label: "ZStatueGargoyleDarkRedShort",
    },
    {
        label: "ZStatueGargoyleDarkRedTall",
    },
    {
        label: "ZStatueGargoyleGreenShort",
    },
    {
        label: "ZStatueGargoyleGreenTall",
    },
    {
        label: "ZStatueGargoyleRedShort",
    },
    {
        label: "ZStatueGargoyleRedTall",
    },
    {
        label: "ZStatueGargoyleRustShort",
    },
    {
        label: "ZStatueGargoyleRustTall",
    },
    {
        label: "ZStatueGargoyleStripeTall",
    },
    {
        label: "ZStatueGargoyleTanShort",
    },
    {
        label: "ZStatueGargoyleTanTall",
    },
    {
        label: "ZStumpBare",
    },
    {
        label: "ZStumpBurned",
    },
    {
        label: "ZStumpSwamp1",
    },
    {
        label: "ZStumpSwamp2",
    },
    {
        label: "ZSuitOfArmor",
    },
    {
        label: "ZSwampVine",
    },
    {
        label: "ZTombstoneBigCross",
    },
    {
        label: "ZTombstoneBrianP",
    },
    {
        label: "ZTombstoneBrianR",
    },
    {
        label: "ZTombstoneCrossCircle",
    },
    {
        label: "ZTombstoneRIP",
    },
    {
        label: "ZTombstoneShane",
    },
    {
        label: "ZTombstoneSmallCross",
    },
    {
        label: "ZTree",
    },
    {
        label: "ZTreeDead",
    },
    {
        label: "ZTreeGnarled1",
    },
    {
        label: "ZTreeGnarled2",
    },
    {
        label: "ZTreeLarge1",
    },
    {
        label: "ZTreeLarge2",
    },
    {
        label: "ZTreeSwamp120",
    },
    {
        label: "ZTreeSwamp150",
    },
    {
        label: "ZVasePillar",
    },
    {
        label: "ZWingedStatue",
    },
    {
        label: "ZXmasTree",
    },
    {
        label: "SectorEffect",
    },
    {
        label: "Lighting",
    },
    {
        label: "Mover",
    },
    {
        label: "MovingCeiling",
    },
    {
        label: "Ceiling",
    },
    {
        label: "MovingFloor",
    },
    {
        label: "Floor",
    },
    {
        label: "ThinkerIterator",
    },
];

export interface ZScriptStruct extends ZScriptType {
    parameters?: ZScriptVariable[];
}

export const structs: ZScriptStruct[] = [
    {
        label: "Struct",
    },
    {
        label: "AutoUseHealthInfo",
    },
    {
        label: "Console",
    },
    {
        label: "ConsoleEvent",
    },
    {
        label: "CVar",
    },
    {
        label: "DamageTypeDefinition",
    },
    {
        label: "DehInfo",
    },
    {
        label: "Destructible",
    },
    {
        label: "DropItem",
    },
    {
        label: "DynArray_F32",
    },
    {
        label: "DynArray_F64",
    },
    {
        label: "DynArray_I16",
    },
    {
        label: "DynArray_I32",
    },
    {
        label: "DynArray_I8",
    },
    {
        label: "DynArray_Obj",
    },
    {
        label: "DynArray_Ptr",
    },
    {
        label: "DynArray_String",
    },
    {
        label: "F3DFloor",
    },
    {
        label: "FCheckPosition",
    },
    {
        label: "FColormap",
    },
    {
        label: "FLineTraceData",
    },
    {
        label: "Font",
    },
    {
        label: "FOptionMenuSettings",
    },
    {
        label: "FRailParams",
    },
    {
        label: "FStateParamInfo",
    },
    {
        label: "FTranslatedLineTarget",
    },
    {
        label: "GameInfoStruct",
    },
    {
        label: "GIFont",
    },
    {
        label: "HealthGroup",
    },
    {
        label: "InputEvent",
    },
    {
        label: "JoystickConfig",
    },
    {
        label: "KeyBindings",
    },
    {
        label: "LevelLocals",
    },
    {
        label: "Line",
    },
    {
        label: "LinkContext",
    },
    {
        label: "LookExParams",
    },
    {
        label: "MugShot",
    },
    {
        label: "MusPlayingInfo",
    },
    {
        label: "OptionValues",
    },
    {
        label: "PatchInfo",
    },
    {
        label: "PlayerClass",
    },
    {
        label: "PlayerEvent",
    },
    {
        label: "PlayerInfo",
    },
    {
        label: "PlayerSkin",
    },
    {
        label: "RenderEvent",
    },
    {
        label: "ReplacedEvent",
    },
    {
        label: "ReplaceEvent",
    },
    {
        label: "SavegameManager",
    },
    {
        label: "SaveGameNode",
    },
    {
        label: "SBarInfo",
    },
    {
        label: "Screen",
    },
    {
        label: "SecPlane",
    },
    {
        label: "SecSpecial",
    },
    {
        label: "Sector",
    },
    {
        label: "SectorPortal",
    },
    {
        label: "Shader",
    },
    {
        label: "Side",
    },
    {
        label: "State",
    },
    {
        label: "StrifeDialogueNode",
    },
    {
        label: "StrifeDialogueReply",
    },
    {
        label: "StringStruct",
    },
    {
        label: "StringTable",
    },
    {
        label: "Team",
    },
    {
        label: "TerrainDef",
    },
    {
        label: "TexMan",
    },
    {
        label: "TraceResults",
    },
    {
        label: "Translation",
    },
    {
        label: "UiEvent",
    },
    {
        label: "UserCmd",
    },
    {
        label: "Vertex",
    },
    {
        label: "VisStyle",
    },
    {
        label: "Wads",
    },
    {
        label: "WBPlayerStruct",
    },
    {
        label: "WBStartStruct",
    },
    {
        label: "WeaponSlots",
    },
    {
        label: "WorldEvent",
    },
];

export interface ZScriptFunction extends ZScriptType {
    arguments?: ZScriptVariable[];
}

export interface ZScriptVariable extends ZScriptType {
    type?: string;
    value?: unknown;
    parameters?: ZScriptVariable[],
    modifiers?: string[]
}