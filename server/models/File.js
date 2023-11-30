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
    type: ObjectId,
    required: true,
  },
  year: {
    type: Number,
    min: 1990,
    required: true,
  },
  author: {
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
  data: doc.data,
  year: doc.year,
  author: doc.author,
});

const FileModel = mongoose.model('File', FileSchema);
module.exports = FileModel;
