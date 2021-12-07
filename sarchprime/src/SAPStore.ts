/**
 * Light-weight flux-architecture state management.
 */
import { reactive } from 'vue';

const PORT:number = 8081;



type SAPFetchResponse = {
    readonly success:boolean,
    payload?:any
}

/**
 * Routes:
 *  - conn: try connect to SAPServer.
 */
async function SAPFetch(route:string):Promise<SAPFetchResponse> {
    let fetchOpts:RequestInit = {
        mode: 'cors'
    };

    let response = {};

    switch (route) {
        case 'conn':
            fetchOpts.method = 'GET';
            break;
        default: break;
    }

    await fetch(`http://localhost:${PORT}/${route}`, fetchOpts)
        .then(res => {
            console.log(res);

            response = {
                success: res.ok
            };
        })
        .catch(err => {
            response = {
                success: false
            };
        });

    return (response as SAPFetchResponse);
}



const SAPStore = reactive({
    // Private states.
    _state: {
        // boolean/True if connected to SAPServer.
        SERVER: false,
    },
    
    // Public state getters.
    serverState():boolean { return this._state.SERVER; },

    // Public mutations.
    async connect():Promise<boolean> {
        let res:SAPFetchResponse = await SAPFetch('conn');

        this._state.SERVER = res.success;

        return this.serverState();
    },
    disconnect():void {
        this._state.SERVER = false;
    }
});



export default SAPStore;