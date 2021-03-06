/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const { ConfigUtil, Messenger, MessageHandler } = require('@hyperledger/caliper-core');
const BurrowClient = require('./burrow');

/**
 * Handles the init message. Constructs the Burrow adapter.
 * @param {object} context The context of the message handler object.
 * @param {object} message The message object.
 * @return {Promise<BurrowClient>} The initialized adapter instance.
 * @async
 */
async function initHandler(context, message) {
    return new BurrowClient(context.networkConfigPath, context.workspacePath, context.workerId);
}

/**
 * Main process
 */
async function main (){

    // Create the message client using the specified type
    const type = `${ConfigUtil.get(ConfigUtil.keys.Worker.Communication.Method)}-worker`;
    const messenger = new Messenger({type, sut: 'burrow'});
    await messenger.initialize();

    // Create a handler context for this worker
    const handlerContext = new MessageHandler({
        init: initHandler
    }, messenger);

    // Pass to the messenger to configure
    messenger.configure(handlerContext);

}

main();
