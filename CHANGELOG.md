# Change Log

## [1.3.0] The "ACS" update

-	Added experimental ACS support
-	Fixed "folding" error caused by me deleting the zscript language configuration.

## [1.2.0] The "I don't like TypeScript, but at least there's a entry point for you" update

-	Created entry point for typescript. (So you can extend whatever this extension is.)

## [1.0.0] The "release" update

-   Minor fixes
-   Removed comments (less pace wasted)

## [0.9.6] The "booleans are constants now" update

-   `true` and `false` are now language constants (different colors)

## [0.9.5] The "~~Screw Off Typescript~~" update

-   Enhanced code folding support
-   Enhanced brackets detection (now with angle brackets!)

## [0.9.4] The "Abstact" update

-   Added support for the `abstract` keyword
-   Fixed `class` word broken detection

## [0.9.3] The "Usable state(?)" update

-   Noticed this file exists
-   Fixed file type recognition, now is: `.zs`,`.zsc`,`.zc` (this one was used by Nash Muhandes, so I added it)
-   Added support for "anonymous functions" (as seen in example 1), this means:
    -   Now you can use anonymous functions!
    -   Fixed "states" block ending, as they can have "anonymous functions inside"
-   Upgraded performance thanks to some regex magic!
-   Updated class highlighting (example 2)
-   Fixed the `default` and `states` blocks detection, again. (They won't be found in comments anymore)
-   Fixed `default` blocks getting called `decorate` blocks in the token view
-   Removed a lot of hardcoded stuff
-   Changed highlighting type from `class` to `tag` for `Default` blocks' attributes
-   Added enum support (example 3, but was it really required?)

Examples:

-   Example 1

```cs
States
	{
	Spawn:
		TNT1 A 0 { chanceMod = 0;		return ResolveState("Spawn2"); }
		TNT1 A 0 { chanceMod = 100;		return ResolveState("Spawn2"); }
		TNT1 A 0 { chanceMod = 220;		return ResolveState("Spawn2"); }
	Spawn2:
		TNT1 A 0
		{
			A_SpawnItemEx("NashGoreBloodImpact", flags: BLOOD_FLAGS);

			for (int i = 0; i < 10; i++)
			{
				A_SpawnItemEx("NashGoreBloodParticle1",
					frandom(-8, 8), frandom(-8, 8), frandom(-8, 8),
					frandom(-2.0, 2.0), frandom(-2.0, 2.0), frandom(0.0, 4.0),
					frandom(0, 360), BLOOD_FLAGS | SXF_TRANSFERPOINTERS, chanceMod);
			}
		}
		TNT1 AAAAAAAAAA 1
		{
			A_SpawnItemEx("NashGoreBloodParticle2",
				frandom(-8, 8), frandom(-8, 8), frandom(-8, 8),
				frandom(-2.5, 2.5), frandom(-2.5, 2.5), frandom(1.0, 2.0),
				frandom(0, 360), BLOOD_FLAGS, chanceMod);
		}
		TNT1 AAAAAAAAAA 1
		{
			A_SpawnItemEx("NashGoreBloodFloorSplashSpawner",
				0, 0, 0,
				frandom(-4.0, 4.0), frandom(-4.0, 4.0), frandom(1.0, 4.0),
				frandom(0, 360), BLOOD_FLAGS, chanceMod);
		}
		Stop;
	}
```

-   Example 2

```cs
class Class1 : Class2 {
//				↑
//				This is now recognized as a class!
	// CODE
}
```

-   Example 3

```cs
enum Example {
	VALUE_1,
	value_2,
	value_n
}
```

## [0.9.2] The "dynamic" update

-   Fixed some issues with the `Array<>` detection

## [0.9.1] The "blocky" update

-   Fixed some issues with the `Default` and `States` blocks detection

## [0.9.0]

-   Initial release
