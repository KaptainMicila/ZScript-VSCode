/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { CompletionItemKind } from "vscode";
import { explodeString, ICompletionTree } from "../utils";

export const KEYWORDS: ICompletionTree[] = [
  ...explodeString(CompletionItemKind.Keyword, "switch|case|break|if|else|while|for|return|class|struct|states|default|let|is|replaces"),
  { name: "loop", docs: "Jumps to the most recently defined state label. This is used for a looping animation. Do not put a loop on a state with a duration of -1, this is unnecessary and can cause problems.", type: CompletionItemKind.Keyword },
  { name: "stop", docs: "Stops animating this actor. Normally this is used at the end of the death sequences. If the last state has a duration > -1 the actor will be removed. Note that if a state contains only the stop instruction, the actor will behave as if it doesn't have that state. This can be useful, for example, to remove a state that an actor has inherited from its parent.", type: CompletionItemKind.Keyword },
  { name: "wait", docs: "Loops the last defined state. This is useful if a code pointer is used that waits a given time or for a certain event. Currently useful code pointers include A_WeaponReady, A_Raise, A_FreezeDeathChunks, and similar code pointer functionality.", type: CompletionItemKind.Keyword },
  { name: "fail", docs: "Used with custom inventory items, means that the state sequence failed to succeed.", type: CompletionItemKind.Keyword },
  { name: "goto", description: "goto label [+offset]", docs: "Jumps to an arbitrary state in the current actor. With this, you can also jump to a base class state, i.e. one that was inherited by a parent. The statement goto See jumps to the walking animation that has been overriden in the current actor class, or if such does not exist, to the inherited class's state. goto is however static, i.e. will not do virtual jumps — for that, see A_Jump.\nOffset specifies the number of frames to skip after the specified label. That is, using \"goto Spawn+2\" will jump to this frame:\n\n\tSpawn:\n\tTNT1 AAAAAAAA 0\n\nIn addition, if an actor is using inheritance, you can use goto with the scope operator (::) to go to a parent class' state. The keyword \"super\" always refers to the immediate parent, but any parent class can be referred to by name as well, for example \"goto Actor::GenericFreezeDeath\" is a valid instruction.", type: CompletionItemKind.Keyword },
];
