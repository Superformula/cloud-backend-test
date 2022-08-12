import * as _ from 'lodash';
import { AxiosResponse } from 'axios';
import * as chai from 'chai';
import chaiShallowDeepEqual from 'chai-shallow-deep-equal';

chai.use(chaiShallowDeepEqual);

const expect = chai.expect;

export default function checkResult(
  res: AxiosResponse,
  statusCode: number,
  body: Record<string, unknown> | []
): void {
  expect(res.status).to.equal(statusCode);
  if (_.isArray(res.data)) {
    expect(res.data).to.have.lengthOf(_.size(body));
  }
  expect(res.data).to.shallowDeepEqual(body);
}

