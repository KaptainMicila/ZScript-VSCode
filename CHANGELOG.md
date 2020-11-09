# Change Log

## [0.9.3] The "Anonymous" update
- Noticed this file exists
- Fixed file type recognition, now is: `.zs`,`.zsc`,`.zc` (this one was used by Nash Muhandes, so I added it)
- Added support for "anonymous functions" (as seen in example 1), this means:
    - Now you can use anonymous functions!
    - Fixed "states" block ending, as they can have "anonymous functions inside" 
- Upgraded performance thanks to some regex magic!
- Updated class highlighting (example 2)
Examples:

- Example 1
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
- Example 2
```cs
class Class1 : Class2 {
//				↑
//				This is now recognized as a class!
	// CODE
}
```

## [0.9.2] The "dynamic" update
- Fixed some issues with the `Array<>` detection

## [0.9.1] The "blocky" update
- Fixed some issues with the `Default` and `States` blocks detection

## [0.9.0]
- Initial release