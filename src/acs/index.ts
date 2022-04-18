/**
 * Copyright (c) 2022 PROPHESSOR
 * 
 * This software is released under the MIT License.
 * https://opensource.org/licenses/MIT
 */

import { generateProviderByCompletionTree } from '../utils';
import GlobalValues from './GlobalValues';

export default generateProviderByCompletionTree('acs', GlobalValues, false);
