'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	Member = mongoose.model('Member'),
	MemberCodeCounter = mongoose.model('MemberCodeCounter');

/**
 * Globals
 */
var member, memberCounter;

/**
 * Unit tests
 */
describe('Member Model Unit Tests:', function() {
	beforeEach(function(done) {
		member = new Member({
			name: 'member1',
			birthday: Date.now(),
			address: '龙湖时代天街',
			phoneNumber: '12345678',
			lesson: {
				count: 100,
				type: '初级'
			}
		});

		done();
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return member.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		xit('should be able to show an error when try to save without name', function(done) { 
			member.name = '';

			return member.save(function(err) {
				should.exist(err);
				done();
			});
		});

		it('should auto incrase the code', function (done) {
			var prevCode;

			return member.save(function () {
				Member.find().sort('-created').populate('code').exec(function (err, members) {
					prevCode = members[0].code;
					console.log(members.code);
					member.save(function (err, _member, numberAffected) {
						should.equal(_member.code, prevCode + 1);
						done();
					});
				});
			});

		});
	});

	afterEach(function(done) { 
		Member.remove().exec();

		done();
	});
});