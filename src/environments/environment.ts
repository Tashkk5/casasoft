// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v717demo1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api',
  nutroapikey: '3d01ebdfea1b4a4ca4dbf3aed3152c6c',
  nutroapi: 'https://api.spoonacular.com/food/ingredients/search',
  nutroinfoapi: 'https://api.spoonacular.com/food/ingredients',
  awsputapi: 'https://pfdm8otr80.execute-api.us-east-1.amazonaws.com/prod/putitem',
  awsgetapi: 'https://pfdm8otr80.execute-api.us-east-1.amazonaws.com/prod/casasoft',
  awsdeleteapi: 'https://pfdm8otr80.execute-api.us-east-1.amazonaws.com/prod/deleteitem'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
