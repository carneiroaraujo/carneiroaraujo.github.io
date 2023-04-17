/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as goog from '../../closure/goog/goog.js';
goog.declareModuleId('Blockly.serialization.variables');
import * as priorities from './priorities.js';
import * as serializationRegistry from './registry.js';
/**
 * Serializer for saving and loading variable state.
 */
export class VariableSerializer {
    /* eslint-disable-next-line require-jsdoc */
    constructor() {
        /** The priority for deserializing variables. */
        this.priority = priorities.VARIABLES;
    }
    /**
     * Serializes the variables of the given workspace.
     *
     * @param workspace The workspace to save the variables of.
     * @returns The state of the workspace's variables, or null if there are no
     *     variables.
     */
    save(workspace) {
        const variableStates = [];
        for (const variable of workspace.getAllVariables()) {
            const state = {
                'name': variable.name,
                'id': variable.getId(),
            };
            if (variable.type) {
                state['type'] = variable.type;
            }
            variableStates.push(state);
        }
        // AnyDuringMigration because:  Type '{ name: string; id: string; }[] |
        // null' is not assignable to type 'State[] | null'.
        return (variableStates.length ? variableStates : null);
    }
    /**
     * Deserializes the variable defined by the given state into the given
     * workspace.
     *
     * @param state The state of the variables to deserialize.
     * @param workspace The workspace to deserialize into.
     */
    load(state, workspace) {
        for (const varState of state) {
            workspace.createVariable(varState['name'], varState['type'], varState['id']);
        }
    }
    /**
     * Disposes of any variables that exist on the workspace.
     *
     * @param workspace The workspace to clear the variables of.
     */
    clear(workspace) {
        workspace.getVariableMap().clear();
    }
}
serializationRegistry.register('variables', new VariableSerializer());
//# sourceMappingURL=variables.js.map