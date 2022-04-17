// Copyright (c) 2022 PROPHESSOR
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { CompletionItemKind } from "vscode";
import { ACTOR_FLAGS } from "../common/ActorFlags";
import { ACTOR_METHODS } from "../common/ActorMethods";
import { explodeString, ICompletionTree, mapperFactory } from "../utils";
import { actorfunctions } from "./actorfunctions";
import { actorproperties } from "./actorproperties";
import { KEYWORDS } from "./Keywords";

const type = CompletionItemKind;

const globalValues: ICompletionTree[] = [
  // Built-in classes
  ...explodeString(type.Class, "PlayerPawn|Actor|Thinker|Object|super|target|CustomInventory|Inventory|Weapon|master|target|tracer"),

  // FIXME:
  // Actor flags
  ...ACTOR_FLAGS.map(mapperFactory(type.Value)),

  // FIXME:
  // Actor functions
  ...actorfunctions.map(mapperFactory(type.Function)),

  // Actor pointers
  { name: "AAPTR_DEFAULT", description: "The calling actor itself.", type: type.Property },
  { name: "AAPTR_NULL", description: "No actor at all (does nothing).", type: type.Property },
  { name: "AAPTR_TARGET", description: "The calling actor's target, if any.", type: type.Property },
  { name: "AAPTR_MASTER:", description: "The calling actor's master, if any.", type: type.Property },
  { name: "AAPTR_TRACER:", description: "The calling actor's tracer, if any.", type: type.Property },
  { name: "AAPTR_FRIENDPLAYER", description: "Access the actor's FRIENDPLAYER pointer.", type: type.Property },
  { name: "AAPTR_GET_LINETARGET", description: "Get the actor in the line of sight. This is similar to AAPTR_PLAYER_GETTARGET above, except it is used for non-player actors.", type: type.Property },
  { name: "AAPTR_LINETARGET", description: "AAPTR_GET_LINETARGET is identified as AAPTR_LINETARGET in DECORATE.", type: type.Property },
  { name: "AAPTR_DEFAULT", description: "The calling actor itself", type: type.Property },

  // Actor functions
  { name: "GetRenderStyle", description: "Returns the render style of the calling actor, which can be one of the following:\n\tSTYLE_None\n\tSTYLE_Normal\n\tSTYLE_Fuzzy\n\tSTYLE_SoulTrans\n\tSTYLE_OptFuzzy\n\tSTYLE_Stencil\n\tSTYLE_Translucent\n\tSTYLE_Add\n\tSTYLE_Shaded\n\tSTYLE_TranslucentStencil\n\tSTYLE_Shadow\n\tSTYLE_Subtract\n\tSTYLE_AddStencil\n\tSTYLE_AddShaded", type: type.Function },
  { name: "CheckProximity", description: "For flags use CPXF_* constants.", type: type.Function },
  { name: "PlayActiveSound", description: "Plays the active sound of the actor. The sound is played on the voice channel with no attenuation if the FULLVOLACTIVE flag is set on the actor, or with idle attenuation otherwise. The function does nothing if a sound is already playing on that channel, regardless of the means by which it was originally played.", type: type.Function },

  // Render constants
  ...explodeString(type.Constant, "STYLE_None|STYLE_Normal|STYLE_Fuzzy|STYLE_SoulTrans|STYLE_OptFuzzy|STYLE_Stencil|STYLE_Translucent|STYLE_Add|STYLE_Shaded|STYLE_TranslucentStencil|STYLE_Shadow|STYLE_Subtract|STYLE_AddStencil|STYLE_AddShaded"),

  // Aim flags
  ...explodeString(type.Constant, "CMF_AIMOFFSET|CMF_AIMDIRECTION|CMF_TRACKOWNER|CMF_CHECKTARGETDEAD|CMF_ABSOLUTEPITCH|CMF_OFFSETPITCH|CMF_SAVEPITCH|CMF_ABSOLUTEANGLE|CMF_BADPITCH"),

  // Actor properties
  ...actorproperties.map(mapperFactory(type.Property)),

  // Actor methods
  ...ACTOR_METHODS.map(mapperFactory(type.Function)),

  // A_Remove flags
  ...explodeString(type.Constant, "RMVF_MISSILES|RMVF_NOMONSTERS|RMVF_MISC|RMVF_EVERYTHING|RMVF_EXFILTER|RMVF_EXSPECIES|RMVF_EITHER"),

  // Chase flags
  ...explodeString(type.Constant, "CHF_NORANDOMTURN|CHF_NODIRECTIONTURN|CHF_STOPIFBLOCKED|CHF_DONTTURN"),

  // Proximity flags
  ...explodeString(type.Constant, "CPXF_ANCESTOR|CPXF_NOZ|CPXF_CHECKSIGHT|CPXF_COUNTDEAD|CPXF_DEADONLY|CPXF_LESSOREQUAL|CPXF_EXACT|CPXF_SETTARGET|CPXF_SETMASTER|CPXF_SETTRACER|CPXF_FARTHEST|CPXF_CLOSEST|CPXF_SETONPTR"),

  // Sound flags
  ...explodeString(type.Constant, "ATTN_NONE|ATTN_NORM|ATTN_IDLE|ATTN_STATIC|CHAN_AUTO|CHAN_WEAPON|CHAN_VOICE|CHAN_ITEM|CHAN_BODY|CHAN_5|CHAN_6|CHAN_7|CHAN_LISTENERZ|CHAN_MAYBE_LOCAL|CHAN_UI|CHAN_NOPAUSE|CHAN_LOOP|CHAN_NOSTOP"),

  // Math functions
  { name: "atan2", description: "fixed VectorAngle(int x, int y)", docs: "Returns the fixed point angle of the vector (x,y). Angles are measured from the east and moving counterclockwise.\nThis function is more commonly known as atan2. To get the value of atan(x), use VectorAngle(1.0, x)", type: type.Function },
  { name: "Tan", description: "fixed Tan(int x)", type: type.Function },
  { name: "Ceil", description: "fixed Ceil(fixed value)", type: type.Function },
  { name: "Cos", description: "fixed Cos(int angle)", type: type.Function },
  { name: "FixedDiv", description: "fixed FixedDiv(int a, int b)", type: type.Function },
  { name: "FixedMul", description: "fixed FixedMul(int a, int b)", type: type.Function },
  { name: "Floor", description: "fixed Floor(fixed value)", type: type.Function },
  { name: "Random", description: "int Random(int min, int max)", type: type.Function },
  { name: "Round", description: "fixed Round(fixed value)", type: type.Function },
  { name: "Sin", description: "fixed Sin(int angle)", type: type.Function },
  { name: "Sqrt", description: "int Sqrt(int number)", type: type.Function },
  { name: "FixedSqrt", description: "fixed Sqrt(fixed number)", type: type.Function },
  { name: "StrLen", description: "int StrLen(str string)", type: type.Function },
  { name: "VectorAngle", description: "fixed VectorAngle(int x, int y)", type: type.Function },
  { name: "VectorLength", description: "int VectorLength(int x, int y)", type: type.Function },

  // Flags
  { name: "XF_HURTSOURCE", description: "Hurts the source: if set, the source can be damaged by the explosion. Note that the source is not necessarily the calling actor. This flag is set by default. By using other flags or, if none of the other flags is desired, passing 0 to flags, this flag can be cleared.", type: type.Property },
  { name: "XF_NOTMISSILE", description: "Not a missile: if set, the calling actor is considered to be the source. By default, the calling actor is assumed to be a projectile, and the source is therefore considered to be the calling actor's target.", type: type.Property },
  { name: "XF_EXPLICITDAMAGETYPE", description: "The damagetype parameter will never change to the actor's damage type.", type: type.Property },
  { name: "XF_NOSPLASH", description: "No splash: if set, the explosion does not create any terrain splashes.", type: type.Property },
  { name: "XF_THRUSTZ", description: "Apply vertical thrust: if set, the attack pushes the victim vertically, in addition to horizontally. Normally, vertical thrust is applied without the need of this flag, but it could be disabled by setting the compat_explode1 compatibility flag. This flag overrides the compatibility flag.", type: type.Property },

  /* FIXME: Move to separated logic */
  ...KEYWORDS,

  // State keywords
  ...explodeString(type.Keyword, "Bright|CanRaise|Fast|Light|NoDelay|Offset|Slow"),

  // States
  ...explodeString(type.Keyword, "Spawn|Idle|See|Melee|Missile|Pain|Death|Death.Sky|Death.Extreme|XDeath|Death.Fire|Burn|Death.Ice|Death.Disintegrate|Disintegrate|Raise|Heal|Crash|Crash.Extreme|Crush|Wound|Greetings|Yes|No|Active|Inactive|Bounce|Bounce.Floor|Bounce.Ceiling|Bounce.Wall|Bounce.Actor|Bounce.Actor.Creature"),

  /* // FIXME: */

  // Damage types
  ...explodeString(type.Constant, "MOD_ROCKET|MOD_R_SPLASH|MOD_PLASMARIFLE|MOD_BFG_BOOM|MOD_BFG_SPLASH|MOD_CHAINSAW|MOD_SSHOTGUN|MOD_WATER|MOD_SLIME|MOD_LAVA|MOD_CRUSH|MOD_TELEFRAG|MOD_CRUSH|MOD_FALLING|MOD_SUICIDE|MOD_BARREL|MOD_EXIT|MOD_SPLASH|MOD_RAILGUN|MOD_ICE|MOD_DISINTEGRATE|MOD_POISON|MOD_ELECTRIC"),
  { name: "MOD_UNKNOWN", docs: "The internal name for generic damage, as in \"no special reason\"", type: type.Constant },
  { name: "MOD_HIT", docs: "Default for melee attacks.", type: type.Constant },

  // Operators
  { name: "~==", docs: "~== is a case insensitive version of ==.", type: type.Operator },
  ...explodeString(type.Operator, "dot|cross"), // TODO: Check category

  // Data types
  ...explodeString(type.TypeParameter, "BlockThingsIterator|CVar|enum|Array|fixed|void|bool|double|float|int|int8|int16|uint|uint8|uint16|Vector2|Vector3|String|Name|Sound|StateLabel"),
  { name: "Color", docs: "Used to record a a color either defined in the X11R6RGB lump or a hexidecimal surrounded in double quotes, or a directly specified ARGB value.", type: type.TypeParameter },

  //
  { name: "\"Null\"", description: "(StateLabel) \"Null\"", docs: "\"Null\" should be used if the actor should be destroyed. Do not confuse this with null. Every actor has this state which will remove them upon making it there. This is safe to use when a jumping function is inside an if statement -- the actor will not be destroyed, since they are treated as booleans instead of actual jumps for testing purposes only.\nNOTE: StateLabels currently cannot be used in ternary operations, or convert to/from strings and/or names.", type: type.Constant },
  { name: "null", description: "(StateLabel) null", docs: "null should be used if an actor should not perform a jump. Do not use this when performing an action function within an if () statement as it will always fail.\nNOTE: StateLabels currently cannot be used in ternary operations, or convert to/from strings and/or names.", type: type.Constant },

  // Type modifiers
  ...explodeString(type.Keyword, "server|override|static|const|meta|out|in|version|virtual|native|ui|clearscope|virtualscope|play|property|prefix|action"),

  // Event handlers
  { name: "OnRegister", description: "void OnRegister()", docs: "Called when the engine registers your handler (adds it to the list). Initialization can be performed here.", type: type.Method },
  { name: "OnUnregister", description: "void OnUnregister()", docs: "Called when the engine removes your handler from the list.", type: type.Method },
  { name: "WorldLoaded", description: "void WorldLoaded(WorldEvent e)", docs: "IsSaveGame only works for StaticEventHandlers. By using this field you can detect that the current level was loaded from a saved game. IsReopen will be true when the player returns to the same map in a hub, similar to REOPEN ACS script type.", type: type.Method },
  { name: "WorldUnloaded", description: "void WorldUnloaded(WorldEvent e)", docs: "Called when the engine removes your handler from the list.", type: type.Method },
  { name: "WorldThingSpawned", description: "void WorldThingSpawned(WorldEvent e)", docs: "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed. Internally, WorldThingSpawned is called just after PostBeginPlay.", type: type.Method },
  { name: "WorldThingDied", description: "void WorldThingDied(WorldEvent e)", docs: "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed.  If Inflictor is not null, it is the actor that caused the damage that killed Thing. While the event does not provide a pointer to the source of the damage (killer), it, if not null, is stored in the target field of Thing.", type: type.Method },
  { name: "WorldThingRevived", description: "void WorldThingRevived(WorldEvent e)", docs: "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed.", type: type.Method },
  { name: "WorldThingDestroyed", description: "void WorldThingDestroyed(WorldEvent e) ", docs: "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed.", type: type.Method },
  { name: "WorldThingDamaged", description: "void WorldThingDamaged(WorldEvent e) ", docs: "Called", type: type.Method },
  { name: "WorldLineDamaged", description: "void WorldLineDamaged(WorldEvent e)", docs: "These events are called before dealing damage to a line or sector, which allows the events to manipulate the damage through Damage (raw damage) and NewDamage (damage after modification).\nData:\n\tActor DamageSource\n\tint Damage\n\tint NewDamage\n\tName DamageType\n\tvector3 DamagePosition\n\tbool DamageIsRadius\n\tLine DamageLine\n\tint DamageLineSide", type: type.Method },
  { name: "WorldSectorDamaged", description: " void WorldSectorDamaged(WorldEvent e) ", docs: "These events are called before dealing damage to a line or sector, which allows the events to manipulate the damage through Damage (raw damage) and NewDamage (damage after modification).\nData:\n\tActor DamageSource\n\tint Damage\n\tint NewDamage\n\tName DamageType\n\tvector3 DamagePosition\n\tbool DamageIsRadius\n\tSector DamageSector\n\tSectorPart DamageSectorPart", type: type.Method },
  { name: "WorldLightning", description: "void WorldLightning(WorldEvent e)", docs: "Same as LIGHTNING ACS script type. ", type: type.Method },
  { name: "WorldTick", description: "void WorldTick()", docs: "Calls at the beginning of each tick, 35 times per second. ", type: type.Method },
  { name: "WorldLinePreActivated", description: "void WorldLinePreActivated(WorldEvent e) ", docs: "This event is called upon the activation of a line, right before the line's special is executed.\n\tThing is the activating actor.\n\tActivatedLine is the activated line. This field is read-only, and thus cannot be changed.\n\tActivationType is the line's method of activation. This is not how it was activated by the actor. This field is read-only, and thus cannot be changed.\n\tShouldActivate determines whether or not to continue with the activation process. If this is set to false, activation is aborted early on, before even the execution of the line's special and the triggering of the WorldLineActivated event, for example.", type: type.Method },
  { name: "WorldLineActivated", description: "void WorldLineActivated(WorldEvent e) ", docs: "This event is called upon the activation of a line, after the line's special has been successfully executed.\n\tThing is the activating actor.\n\tActivatedLine is the activated line. This field is read-only, and thus cannot be changed.\n\tActivationType is the line's method of activation. This is not how it was activated by the actor. This field is read-only, and thus cannot be changed.", type: type.Method },
  { name: "PlayerEntered", description: "void PlayerEntered(PlayerEvent e)", docs: "Called when players connect. PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub.", type: type.Method },
  { name: "PlayerRespawned", description: "void PlayerRespawned(PlayerEvent e)", docs: "Called when players respawn (or use the resurrect cheat). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub.", type: type.Method },
  { name: "PlayerDied", description: "void PlayerDied(PlayerEvent e)", docs: "Called when players die (along with WorldThingDied). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub.", type: type.Method },
  { name: "PlayerDisconnected", description: "void PlayerDisconnected(PlayerEvent e) ", docs: "Called at the same point as DISCONNECT scripts (this is generally useless with P2P networking). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub.", type: type.Method },
  { name: "RenderOverlay", description: "void RenderOverlay(RenderEvent e)", docs: "These events can be used to display something on the screen. Elements drawn by these events are drawn underneath the console and menus. The difference between the two events, is that elements drawn by RenderOverlay are drawn over the HUD, while elements drawn by RenderUnderlay are drawn underneath it.\nNote that it works locally and in ui context, which means you can't modify actors and have to make sure what player you are drawing it for (using consoleplayer global variable).\nData:\n\tVector3 ViewPos\n\tdouble ViewAngle\n\tdouble ViewPitch\n\tdouble ViewRoll\n\tdouble FracTicActor Camera", type: type.Method },
  { name: "RenderUnderlay", description: "void RenderUnderlay(RenderEvent e) ", docs: "These events can be used to display something on the screen. Elements drawn by these events are drawn underneath the console and menus. The difference between the two events, is that elements drawn by RenderOverlay are drawn over the HUD, while elements drawn by RenderUnderlay are drawn underneath it.\nNote that it works locally and in ui context, which means you can't modify actors and have to make sure what player you are drawing it for (using consoleplayer global variable).\nData:\n\tVector3 ViewPos\n\tdouble ViewAngle\n\tdouble ViewPitch\n\tdouble ViewRoll\n\tdouble FracTicActor Camera", type: type.Method },
  { name: "UiProcess", description: "bool UiProcess(UiEvent e) ", docs: "By using this event you can receive UI input in the event handler. UI input is different from game input in that you can receive absolute screen mouse position instead of mouse deltas, and keyboard events are a bit more suitable for text input.\nThis event will only be received if you set your EventHandler in UI mode, e.g. by doing this:\n\tself.IsUiProcessor = true;\nAdditionally, mouse events will only be received if you also set RequireMouse to true:\n\tself.RequireMouse = true;\nKeyChar is the ASCII value for the key, while KeyString is a single-character string that contains the character provided for convenience, as ZScript doesn't provide a char type.\nNote: this is one of the few non-void methods in the event system. By returning true here you will block any processing of this event by the other event handlers if their Order is lower than the curren EventHandler.\nAlso, if you need to interact with the world upon receiving an event, you have to use EventHandler.SendNetworkEvent", type: type.Method },
  { name: "InputProcess", description: "bool InputProcess(InputEvent e) ", docs: "This event provides direct interface to the commonly used player input. You don't need any special steps in order to use it.\nMouseX and MouseY are delta values (offsets from the last mouse position). These are internally used for player aiming.\nKeyScan is the internal key value. Note that, while a bit counter-intuitive (for people unfamiliar with the console bind system), mouse buttons are considered keys for this event.\nFor example, a left mouse click is registered as KeyDown+InputEvent.Key_Mouse1.\nNote: this is one of the few non-void methods in the event system. By returning true here you will block any processing of this event by the other event handlers if their Order is lower than the current EventHandler.\nIn case of InputEvent, returning true will also mean that the generic game input handler will NOT receive the event (player will be locked from moving).\nAlso, if you need to interact with the world upon receiving an event, you have to use EventHandler.SendNetworkEvent", type: type.Method },
  { name: "UiTick", description: "void UiTick()", docs: "This is the same as WorldTick, except it also runs outside of the level (only matters for StaticEventHandlers) and runs in the ui context.", type: type.Method },
  { name: "ConsoleProcess", description: "void ConsoleProcess(ConsoleEvent e) ", docs: "This event is called when the player uses the \"event\" console command. It runs in the ui context.\nFor example, when the player runs this command:\n\tevent testevent 1 2 3\nThe event handler will receive Name as \"testevent\" and Args[0]...Args[2] as {1,2,3}.", type: type.Method },
  { name: "NetworkProcess", description: "void NetworkProcess(ConsoleEvent e) ", docs: "This event is called either when the player uses the \"netevent\" console command, or when EventHandler.SendNetworkEvent is used. To distinguish between these two cases, you can use IsManual. This field will be true if the event was produced manually through the console.\n\t* Player is the number of the player that activated the event.\n\t*  This is generally similar to using the \"puke\" command for ACS.", type: type.Method },
  { name: "CheckReplacement", description: "void CheckReplacement(ReplaceEvent e) ", docs: "This event is called when performing actor class replacements.\n\t* Replacee is the actor class being replaced. It can be used to check for specific actor classes to replace. This field is read-only and cannot be changed.\n\t* Replacement is the actor class the Replacee is to be replaced with.\n\t* IsFinal determines whether or not the engine should go through the rest of the replacement chain for this class, with the chain being: event -> skill -> replaces-keyword. Note that other events can still override this.\n\t* Replacing actor classes through this method has precedence over both the skill method and the replaces-keyword method in DECORATE and ZScript.", type: type.Method },
  { name: "CheckReplacee", description: "void CheckReplacee(ReplacedEvent e) ", docs: "This is called by functions such as A_BossDeath or any other replacee checkers. When using CheckReplacement instead of the 'replaces' keyword directly for actors, those functions check if there is a replacement for monsters such as the Arachnotron with the Doom 2 MAP07 specials. By indicating the replacee is an Arachnotron for example, this will ensure that all the monsters who call those functions will not trigger the special until all replacees of Arachnotron are dead.\n\t* Replacee is the actor class being replaced. It can be used to check for specific actor classes to replace.\n\t* Replacement is the actor class the Replacee is to be replaced with. This field is read-only and cannot be changed.\n\t* IsFinal determines whether or not the engine should go through the rest of the replacee chain for this class, with the chain being: event -> skill -> replaces-keyword. Note that other events can still override this.", type: type.Method },
  { name: "NewGame", description: "void NewGame()", docs: "This event is called upon starting a new game. It is also called upon entering a titlemap, as well as upon being reborn after death without a saved game.", type: type.Method },

  {
    name: "CVar",
    type: type.Class,
    children: [
      { name: 'FindCVar', description: "CVar FindCVar (Name name)", docs: "Searches for the console variable specified by name, returning it if it finds it. If the variable could not be found, the function returns null.", type: type.Method },
      { name: 'GetCVar', description: "CVar GetCVar (Name name, PlayerInfo player = null)", docs: "Returns a specific player's user console variable of that name. Not to be confused with the ACS function or the DECORATE expression which return numeric values stored in the named console variable.", type: type.Method },
      { name: 'GetBool', description: "bool GetBool ()", type: type.Method },
      { name: 'GetFloat', description: "double GetFloat ()", type: type.Method },
      { name: 'GetInt', description: "int GetInt ()", type: type.Method },
      { name: 'GetRealType', description: "int GetRealType ()", docs: "Returns the type of the console variable. The types are as follows:\nCVAR_Bool\nCVAR_Int\nCVAR_Float\nCVAR_String\nCVAR_Color", type: type.Method },
      { name: 'GetString', description: "String GetString ()", type: type.Method },
      { name: 'ResetToDefault', description: "int ResetToDefault ()", type: type.Method },
      { name: 'SetBool', description: "void SetBool (bool b)", type: type.Method },
      { name: 'SetFloat', description: "void SetFloat (double v)", type: type.Method },
      { name: 'SetInt', description: "void SetInt (int v)", type: type.Method },
      { name: 'SetString', description: "void SetString (String s)", type: type.Method },
    ]
  },

  {
    name: "Vector2",
    type: type.Class,
    children: [
      { name: 'x', description: "double x", docs: "x position", type: type.Variable },
      { name: 'y', description: "double y", docs: "y position", type: type.Variable },
      { name: 'Length', description: "double Length()", docs: "Returns the length of the vector. Effectively performs sqrt(x*x + y*y) for Vector2.", type: type.Method },
      { name: 'Unit', description: "Vector2 Unit()", docs: "Returns a vector with all coordinates multiplied by (1 / Length()) if the length isn't 0, scaling them between range [-1.0, 1.0]", type: type.Method },
    ]
  },

  {
    name: "Vectore",
    type: type.Class,
    children: [
      { name: 'x', description: "double x", docs: "x position", type: type.Variable },
      { name: 'y', description: "double y", docs: "y position", type: type.Variable },
      { name: 'z', description: "double z", docs: "z position", type: type.Variable },
      { name: 'Length', description: "double Length()", docs: "Returns the length of the vector. Effectively performs sqrt(x*x + y*y + z*z) for Vector3.", type: type.Method },
      { name: 'Unit', description: "Vector3 Unit()", docs: "Returns a vector with all coordinates multiplied by (1 / Length()) if the length isn't 0, scaling them between range [-1.0, 1.0].", type: type.Method },
    ]
  },

  {
    name: "Color",
    type: type.Class,
    children: [
      ...explodeString(type.Variable, 'a|r|g|b')
    ]
  },

  {
    name: "Test",
    type: type.Class,
    children: [
      {
        name: "Level2",
        type: type.Class,
        children: [
          {
            name: "Level3",
            type: type.Class,
            children: [
              {
                name: "Level4",
                type: type.Method,
              }
            ]
          }
        ]
      }
    ]
  }
];

export default globalValues;