/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { isObservable } from './interfaces/i_observable.js';
export class ObservableProcedureMap extends Map {
    /** @internal */
    constructor() {
        super();
    }
    /**
     * Adds the given procedure model to the procedure map.
     */
    set(id, proc) {
        if (this.get(id) === proc)
            return this;
        super.set(id, proc);
        if (isObservable(proc))
            proc.startPublishing();
        return this;
    }
    /**
     * Deletes the ProcedureModel with the given ID from the procedure map (if it
     * exists).
     */
    delete(id) {
        const proc = this.get(id);
        const existed = super.delete(id);
        if (!existed)
            return existed;
        if (isObservable(proc))
            proc.stopPublishing();
        return existed;
    }
    /**
     * Removes all ProcedureModels from the procedure map.
     */
    clear() {
        if (!this.size)
            return;
        for (const id of this.keys()) {
            this.delete(id);
        }
    }
    /**
     * Adds the given ProcedureModel to the map of procedure models, so that
     * blocks can find it.
     */
    add(proc) {
        return this.set(proc.getId(), proc);
    }
    /**
     * Returns all of the procedures stored in this map.
     */
    getProcedures() {
        return [...this.values()];
    }
}
//# sourceMappingURL=observable_procedure_map.js.map