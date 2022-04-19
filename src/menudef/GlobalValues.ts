/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CompletionItemKind } from "vscode";
import { explodeString, ICompletionTree } from "../utils";

const type = CompletionItemKind;

function generatePropertyInsertText(description?: string) {
  if (!description) return;

  let i = 1;

  return description
    // map <name> -> ${i:name} for snippet autocompletion
    .replace(/<([A-Za-z0-9_ ]+)>/g, (_: string, name: string) => '${' + (i++) + `:${name}}`)
    // explode optional arguments
    .replace(/\s*[\]\[]\s*/g, '');
}

const block = (name: string, docs?: string): ICompletionTree => ({ name, docs, type: type.Module, insertText: `${name} {\n\t$0\n}\n`, description: `${name} { ... }` });

const property = (name: string, description?: string, docs?: string): ICompletionTree => ({ name, docs, type: type.Keyword, insertText: generatePropertyInsertText(description), description });

const globalValues: ICompletionTree[] = [
  // Blocks
  block("ListMenu", "A list of commands, such as the main menu in the various games."),
  block("AddListmenu", "A ListMenu whose contents are added to an existing ListMenu."),
  block("OptionMenu", "A list of options, pairing each one with its current value."),
  block("AddOptionMenu", "An OptionMenu whose contents are added to an existing OptionMenu."),
  block("OptionValue", "A way to pair meaningful names to values, they are referenced by OptionMenus."),
  block("OptionString", "A way to pair a user displayed name to a string CVar."),
  block("DefaultListMenu", "Any list menus after this block will inherit the ListMenu instructions defined in it."),
  block("DefaultOptionMenu"),
  block("OptionMenuSettings"),

  // Keywords
  // TODO: Autocomplete only allowed properties in the current block
  ...explodeString(type.Keyword, "Before|After"),
  // - ListMenu
  property("Font", 'Font "<font name>" [, "<font color>" ] [, "<highlight color>" ]', "Chooses which font will be used from then on. Caution: this will not work in OptionMenus and will make ZDoom spit an error at loadup."),
  property("Linespacing", "Linespacing <y>", "Changes how much space to leave in between each line."),
  property("LabelOffset", "LabelOffset <x>", "Changes how much labels are offset."),
  property("PlayerDisplay", 'PlayerDisplay <x>, <y>, "RR GG BB", "RR GG BB"', "Changes the position of the box where the player character is shown in the Player Class selection menu (when a new game is started). The color definitions (in hex) define the range of the background."),
  property("Position", "Position <x>, <y>", "Forcibly changes the starting position for the next element. (The position of the each element is normally automatically calculated from the position of its predecessor.)"),
  property("Selector", 'Selector "<graphic>", <x>, <y>', ""),
  property("StaticText", 'StaticText <x>, <y>, "<text>" [, "<fcolor>"] (ListMenu)', 'Optionally, a font color can be specified. Only font colors defined in TEXTCOLO are supported.'),
  property("StaticTextCentered", 'StaticTextCentered <x>, <y>, "<text>" [, "<fcolor>"]', "Displays non-interactive text centered at the specified position. Optionally, a font color can be specified. Only font colors defined in TEXTCOLO are supported."),
  property("StaticTextSwitchable", 'StaticTextSwitchable "<text_off>", "<text_on>", "<value>" [, "<fcolor>"]', "Displays the given text depending on value. Optionally, a font color can be specified. Only font colors defined in TEXTCOLO are supported."),
  property("StaticPatch", 'StaticPatch <x>, <y>, "<lump>"', "Displays a non-interactive image lump."),
  property("StaticPatchCentered", 'StaticPatchCentered <x>, <y>, "<lump>"', "Displays a non-interactive image lump centered at the specified position."),
  property("ValueText", 'ValueText "<text>", "<CVAR>" [, "<OptionValue reference>" ]', "(Verification needed)"),
  property("Size", "Size <x>, <y>", `Change how pixels are scaled. Defaults to "OptClean", which defers to the user's choice on how pixels are scaled.Set to "Clean" to force the old square - pixels method, or to an X - Y resolution to scale the menu to imitate full - screen based on a specific screen resolution`),
  property("AnimatedTransition", "", "Enables animated transitions between list menus. Note that animated transitions between two menus will only work if both of them have this instruction in their definitions."),
  // - OptionMenu
  property("StaticText", 'StaticText "<text>" [, "<fcolor>"] (OptionMenu)', 'Displays non-interactive text at the specified position. Color can be either a TEXTCOLO entry name in double quotes, or the number 1 for the menu header font color defined in GameInfo.'),
  // property("StaticTextSwitchable", 'StaticTextSwitchable "<text_off>", "<text_on>", "<value>" [, "<fcolor>"]', "Displays the given text depending on value. Optionally, a font color can be specified. Only font colors defined in TEXTCOLO are supported."),
  property("Title", 'Title "<text>"', "Displays a title for an OptionMenu."),
  property("Position", "Position <y> (OptionMenu)", "Repositions the starting point for the entire optionmenu. Only useful once. Further instances will simply override the previously defined Positions."),
  // - Settings
  property('Control', 'Control "<label>", "<command>"', 'For changing key bindings'),
  property('MapControl', 'MapControl "<label>", "<command>"', 'For changing automap key bindings'),
  property('Option', 'Option "<label>", "<CVAR>", "<OptionValue reference>" [, "check" [, Center]]', 'Allows you to set a console variable to different values, using an OptionValue block as a reference to give names to these values. "OnOff" will work for a default two switch toggle without having to make a new definition. check is an optional console variable. If its value evaluates to false, then the setting is drawn darkened and unselectable.'),
  property('FlagOption', 'FlagOption "<label>", "<CVAR>", "<OptionValue reference>", bitshift [, "check" [, Center]]', '(Need more info)'),
  property('Slider', 'Slider "<label>", "<CVAR>", <minimum>, <maximum>, <inc> [, decimal places [, "check"]]', 'Allows you to set a console variable to a range of values between <min> and <max>, using steps of <inc> units. You can optionally set how many decimals places are shown (defaults to 1). check is an optional console variable. If its value evaluates to false, then the setting is drawn darkened and unselectable.'),
  property('ScaleSlider', 'ScaleSlider "<label>", "<CVAR>", <minimum>, <maximum>, <inc>, "<zero_text>" [, "negone_text"]', 'A special version of Slider which is replaced by a descriptive text for special value settings, which are 0 and -1. If the slider is set to 0, the slider is replaced by what is passed as zero_text. If it is set to -1, it is replaced by what is passed as negone_text. The default value of negone_text is an empty string.'),
  property('ColorPicker', 'ColorPicker "<label>", "<CVAR>"', 'Allows you to set a console variable to a chosen color.'),
  property('TextField', 'TextField "<label>", "<CVAR>" [, "<check>" ]', "Allows to set a console variable's value by typing it directly. <check> is an optional console variable. If its value evaluates to false, then the setting is drawn darkened."),
  property('NumberField', 'NumberField "<label>", "<CVAR>" [, <minimum>, <maximum> [, <inc> [, "<check>" ]]]]', 'Similar to Slider, but without the actual slider; this allows to set a console variable to a range of values between <min> and <max>, using steps of <inc> units. <check> is an optional console variable. If its value evaluates to false, then the setting is drawn darkened. The default values for <minimum>, <maximum> and <inc> are 0.0, 100.0 and 1.0, respectively.'),
  // - Commands
  property('PatchItem', 'PatchItem "<lump>", "<key>", "<menu block reference>"', '"lump" assigns a graphic selector to open "menu block reference" menu; "key" assigns a keyboard shortcut.'),
  property('TextItem', 'TextItem "<label>", "<key>, "<menu block reference>"', '"label" assigns a textual selector to open "menu block reference" menu; "key" assigns a keyboard shortcut.'),
  property('Submenu', 'Submenu "<label>", "<menu block reference>"', 'Opens the listed submenu.'),
  property('Command', 'Command "<label>", "<command>"', 'Calls a console command.'),
  property('SafeCommand', 'SafeCommand "<label>", "<command>" [, "<prompt>"]', 'Calls a console command with an additional confirmation. Optionally, a custom prompt can be specified.'),


  // Functions
  { name: "IfGame", description: "IfGame(<game> [, <game>...] ) {}", docs: "Uses the code if the current game is one of those listed.", insertText: "IfGame (${1:game(s)}) {\n\t$0\n}\n", type: type.Function },
  {
    name: "IfOption", description: "IfOption(<option> [, <option>...]) {}", insertText: "IfOption (${1:option(s)}) {\n\t$0\n}\n", type: type.Function, docs: `Executes the subblock if each given option evaluates to true.
Options include:
  ReadThis — True if the "Read This" menu should be shown in the main menu.
  SwapMenu — True if the Save/Load and Option menus should be swapped in the main menu.
  Windows — True if running on a Windows OS.
  Unix — True if running on a UNIX®-based OS.
  Mac — True if running on a Macintosh OS.
  OpenAL — True if the OpenAL is present.` },
  { name: "Else", description: "Else {}", insertText: "Else {\n\t$0\n}\n", docs: "Executes the subblock if the prior if statement did not succeed.", type: type.Function },

  // Constants
  ...explodeString(type.Constant, "DOOM|HERETIC|HEXEN|STRIFE|CHEX|READTHIS|SWAPMENU|WINDOWS|UNIX|MAC|OPENAL|LOADMENU|SAVEMENU|PLAYERMENU|JOYSTICKCONFIGMENU|GAMEPLAYMENU|COMPATIBILITYMENU|VIDEOMODEMENU")
];

export default globalValues;