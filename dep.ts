// Singles
import { parseURL, withQuery, getQuery } from "https://esm.sh/ufo@0.7.9";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";
import { everyMinute } from "https://deno.land/x/deno_cron@v1.0.0/cron.ts";
import { hash, verify } from "https://denopkg.com/denorg/scrypt@v2.1.0/mod.ts";
import {
	walkSync,
	exists,
	emptyDir,
} from "https://deno.land/std@0.110.0/fs/mod.ts";

// NanoID
import { customAlphabet } from "https://deno.land/x/nanoid@v3.0.0/mod.ts";
import { nolookalikesSafe } from "https://esm.sh/nanoid-dictionary@5.0.0-beta.1";

// DayJS
import dayjs from "https://cdn.skypack.dev/dayjs@1.10.7";
import duration from "https://cdn.skypack.dev/dayjs@1.10.7/plugin/duration";

// Oak
import {
	Application,
	Router,
	Status,
	helpers,
	Response,
	Request,
	Cookies,
} from "https://deno.land/x/oak@v9.0.1/mod.ts";
import {
	RouterContext,
	RouteParams,
} from "https://deno.land/x/oak@v9.0.1/router.ts";

// Jose
import { generateSecret } from "https://deno.land/x/jose@v3.20.1/util/generate_secret.ts";
import { exportJWK } from "https://deno.land/x/jose@v3.20.1/key/export.ts";
import { importJWK } from "https://deno.land/x/jose@v3.20.1/key/import.ts";
import { KeyLike } from "https://deno.land/x/jose@v3.20.1/types.d.ts";
import { SignJWT } from "https://deno.land/x/jose@v3.20.1/jwt/sign.ts";
import { jwtVerify } from "https://deno.land/x/jose@v3.20.1/jwt/verify.ts";
import {
	JWSInvalid,
	JWTExpired,
} from "https://deno.land/x/jose@v3.20.1/util/errors.ts";

export {
	walkSync,
	customAlphabet,
	nolookalikesSafe,
	emptyDir,
	parseURL,
	Database,
	Application,
	Router,
	exists,
	Status,
	helpers,
	everyMinute,
	dayjs,
	duration,
	hash,
	verify,
	Response,
	Request,
	generateSecret,
	exportJWK,
	importJWK,
	SignJWT,
	Cookies,
	jwtVerify,
	JWTExpired,
	JWSInvalid,
	withQuery,
	getQuery,
};

export type { RouterContext, RouteParams, KeyLike };
