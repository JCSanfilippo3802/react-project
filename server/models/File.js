const mongoose = require('mongoose');
const _ = require('underscore');
const dataObject = require('./Image');

const setName = (name) => _.escape(name).trim();

const FileSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    set: setName,
  },
  data: {
    type: { type: mongoose.Types.ObjectId, ref: dataObject },
  },
  year: {
    type: Number,
    min: 1990,
  },
  author: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
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
