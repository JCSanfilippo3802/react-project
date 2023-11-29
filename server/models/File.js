const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  data: {
    type: Image,
    required: true,
  },
  year: {
    type: Number,
    min: 1990,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

FileSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  year: doc.year,
  desc: doc.desc,
});

const FileModel = mongoose.model('File', FileSchema);
module.exports = FileModel;
