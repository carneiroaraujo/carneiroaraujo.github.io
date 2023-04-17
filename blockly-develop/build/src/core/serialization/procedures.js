/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import * as priorities from './priorities.js';
/**
 * Serializes the given IProcedureModel to JSON.
 *
 * @internal
 */
export function saveProcedure(proc) {
    const state = {
        id: proc.getId(),
        name: proc.getName(),
        returnTypes: proc.getReturnTypes(),
    };
    if (!proc.getParameters().length)
        return state;
    state.parameters = proc.getParameters().map((param) => saveParameter(param));
    return state;
}
/**
 * Serializes the given IParameterModel to JSON.
 *
 * @internal
 */
export function saveParameter(param) {
    const state = {
        id: param.getId(),
        name: param.getName(),
    };
    if (!param.getTypes().length)
        return state;
    state.types = param.getTypes();
    return state;
}
/**
 * Deserializes the given procedure model State from JSON.
 *
 * @internal
 */
export function loadProcedure(procedureModelClass, parameterModelClass, state, workspace) {
    const proc = new procedureModelClass(workspace, state.name, state.id)
        .setReturnTypes(state.returnTypes);
    if (!state.parameters)
        return proc;
    for (const [index, param] of state.parameters.entries()) {
        proc.insertParameter(loadParameter(parameterModelClass, param, workspace), index);
    }
    return proc;
}
/**
 * Deserializes the given ParameterState from JSON.
 *
 * @internal
 */
export function loadParameter(parameterModelClass, state, workspace) {
    const model = new parameterModelClass(workspace, state.name, state.id);
    if (state.types)
        model.setTypes(state.types);
    return model;
}
/** Serializer for saving and loading procedure state. */
export class ProcedureSerializer {
    /**
     * Constructs the procedure serializer.
     *
     * Example usage:
     *   new ProcedureSerializer(MyProcedureModelClass, MyParameterModelClass)
     *
     * @param procedureModelClass The class (implementing IProcedureModel) that
     *     you want this serializer to deserialize.
     * @param parameterModelClass The class (implementing IParameterModel) that
     *     you want this serializer to deserialize.
     */
    constructor(procedureModelClass, parameterModelClass) {
        this.procedureModelClass = procedureModelClass;
        this.parameterModelClass = parameterModelClass;
        this.priority = priorities.PROCEDURES;
    }
    /** Serializes the procedure models of the given workspace. */
    save(workspace) {
        const save = workspace.getProcedureMap().getProcedures().map((proc) => saveProcedure(proc));
        return save.length ? save : null;
    }
    /**
     * Deserializes the procedures models defined by the given state into the
     * workspace.
     */
    load(state, workspace) {
        const map = workspace.getProcedureMap();
        for (const procState of state) {
            map.add(loadProcedure(this.procedureModelClass, this.parameterModelClass, procState, workspace));
        }
    }
    /** Disposes of any procedure models that exist on the workspace. */
    clear(workspace) {
        workspace.getProcedureMap().clear();
    }
}
//# sourceMappingURL=procedures.js.map