// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const host = "http://localhost:3000";
// const host = "https://api.uovt.tk";

export const environment = {
    production: true, // false
    host,
    apiUrl: `${host}/api`,
    socketUrl: `${host}/socket`,
    onesignalAppId: "a6b799db-1421-4b8b-a5d6-13a0a2db87f8",
    inputs: {
        max: 50,
        min: 3,
    },
    tables: {
        row: {
            height: 50,
        },
    },
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
