/* eslint-env mocha */

'use strict';

const {expect} = require('chai');
const externalIPCheck = require('..');

describe('external-ip-check', () => {
  let seneca;

  beforeEach(() => {
    seneca = require('seneca')();
  });

  it('should be loadable by seneca', function (done) {
    this.slow(250);
    seneca.use(externalIPCheck)
      .ready(err => {
        expect(err).to.not.be.defined;
        done();
      });
  });

  it('should not throw when running action "role:external-ip-check,cmd:get-ip"',
    function (done) {
      this.slow(2000);
      seneca.use(externalIPCheck)
        .ready(() => {
          seneca.act({
            role: 'external-ip-check',
            cmd: 'get-ip'
          }, (err) => {
            expect(err).not.to.be.defined;
            done();
          });
        });
    });

  it('should return an IP address', function (done) {
    this.slow(2000);
    this.timeout(5000);
    seneca.use(externalIPCheck)
      .ready(() => {
        seneca.act({
          role: 'external-ip-check',
          cmd: 'get-ip'
        }, (err, result) => {
          if (err) {
            done(err);
            return;
          }
          expect(result)
            .to
            .have
            .property('ip')
            .that
            .matches(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
          done();
        });
      });
  });
});
