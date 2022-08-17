import { JWK, JWKRSAKey } from 'jose';
import jwt from 'jsonwebtoken';
import conf from '../../conf';
import _ from 'lodash';

export interface JWTPayload {
  scope?: string;
}

const TEST_KEYID = 'VALID_TEST_KEY_BUT_NOT_REAL_KEY_EH';

const jwk = JWK.generateSync('RSA', undefined, {
  use: 'sig',
  kid: TEST_KEYID,
});

export interface Options {
  algorithm: string;
  expiresIn: string;
  notBefore: string;
  audience: string;
  issuer: string;
  keyid: string;
}

const jwkPrivateKey = jwk.toPEM(true);

export const jwkPublicGood: JWKRSAKey = jwk.toJWK(false);

export function makeJwtToken(payload: JWTPayload, options?: Options): string {
  return jwt.sign(
    _.defaultTo(payload, {}),
    jwkPrivateKey,
    _.defaultsDeep(options, {
      algorithm: 'RS256',
      expiresIn: '5m',
      notBefore: '-5m',
      audience: conf.jwtTokens.audience,
      issuer: conf.jwtTokens.authority,
      keyid: TEST_KEYID,
    })
  );
}
