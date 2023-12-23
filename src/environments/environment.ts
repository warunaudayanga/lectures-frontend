// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const host = "http://localhost:3000";
// const host = "https://lectures.onrender.com";

export const environment = {
    production: true, // false
    host,
    apiUrl: `${host}/api`,
    socketUrl: `${host}/socket`,
    onesignalAppId: "d9811f53-6402-4128-91f1-f5631207d2f9",
    // onesignalAppId: "4ccf795a-1448-45db-9c30-27b3ddd057be", // Mobile
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
