/**
 * Light-weight flux-architecture state management.
 */
import { reactive } from 'vue';

export default reactive({
    _state: {
        // boolean/Whether SAPServer is on.
        SERVER: false,
    },
    
    // State getters.
    serverState():boolean { return this._state.SERVER; },
    
    // Mutations.
    flipServer():void { this._state.SERVER = !this._state.SERVER; }
});