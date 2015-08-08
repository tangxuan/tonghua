'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Member Schema
 */
var MemberSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Member name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	code: {
		type: String,
		unique: '学号已经存在'
	},
	birthday: {
		type: Date,
		required: 'Please fill birthday'
	},
	address: {
		type: String
	},
	phoneNumber: {
		type: String,
		required: 'Please fill Member phone number'
	},
	photo: {
		data: Buffer,
		contentType: String
	},
	lessonCount: {
		type: Number,
	}

});

/**
 * 校验学号不能重复
 */
MemberSchema.pre('save', function(next) {
	// var self = this;
	// if global id defined, use it and update the counter 
	// if (true) {};
	// if not, query it
	// MemberCodeCounterSchema.find().exec(function (err, counter) {
	// 	if (!counter.length) {
	// 		var counter = new MemberCodeCounterSchema({
	// 			nextSeqNumber: 1
	// 		});
	// 		counter.save(function (err) {
				
	// 		})
	// 	}
	// })
	// 		if no counter recorder, insert it


	next();
});

mongoose.model('Member', MemberSchema);

/**
 * 会员学号计数器 Schema, for auto increment 
 */
var MemberCodeCounterSchema = new Schema({
	nextSeqNumber: { type: Number, default: 1 }
});

mongoose.model('MemberCodeCounter', MemberCodeCounterSchema);