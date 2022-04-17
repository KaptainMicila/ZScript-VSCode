import * as vscode from 'vscode';
import { actorflags } from "./actorflags";
import { actionfunctions } from "./actionfunctions";
import { actorfunctions, actorfunctions_details } from "./actorfunctions";
import { actorproperties } from "./actorproperties";

export function activate(context: vscode.ExtensionContext) {
	let provider = vscode.languages.registerCompletionItemProvider('zscript', {

		provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
			let completionlist:vscode.CompletionList = new vscode.CompletionList();

			/* Actor flags */
			actorflags.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Value);
				completionlist.items.push(item);
			});

			/* Actor class is built-in */
			completionlist.items.push(new vscode.CompletionItem("PlayerPawn", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("Actor", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("Thinker", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("Object", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("super", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("target", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("CustomInventory", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("Inventory", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("Weapon", vscode.CompletionItemKind.Class));
			completionlist.items.push(new vscode.CompletionItem("master", vscode.CompletionItemKind.Constant));
			completionlist.items.push(new vscode.CompletionItem("target", vscode.CompletionItemKind.Constant));
			completionlist.items.push(new vscode.CompletionItem("tracer", vscode.CompletionItemKind.Constant));

			/* Actor pointers */
			let actorpointers = ["AAPTR_MASTER", "AAPTR_TARGET", "AAPTR_TRACER", "AAPTR_FRIENDPLAYER", "AAPTR_GET_LINETARGET", "AAPTR_PLAYER_GETTARGET","AAPTR_PLAYER_GETCONVERSATION:","AAPTR_NULL","AAPTR_PLAYER1","AAPTR_PLAYER2","AAPTR_PLAYER3","AAPTR_PLAYER4","AAPTR_PLAYER5","AAPTR_PLAYER6","AAPTR_PLAYER7","AAPTR_PLAYER8", "AAPTR_DEFAULT", "AAPTR_LINETARGET"];
			actorpointers.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Property);
				switch (element)
				{
					case "AAPTR_DEFAULT": item.documentation = "The calling actor itself."; break;
					case "AAPTR_NULL": item.documentation = "No actor at all (does nothing)."; break;
					case "AAPTR_TARGET": item.documentation = "The calling actor's target, if any."; break;
					case "AAPTR_MASTER:": item.documentation = "The calling actor's master, if any."; break;
					case "AAPTR_TRACER:": item.documentation = "The calling actor's tracer, if any."; break;
					case "AAPTR_FRIENDPLAYER": item.documentation = "Access the actor's FRIENDPLAYER pointer."; break;
					case "AAPTR_GET_LINETARGET": item.documentation = "Get the actor in the line of sight. This is similar to AAPTR_PLAYER_GETTARGET above, except it is used for non-player actors."; break;
					case "AAPTR_LINETARGET": item.documentation = "AAPTR_GET_LINETARGET is identified as AAPTR_LINETARGET in DECORATE."; break;
					case "AAPTR_DEFAULT": item.documentation = "The calling actor itself"; break;
				}
				completionlist.items.push(item);
			});

			/* Actor functions */
			for (var i = 0; i < actorfunctions.length; i++)
			{
				const item:vscode.CompletionItem = new vscode.CompletionItem(actorfunctions[i], vscode.CompletionItemKind.Function);
				item.detail = actorfunctions_details[i];
				switch(actorfunctions[i])
				{
					case "GetRenderStyle": item.documentation = "Returns the render style of the calling actor, which can be one of the following:\n\tSTYLE_None\n\tSTYLE_Normal\n\tSTYLE_Fuzzy\n\tSTYLE_SoulTrans\n\tSTYLE_OptFuzzy\n\tSTYLE_Stencil\n\tSTYLE_Translucent\n\tSTYLE_Add\n\tSTYLE_Shaded\n\tSTYLE_TranslucentStencil\n\tSTYLE_Shadow\n\tSTYLE_Subtract\n\tSTYLE_AddStencil\n\tSTYLE_AddShaded"; break;
					case "CheckProximity": item.documentation = "For flags use CPXF_* constants."; break;
					case "PlayActiveSound": item.documentation = "Plays the active sound of the actor. The sound is played on the voice channel with no attenuation if the FULLVOLACTIVE flag is set on the actor, or with idle attenuation otherwise. The function does nothing if a sound is already playing on that channel, regardless of the means by which it was originally played."; break;
				}
				completionlist.items.push(item);
			}

			/* Render constants */
			let renderconstants = "STYLE_None|STYLE_Normal|STYLE_Fuzzy|STYLE_SoulTrans|STYLE_OptFuzzy|STYLE_Stencil|STYLE_Translucent|STYLE_Add|STYLE_Shaded|STYLE_TranslucentStencil|STYLE_Shadow|STYLE_Subtract|STYLE_AddStencil|STYLE_AddShaded";
			renderconstants.split("|").forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Aim flags */
			let aimflags = "CMF_AIMOFFSET|CMF_AIMDIRECTION|CMF_TRACKOWNER|CMF_CHECKTARGETDEAD|CMF_ABSOLUTEPITCH|CMF_OFFSETPITCH|CMF_SAVEPITCH|CMF_ABSOLUTEANGLE|CMF_BADPITCH";
			aimflags.split("|").forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Actor properties */
			actorproperties.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Property);
				completionlist.items.push(item);
			});

			/* Action functions */
			actionfunctions.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Function);
				switch(element)
				{
					case "A_SpawnItem": item.detail = "bool A_SpawnItem(string type, double distance, float zheight, bool useammo, bool translation)"; break;
					case "A_SpawnItemEx": item.detail = "bool, Actor A_SpawnItemEx(class<Actor> missile [, double xofs [, double yofs [, double zofs [, double xvel [, double yvel [, double zvel [, double angle [, int flags [, int failchance [, int tid]]]]]]]]]])"; break;
					case "A_SpawnParticle": item.detail = "A_SpawnParticle(color color1 [, int flags [, int lifetime [, float size [, float angle [, float xoff [, float yoff [, float zoff [, float velx [, float vely [, float velz [, float accelx [, float accely [, float accelz [, float startalphaf [, float fadestepf [, float sizestep]]]]]]]]]]]]]]]])"; break;
					case "A_Quake": item.detail = "A_Quake(int intensity, int duration, int damrad, int tremrad [, sound sfx])"; break;
					case "A_QuakeEx": item.detail = "A_QuakeEx(int intensityX, int intensityY, int intensityZ, int duration, int damrad, int tremrad [, sound sfx [, int flags [, float mulwavex [, float mulwavey [, float mulwavez[, int falloff[, int highpoint[, float rollIntensity[, float rollWave]]]]]]]]])"; break;
					case "A_SkullPop": item.detail = "A_SkullPop(string className)"; break;
					case "A_PlaySound": item.detail = "clearscope void A_PlaySound [(sound whattoplay [, int slot [, double volume [, bool looping [, double attenuation [, bool local]]]]])]"; break;
					case "A_PlayWeaponSound": item.detail = "A_PlayWeaponSound (string whattoplay)"; break;
					case "A_CustomMeleeAttack": item.detail = "A_CustomMeleeAttack[(int damage [, str meleesound [, str misssound [, str damagetype [, bool bleed]]]])]"; break;
					case "A_CustomComboAttack": item.detail = "A_CustomComboAttack(string missiletype, float spawnheight, int damage, string meleesound, string damagetype, bool bleed)"; break;
					case "A_RadiusDamageSelf": item.detail = "A_RadiusDamageSelf[(int damage [, float distance [, int flags [, str flashtype]]])]"; break;
					case "A_SpawnProjectile": item.detail = "A_SpawnProjectile(string missiletype, float spawnheight, float spawnofs_xy, double angle, int flags, angle pitch, int ptr) "; break;
					case "A_BasicAttack": item.detail = "A_BasicAttack(int meleedamage, string meleesound, string missiletype, float missileheight)"; break;
					case "A_LookEx": item.detail = "A_LookEx(int flags, float minseedist, floatmaxseedist, float maxheardist, double fov, state label)"; break;
					case "A_Remove": item.detail = "A_Remove(int pointer [, int flags [, string filter [, string species]]])"; break;
					case "A_Teleport": item.detail = "state, bool A_Teleport[(string teleportstate [, string targettype [, string fogtype [, int flags [, float mindist [, float maxdist [, pointer ptr]]]]]])]"; break;
					case "A_Die": item.detail = "A_Die[(str DamageType)]"; break;
					case "A_Chase": item.detail = "void A_Chase[(statelabel melee [, statelabel missile [, int flags]])]"; break;
					case "A_AlertMonsters": item.detail = "A_AlertMonsters[(float maxrange [, int flags])]"; break;
					case "A_Burst": item.detail = "A_Burst(string classname)"; item.documentation = "Spawns a random numbers of actors of type classname, positions them all around the calling actor, and then destroys the calling actor, removing it instantly from the game. The amount spawned is relative to the calling actor's size, so a very large actor will spawn many more classnames than a much smaller actor. An actor with radius 20 and height 64 spawns, on average, around 40 things.\nIf the calling actor has the BOSSDEATH flag, it also calls A_BossDeath."; break;
					case "A_Wander": item.detail = "void A_Wander[(int flags)]"; break;
					case "A_Log": item.detail = "void A_Log(string whattoprint [, bool local])"; break;
					case "A_LogFloat": item.detail = "void A_Log(string whattoprint [, bool local])"; break;
					case "A_LogInt": item.detail = "void A_Log(int whattoprint [, bool local])"; break;
					case "A_Print": item.detail = "A_Print(string text[, float time[, string fontname]])"; break;
					case "A_PrintBold": item.detail = "A_PrintBold(string text[, float time[, string fontname]])"; break;
					case "A_CheckProximity": item.detail = "state A_CheckProximity(str jump, str classname, float distance [, int count [, int flags [, int ptr]]])"; item.documentation = "For flags use CPXF_* constants."; break;
					default: break;
				}
				completionlist.items.push(item);
			});

			/* A_Remove flags */
			let removeflags = "RMVF_MISSILES|RMVF_NOMONSTERS|RMVF_MISC|RMVF_EVERYTHING|RMVF_EXFILTER|RMVF_EXSPECIES|RMVF_EITHER";
			removeflags.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Chase flags */
			let chaseflags = "CHF_NORANDOMTURN|CHF_NODIRECTIONTURN|CHF_STOPIFBLOCKED|CHF_DONTTURN";
			chaseflags.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Proximity flags */
			let proximityflags = "CPXF_ANCESTOR|CPXF_NOZ|CPXF_CHECKSIGHT|CPXF_COUNTDEAD|CPXF_DEADONLY|CPXF_LESSOREQUAL|CPXF_EXACT|CPXF_SETTARGET|CPXF_SETMASTER|CPXF_SETTRACER|CPXF_FARTHEST|CPXF_CLOSEST|CPXF_SETONPTR";
			proximityflags.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Sound flags */
			let soundflags = "ATTN_NONE|ATTN_NORM|ATTN_IDLE|ATTN_STATIC|CHAN_AUTO|CHAN_WEAPON|CHAN_VOICE|CHAN_ITEM|CHAN_BODY|CHAN_5|CHAN_6|CHAN_7|CHAN_LISTENERZ|CHAN_MAYBE_LOCAL|CHAN_UI|CHAN_NOPAUSE|CHAN_LOOP|CHAN_NOSTOP";
			soundflags.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Constant);
				completionlist.items.push(item);
			});

			/* Mathematic functions */
			var mathematicfunctions = [
				["atan2", "fixed VectorAngle(int x, int y)"],
				["Tan", "fixed Tan(int x)"],
				["Ceil", "fixed Ceil(fixed value)"],
				["Cos", "fixed Cos(int angle)"],
				["FixedDiv", "fixed FixedDiv(int a, int b)"],
				["FixedMul", "fixed FixedMul(int a, int b)"],
				["Floor", "fixed Floor(fixed value)"],
				["Random", "int Random(int min, int max)"],
				["Round", "fixed Round(fixed value)"],
				["Sin", "fixed Sin(int angle)"],
				["Sqrt", "int Sqrt(int number)"],
				["FixedSqrt", "fixed Sqrt(fixed number)"],
				["StrLen", "int StrLen(str string)"],
				["VectorAngle", "fixed VectorAngle(int x, int y)"],
				["VectorLength", "int VectorLength(int x, int y)"],
			];
			mathematicfunctions.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element[0], vscode.CompletionItemKind.Function);
				item.detail = element[1];
				switch(element[0])
				{
					case "atan2": item.documentation = "Returns the fixed point angle of the vector (x,y). Angles are measured from the east and moving counterclockwise.\nThis function is more commonly known as atan2. To get the value of atan(x), use VectorAngle(1.0, x)"; break;
				}
				completionlist.items.push(item);
			});

			/* Constants */
			completionlist.items.push(new vscode.CompletionItem("true", vscode.CompletionItemKind.Constant));
			completionlist.items.push(new vscode.CompletionItem("false", vscode.CompletionItemKind.Constant));

			/* Flags */
			var flags = [
				["XF_HURTSOURCE", "Hurts the source: if set, the source can be damaged by the explosion. Note that the source is not necessarily the calling actor. This flag is set by default. By using other flags or, if none of the other flags is desired, passing 0 to flags, this flag can be cleared."],
				["XF_NOTMISSILE", "Not a missile: if set, the calling actor is considered to be the source. By default, the calling actor is assumed to be a projectile, and the source is therefore considered to be the calling actor's target."],
				["XF_EXPLICITDAMAGETYPE", "The damagetype parameter will never change to the actor's damage type."],
				["XF_NOSPLASH", "No splash: if set, the explosion does not create any terrain splashes."],
				["XF_THRUSTZ", "Apply vertical thrust: if set, the attack pushes the victim vertically, in addition to horizontally. Normally, vertical thrust is applied without the need of this flag, but it could be disabled by setting the compat_explode1 compatibility flag. This flag overrides the compatibility flag."],
			];
			flags.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element[0], vscode.CompletionItemKind.Function);
				item.documentation = element[1];
				completionlist.items.push(item);
			});

			/* Keywords */
			let keywords = "switch|case|break|if|else|while|for|return|class|struct|goto|stop|loop|wait|states|default|let|is|fail|replaces";
			keywords.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				switch (element)
				{
					case "loop": item.documentation = "Jumps to the most recently defined state label. This is used for a looping animation. Do not put a loop on a state with a duration of -1, this is unnecessary and can cause problems."; break;
					case "stop": item.documentation = "Stops animating this actor. Normally this is used at the end of the death sequences. If the last state has a duration > -1 the actor will be removed. Note that if a state contains only the stop instruction, the actor will behave as if it doesn't have that state. This can be useful, for example, to remove a state that an actor has inherited from its parent."; break;
					case "wait": item.documentation = "Loops the last defined state. This is useful if a code pointer is used that waits a given time or for a certain event. Currently useful code pointers include A_WeaponReady, A_Raise, A_FreezeDeathChunks, and similar code pointer functionality."; break;
					case "fail": item.documentation = "Used with custom inventory items, means that the state sequence failed to succeed."; break;
					case "goto": item.detail = "goto label [+offset]"; item.documentation = "Jumps to an arbitrary state in the current actor. With this, you can also jump to a base class state, i.e. one that was inherited by a parent. The statement goto See jumps to the walking animation that has been overriden in the current actor class, or if such does not exist, to the inherited class's state. goto is however static, i.e. will not do virtual jumps — for that, see A_Jump.\nOffset specifies the number of frames to skip after the specified label. That is, using \"goto Spawn+2\" will jump to this frame:\n\n\tSpawn:\n\tTNT1 AAAAAAAA 0\n\nIn addition, if an actor is using inheritance, you can use goto with the scope operator (::) to go to a parent class' state. The keyword \"super\" always refers to the immediate parent, but any parent class can be referred to by name as well, for example \"goto Actor::GenericFreezeDeath\" is a valid instruction."; break;
					default:break;
				}
				completionlist.items.push(item);
			});

			/* State keywords */
			let statekeywords = "Bright|CanRaise|Fast|Light|NoDelay|Offset|Slow";
			statekeywords.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				completionlist.items.push(item);
			});
			let states = "Spawn|Idle|See|Melee|Missile|Pain|Death|Death.Sky|Death.Extreme|XDeath|Death.Fire|Burn|Death.Ice|Death.Disintegrate|Disintegrate|Raise|Heal|Crash|Crash.Extreme|Crush|Wound|Greetings|Yes|No|Active|Inactive|Bounce|Bounce.Floor|Bounce.Ceiling|Bounce.Wall|Bounce.Actor|Bounce.Actor.Creature";
			states.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				completionlist.items.push(item);
			});

			/* Damage types */
			let damagetypes = "MOD_UNKNOWN|MOD_ROCKET|MOD_R_SPLASH|MOD_PLASMARIFLE|MOD_BFG_BOOM|MOD_BFG_SPLASH|MOD_CHAINSAW|MOD_SSHOTGUN|MOD_WATER|MOD_SLIME|MOD_LAVA|MOD_CRUSH|MOD_TELEFRAG|MOD_CRUSH|MOD_FALLING|MOD_SUICIDE|MOD_BARREL|MOD_EXIT|MOD_SPLASH|MOD_HIT|MOD_RAILGUN|MOD_ICE|MOD_DISINTEGRATE|MOD_POISON|MOD_ELECTRIC";
			damagetypes.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				switch (element)
				{
					case "MOD_UNKNOWN": item.documentation = "The internal name for generic damage, as in \"no special reason\""; break;
					case "MOD_HIT": item.documentation = "Default for melee attacks."; break;
					default: break;
				}
				completionlist.items.push(item);
			});

			/* Operators */
			var tmpitem = new vscode.CompletionItem("~==", vscode.CompletionItemKind.Operator); /* CTRL-space doesn't autocomplete this. */
			tmpitem.documentation = "~== is a case insensitive version of ==.";
			completionlist.items.push(tmpitem);
			completionlist.items.push(new vscode.CompletionItem("dot", vscode.CompletionItemKind.Operator));
			completionlist.items.push(new vscode.CompletionItem("cross", vscode.CompletionItemKind.Operator));

			/* Data types */
			let datatypes = "BlockThingsIterator|CVar|enum|Array|fixed|void|bool|double|float|int|int8|int16|uint|uint8|uint16|Vector2|Vector3|String|Name|Sound|StateLabel|Color";
			datatypes.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				switch (element)
				{
					case "Color": item.documentation = "Used to record a a color either defined in the X11R6RGB lump or a hexidecimal surrounded in double quotes, or a directly specified ARGB value."; break;
					default:break;
				}
				completionlist.items.push(item);
			});
			var tmpitem = new vscode.CompletionItem("\"Null\"", vscode.CompletionItemKind.Constant);
			tmpitem.detail = "(StateLabel) \"Null\"";
			tmpitem.documentation = "\"Null\" should be used if the actor should be destroyed. Do not confuse this with null. Every actor has this state which will remove them upon making it there. This is safe to use when a jumping function is inside an if statement -- the actor will not be destroyed, since they are treated as booleans instead of actual jumps for testing purposes only.\nNOTE: StateLabels currently cannot be used in ternary operations, or convert to/from strings and/or names.";
			completionlist.items.push(tmpitem);
			var tmpitem = new vscode.CompletionItem("null", vscode.CompletionItemKind.Constant);
			tmpitem.detail = "(StateLabel) null";
			tmpitem.documentation = "null should be used if an actor should not perform a jump. Do not use this when performing an action function within an if () statement as it will always fail.\nNOTE: StateLabels currently cannot be used in ternary operations, or convert to/from strings and/or names.";
			completionlist.items.push(tmpitem);

			/* Type modifiers */
			let modifiers = "server|override|static|const|meta|out|in|version|virtual|native|ui|clearscope|virtualscope|play|property|prefix|action";
			modifiers.split('|').forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element, vscode.CompletionItemKind.Keyword);
				completionlist.items.push(item);
			});

			/* Event and handlers */
			var eventfunctions = [
				["OnRegister", "void OnRegister()", "Called when the engine registers your handler (adds it to the list). Initialization can be performed here."],
				["OnUnregister", "void OnUnregister()", "Called when the engine removes your handler from the list."],
				["WorldLoaded", "void WorldLoaded(WorldEvent e)", "IsSaveGame only works for StaticEventHandlers. By using this field you can detect that the current level was loaded from a saved game. IsReopen will be true when the player returns to the same map in a hub, similar to REOPEN ACS script type."],
				["WorldUnloaded", "void WorldUnloaded(WorldEvent e)", "Called when the engine removes your handler from the list."],
				["WorldThingSpawned", "void WorldThingSpawned(WorldEvent e)", "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed. Internally, WorldThingSpawned is called just after PostBeginPlay."],
				["WorldThingDied", "void WorldThingDied(WorldEvent e)", "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed.  If Inflictor is not null, it is the actor that caused the damage that killed Thing. While the event does not provide a pointer to the source of the damage (killer), it, if not null, is stored in the target field of Thing."],
				["WorldThingRevived", "void WorldThingRevived(WorldEvent e)", "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed."],
				["WorldThingDestroyed", "void WorldThingDestroyed(WorldEvent e) ", "These events are received just after the specified Thing was spawned or revived/raised/resurrected (including the player's use of the resurrect cheat), and just before it dies or gets destroyed."],
				["WorldThingDamaged", "void WorldThingDamaged(WorldEvent e) ", "Called"],
				["WorldLineDamaged", "void WorldLineDamaged(WorldEvent e)", "These events are called before dealing damage to a line or sector, which allows the events to manipulate the damage through Damage (raw damage) and NewDamage (damage after modification).\nData:\n\tActor DamageSource\n\tint Damage\n\tint NewDamage\n\tName DamageType\n\tvector3 DamagePosition\n\tbool DamageIsRadius\n\tLine DamageLine\n\tint DamageLineSide"],
				["WorldSectorDamaged", " void WorldSectorDamaged(WorldEvent e) ", "These events are called before dealing damage to a line or sector, which allows the events to manipulate the damage through Damage (raw damage) and NewDamage (damage after modification).\nData:\n\tActor DamageSource\n\tint Damage\n\tint NewDamage\n\tName DamageType\n\tvector3 DamagePosition\n\tbool DamageIsRadius\n\tSector DamageSector\n\tSectorPart DamageSectorPart"],
				["WorldLightning", "void WorldLightning(WorldEvent e)", "Same as LIGHTNING ACS script type. "],
				["WorldTick", "void WorldTick()", "Calls at the beginning of each tick, 35 times per second. "],
				["WorldLinePreActivated", "void WorldLinePreActivated(WorldEvent e) ", "This event is called upon the activation of a line, right before the line's special is executed.\n\tThing is the activating actor.\n\tActivatedLine is the activated line. This field is read-only, and thus cannot be changed.\n\tActivationType is the line's method of activation. This is not how it was activated by the actor. This field is read-only, and thus cannot be changed.\n\tShouldActivate determines whether or not to continue with the activation process. If this is set to false, activation is aborted early on, before even the execution of the line's special and the triggering of the WorldLineActivated event, for example."],
				["WorldLineActivated", "void WorldLineActivated(WorldEvent e) ", "This event is called upon the activation of a line, after the line's special has been successfully executed.\n\tThing is the activating actor.\n\tActivatedLine is the activated line. This field is read-only, and thus cannot be changed.\n\tActivationType is the line's method of activation. This is not how it was activated by the actor. This field is read-only, and thus cannot be changed."],
				["PlayerEntered", "void PlayerEntered(PlayerEvent e)", "Called when players connect. PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub."],
				["PlayerRespawned", "void PlayerRespawned(PlayerEvent e)", "Called when players respawn (or use the resurrect cheat). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub."],
				["PlayerDied", "void PlayerDied(PlayerEvent e)", "Called when players die (along with WorldThingDied). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub."],
				["PlayerDisconnected", "void PlayerDisconnected(PlayerEvent e) ", "Called at the same point as DISCONNECT scripts (this is generally useless with P2P networking). PlayerNumber is the player that was affected. You can receive the actual player object from the global players array like this:\n\tPlayerInfo player = players[e.PlayerNumber];\nIsReturn will be true if this player returns to this level in a hub."],
				["RenderOverlay", "void RenderOverlay(RenderEvent e)", "These events can be used to display something on the screen. Elements drawn by these events are drawn underneath the console and menus. The difference between the two events, is that elements drawn by RenderOverlay are drawn over the HUD, while elements drawn by RenderUnderlay are drawn underneath it.\nNote that it works locally and in ui context, which means you can't modify actors and have to make sure what player you are drawing it for (using consoleplayer global variable).\nData:\n\tVector3 ViewPos\n\tdouble ViewAngle\n\tdouble ViewPitch\n\tdouble ViewRoll\n\tdouble FracTicActor Camera"],
				["RenderUnderlay", "void RenderUnderlay(RenderEvent e) ", "These events can be used to display something on the screen. Elements drawn by these events are drawn underneath the console and menus. The difference between the two events, is that elements drawn by RenderOverlay are drawn over the HUD, while elements drawn by RenderUnderlay are drawn underneath it.\nNote that it works locally and in ui context, which means you can't modify actors and have to make sure what player you are drawing it for (using consoleplayer global variable).\nData:\n\tVector3 ViewPos\n\tdouble ViewAngle\n\tdouble ViewPitch\n\tdouble ViewRoll\n\tdouble FracTicActor Camera"],
				["UiProcess", "bool UiProcess(UiEvent e) ", "By using this event you can receive UI input in the event handler. UI input is different from game input in that you can receive absolute screen mouse position instead of mouse deltas, and keyboard events are a bit more suitable for text input.\nThis event will only be received if you set your EventHandler in UI mode, e.g. by doing this:\n\tself.IsUiProcessor = true;\nAdditionally, mouse events will only be received if you also set RequireMouse to true:\n\tself.RequireMouse = true;\nKeyChar is the ASCII value for the key, while KeyString is a single-character string that contains the character provided for convenience, as ZScript doesn't provide a char type.\nNote: this is one of the few non-void methods in the event system. By returning true here you will block any processing of this event by the other event handlers if their Order is lower than the curren EventHandler.\nAlso, if you need to interact with the world upon receiving an event, you have to use EventHandler.SendNetworkEvent"],
				["InputProcess", "bool InputProcess(InputEvent e) ", "This event provides direct interface to the commonly used player input. You don't need any special steps in order to use it.\nMouseX and MouseY are delta values (offsets from the last mouse position). These are internally used for player aiming.\nKeyScan is the internal key value. Note that, while a bit counter-intuitive (for people unfamiliar with the console bind system), mouse buttons are considered keys for this event.\nFor example, a left mouse click is registered as KeyDown+InputEvent.Key_Mouse1.\nNote: this is one of the few non-void methods in the event system. By returning true here you will block any processing of this event by the other event handlers if their Order is lower than the current EventHandler.\nIn case of InputEvent, returning true will also mean that the generic game input handler will NOT receive the event (player will be locked from moving).\nAlso, if you need to interact with the world upon receiving an event, you have to use EventHandler.SendNetworkEvent"],
				["UiTick", "void UiTick()", "This is the same as WorldTick, except it also runs outside of the level (only matters for StaticEventHandlers) and runs in the ui context."],
				["ConsoleProcess", "void ConsoleProcess(ConsoleEvent e) ", "This event is called when the player uses the \"event\" console command. It runs in the ui context.\nFor example, when the player runs this command:\n\tevent testevent 1 2 3\nThe event handler will receive Name as \"testevent\" and Args[0]...Args[2] as {1,2,3}."],
				["NetworkProcess", "void NetworkProcess(ConsoleEvent e) ", "This event is called either when the player uses the \"netevent\" console command, or when EventHandler.SendNetworkEvent is used. To distinguish between these two cases, you can use IsManual. This field will be true if the event was produced manually through the console.\n\t* Player is the number of the player that activated the event.\n\t*  This is generally similar to using the \"puke\" command for ACS."],
				["CheckReplacement", "void CheckReplacement(ReplaceEvent e) ", "This event is called when performing actor class replacements.\n\t* Replacee is the actor class being replaced. It can be used to check for specific actor classes to replace. This field is read-only and cannot be changed.\n\t* Replacement is the actor class the Replacee is to be replaced with.\n\t* IsFinal determines whether or not the engine should go through the rest of the replacement chain for this class, with the chain being: event -> skill -> replaces-keyword. Note that other events can still override this.\n\t* Replacing actor classes through this method has precedence over both the skill method and the replaces-keyword method in DECORATE and ZScript."],
				["CheckReplacee", "void CheckReplacee(ReplacedEvent e) ", "This is called by functions such as A_BossDeath or any other replacee checkers. When using CheckReplacement instead of the 'replaces' keyword directly for actors, those functions check if there is a replacement for monsters such as the Arachnotron with the Doom 2 MAP07 specials. By indicating the replacee is an Arachnotron for example, this will ensure that all the monsters who call those functions will not trigger the special until all replacees of Arachnotron are dead.\n\t* Replacee is the actor class being replaced. It can be used to check for specific actor classes to replace.\n\t* Replacement is the actor class the Replacee is to be replaced with. This field is read-only and cannot be changed.\n\t* IsFinal determines whether or not the engine should go through the rest of the replacee chain for this class, with the chain being: event -> skill -> replaces-keyword. Note that other events can still override this."],
				["NewGame", "void NewGame()", "This event is called upon starting a new game. It is also called upon entering a titlemap, as well as upon being reborn after death without a saved game."],
			];
			eventfunctions.forEach(element => {
				const item:vscode.CompletionItem = new vscode.CompletionItem(element[0], vscode.CompletionItemKind.Function);
				item.detail = element[1];
				item.documentation = element[2];
				completionlist.items.push(item);
			});

			return completionlist;
		}
	});

	/* ----------------
	 * CVar
	 * ----------------
	 */
	const provider_cvar = vscode.languages.registerCompletionItemProvider(
		'zscript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let completionlist:vscode.CompletionList = new vscode.CompletionList();

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('CVar.')) {
					return undefined;
				}
				var tmpitem = new vscode.CompletionItem('FindCVar', vscode.CompletionItemKind.Function);
				tmpitem.detail = "CVar FindCVar (Name name)";
				tmpitem.documentation = "Searches for the console variable specified by name, returning it if it finds it. If the variable could not be found, the function returns null.";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetCVar', vscode.CompletionItemKind.Function);
				tmpitem.detail = "CVar GetCVar (Name name, PlayerInfo player = null)";
				tmpitem.documentation = "    Returns a specific player's user console variable of that name. Not to be confused with the ACS function or the DECORATE expression which return numeric values stored in the named console variable.";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetBool', vscode.CompletionItemKind.Function);
				tmpitem.detail = "bool GetBool ()";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetFloat', vscode.CompletionItemKind.Function);
				tmpitem.detail = "double GetFloat ()";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetInt', vscode.CompletionItemKind.Function);
				tmpitem.detail = "int GetInt ()";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetRealType', vscode.CompletionItemKind.Function);
				tmpitem.detail = "int GetRealType ()";
				tmpitem.documentation = "Returns the type of the console variable. The types are as follows:\nCVAR_Bool\nCVAR_Int\nCVAR_Float\nCVAR_String\nCVAR_Color";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('GetString', vscode.CompletionItemKind.Function);
				tmpitem.detail = "String GetString ()";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('ResetToDefault', vscode.CompletionItemKind.Function);
				tmpitem.detail = "int ResetToDefault ()";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('SetBool', vscode.CompletionItemKind.Function);
				tmpitem.detail = "void SetBool (bool b)";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('SetFloat', vscode.CompletionItemKind.Function);
				tmpitem.detail = "void SetFloat (double v)";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('SetInt', vscode.CompletionItemKind.Function);
				tmpitem.detail = "void SetInt (int v)";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('SetString', vscode.CompletionItemKind.Function);
				tmpitem.detail = "void SetString (String s)";
				completionlist.items.push(tmpitem);

				return completionlist;
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

	/* ----------------
	 * Vector2
	 * ----------------
	 */
	const provider_vector2 = vscode.languages.registerCompletionItemProvider(
		'zscript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let completionlist:vscode.CompletionList = new vscode.CompletionList();

				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.toLowerCase().endsWith('vector2.')) {
					return undefined;
				}
				var tmpitem = new vscode.CompletionItem('x', vscode.CompletionItemKind.Variable);
				tmpitem.detail = "double x";
				tmpitem.documentation = "x position";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('y', vscode.CompletionItemKind.Variable);
				tmpitem.detail = "double y";
				tmpitem.documentation = "y position";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('Length', vscode.CompletionItemKind.Function);
				tmpitem.detail = "double Length()";
				tmpitem.documentation = "Returns the length of the vector. Effectively performs sqrt(x*x + y*y) for Vector2.";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('Unit', vscode.CompletionItemKind.Function);
				tmpitem.detail = "Vector2 Unit()";
				tmpitem.documentation = "Returns a vector with all coordinates multiplied by (1 / Length()) if the length isn't 0, scaling them between range [-1.0, 1.0].";
				completionlist.items.push(tmpitem);

				return completionlist;
			}
		},
		'.'
	);

	/* ----------------
	 * Vector3
	 * ----------------
	 */
	const provider_vector3 = vscode.languages.registerCompletionItemProvider(
		'zscript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let completionlist:vscode.CompletionList = new vscode.CompletionList();

				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.toLowerCase().endsWith('vector3.')) {
					return undefined;
				}
				var tmpitem = new vscode.CompletionItem('x', vscode.CompletionItemKind.Variable);
				tmpitem.detail = "double x";
				tmpitem.documentation = "x position";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('y', vscode.CompletionItemKind.Variable);
				tmpitem.detail = "double y";
				tmpitem.documentation = "y position";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('z', vscode.CompletionItemKind.Variable);
				tmpitem.detail = "double z";
				tmpitem.documentation = "z position";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('Length', vscode.CompletionItemKind.Function);
				tmpitem.detail = "double Length()";
				tmpitem.documentation = "Returns the length of the vector. Effectively performs sqrt(x*x + y*y + z*z) for Vector3.";
				completionlist.items.push(tmpitem);
				var tmpitem = new vscode.CompletionItem('Unit', vscode.CompletionItemKind.Function);
				tmpitem.detail = "Vector3 Unit()";
				tmpitem.documentation = "Returns a vector with all coordinates multiplied by (1 / Length()) if the length isn't 0, scaling them between range [-1.0, 1.0].";
				completionlist.items.push(tmpitem);

				return completionlist;
			}
		},
		'.'
	);

	/* ----------------
	 * Color
	 * ----------------
	 */
	const provider_color = vscode.languages.registerCompletionItemProvider(
		'zscript',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				let completionlist:vscode.CompletionList = new vscode.CompletionList();

				let linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.toLowerCase().endsWith('color.')) {
					return undefined;
				}
				completionlist.items.push(new vscode.CompletionItem('a', vscode.CompletionItemKind.Variable));
				completionlist.items.push(new vscode.CompletionItem('r', vscode.CompletionItemKind.Variable));
				completionlist.items.push(new vscode.CompletionItem('g', vscode.CompletionItemKind.Variable));
				completionlist.items.push(new vscode.CompletionItem('b', vscode.CompletionItemKind.Variable));

				return completionlist;
			}
		},
		'.'
	);
	context.subscriptions.push(provider, provider_cvar, provider_vector2, provider_vector3);
}
