/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const {filterByTag} = require('vc-api-test-suite-implementations');
const {klona} = require('klona');
const should = chai.should();
const {testBadRequestError, createRequestBody} = require('./helpers');
const {v4: uuidv4} = require('uuid');
const vc = require('../mock-data/vc.json');

// only use implementations with `VC-API` verifiers.
const {
  match: matchingVerifiers,
  nonMatch: nonMatchingVerifiers
} = filterByTag({verifierTags: ['VC-API']});
const {match: matchingIssuers} = filterByTag({issuerTags: ['VC-API']});

describe('Verify Credential - Data Integrity', function() {
  const summaries = new Set();
  this.summary = summaries;
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.implemented = [...matchingVerifiers.keys()];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Verifier';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  this.notImplemented = [...nonMatchingVerifiers.keys()];
  for(const [verifierName, {verifiers}] of matchingVerifiers) {
    const verifier = verifiers.find(
      verifier => verifier.tags.has('VC-API'));
    describe(verifierName, function() {
      let validVc;
      before(async function() {
        const issuer = matchingIssuers.get('Danube Tech').issuers.find(
          issuer => issuer.tags.has('Ed25519Signature2020'));
        const {issuer: {id: issuerId, options}} = issuer;
        const body = {credential: klona(vc), options};
        body.credential.id = `urn:uuid:${uuidv4()}`;
        body.credential.issuer = issuerId;
        const {data} = await issuer.issue({body});
        validVc = data;
        validVc['@context'].push(
          'https://w3id.org/security/suites/ed25519-2020/v1');
      });
      it('MUST verify a valid VC.', async function() {
        // this tells the test report which cell in the interop matrix
        // the result goes in
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const body = createRequestBody({vc: validVc});
        const {result, error} = await verifier.verify({body});
        should.not.exist(error);
        should.exist(result);
        should.exist(result.status);
        result.status.should.equal(200);
      });
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noContextVc = klona(validVc);
          delete noContextVc['@context'];
          const body = createRequestBody({vc: noContextVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "type" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noTypeVc = klona(validVc);
        delete noTypeVc.type;
        const body = createRequestBody({vc: noTypeVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noIssuerVc = klona(validVc);
        delete noIssuerVc.issuer;
        const body = createRequestBody({vc: noIssuerVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noCredentialSubjectVc = klona(validVc);
          delete noCredentialSubjectVc.credentialSubject;
          const body = createRequestBody({vc: noCredentialSubjectVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noProofVc = klona(validVc);
        delete noProofVc.proof;
        const body = createRequestBody({vc: noProofVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofTypeVc = klona(validVc);
          delete noProofTypeVc.proof.type;
          const body = createRequestBody({vc: noProofTypeVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofCreatedVc = klona(validVc);
          delete noProofCreatedVc.proof.created;
          const body = createRequestBody({vc: noProofCreatedVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofVerificationMethodVc = klona(validVc);
          delete noProofVerificationMethodVc.proof.verificationMethod;
          const body = createRequestBody({vc: noProofVerificationMethodVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofValueVc = klona(validVc);
          delete noProofValueVc.proof.proofValue;
          const body = createRequestBody({vc: noProofValueVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofPurposeVc = klona(validVc);
          delete noProofPurposeVc.proof.proofPurpose;
          const body = createRequestBody({vc: noProofPurposeVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "@context" is not an array.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidContextTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidContextType of invalidContextTypes) {
          copyVc['@context'] = invalidContextType;
          const body = createRequestBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "@context" items are not strings.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidContextItemTypes = [[], {}, null, undefined, 10, true];
          for(const invalidContextItemType of invalidContextItemTypes) {
            copyVc['@context'] = [invalidContextItemType];
            const body = createRequestBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "type" is not an array.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidType of invalidTypes) {
          copyVc.type = invalidType;
          const body = createRequestBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "type" items are not strings.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidTypeItemTypes = [[], {}, null, undefined, 10, true];
        for(const invalidItemType of invalidTypeItemTypes) {
          copyVc.type = [invalidItemType];
          const body = createRequestBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "issuer" is not an object or a string.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidIssuerTypes = [[], null, undefined, 10, true];
          for(const invalidIssuerType of invalidIssuerTypes) {
            copyVc.issuer = invalidIssuerType;
            const body = createRequestBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "credentialSubject" is not an object.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidCredentialSubjectTypes = [
            'string', null, undefined, 10, true, []
          ];
          for(const invalidType of invalidCredentialSubjectTypes) {
            copyVc.credentialSubject = invalidType;
            const body = createRequestBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "proof" is not an object.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidProofTypes = ['string', null, undefined, 10, true, []];
        for(const invalidProofType of invalidProofTypes) {
          copyVc.proof = invalidProofType;
          const body = createRequestBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
    });
  }
});
