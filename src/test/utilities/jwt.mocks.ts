import nock from 'nock';
import { Url } from 'url';
import { JWKRSAKey } from 'jose';
import conf from '../../conf';

export default class JWTMocker {
  nock: (basePath: string | RegExp | Url, options?: nock.Options) => nock.Scope;
  constructor() {
    this.nock = nock;
  }

  getJWKS(statusCode: number, key: JWKRSAKey, overrides = {}): void {
    nock(conf.jwtTokens.authority)
      .get('/.well-known/jwks.json')
      .reply(statusCode, { keys: [key] }, overrides);
  }

  clearMocks(): void {
    nock.cleanAll();
  }
}
