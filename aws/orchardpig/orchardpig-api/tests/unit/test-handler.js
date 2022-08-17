/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';

import { orchardpigLambdaPostHandler } from '../../post.js';
import { expect as _expect } from 'chai';
import { describe, it } from 'chai';
const expect = _expect;
var event, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await orchardpigLambdaPostHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("hello world");
        // expect(response.location).to.be.an("string");
    });
});
