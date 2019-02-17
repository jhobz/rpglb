// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { config as envConfig } from 'dotenv'
envConfig()

export const environment = {
	production: false,
	apiUrl: 'http://localhost:3000/api',
	stripeKey: 'pk_test_Vd1wA58eMFlU1G4u5MIEdAcY'
}
