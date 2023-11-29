const models = require('../models');

const { File } = models;

const makerPage = (req, res) => res.render('app');

const makeFile = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, and level are required!' });
  }

  const fileData = {
    name: req.body.name,
    year: req.body.year,
    desc: req.body.desc,
    owner: req.session.account._id,
  };

  try {
    const newFile = new File(fileData);
    await newFile.save();
    return res.status(201).json({
      name: newFile.name, data: newFile.data, year: newFile.year, desc: newFile.desc,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'File already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making file!' });
  }
};

const updateFile = async (req, res) => {
  if (!req.body.name || !req.body.year || !req.body.desc) {
    return res.status(400).json({ error: 'All information is required!' });
  }

  const fileData = {
    name: req.body.name,
    year: req.body.year,
    desc: req.body.desc,
    owner: req.session.account._id,
  };

  try {
    await File.findOneAndUpdate(
      { name: fileData.name, owner: fileData.owner }, 
      { year: fileData.year, desc: fileData.desc });
    return res.status(202).json({
      name: fileData.name, year: fileData.year, desc: fileData.desc,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured updating file!' });
  }
};

const uploadFile = async (req, res) => {
  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { sampleFile } = req.files;

  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({
      message: 'File stored successfully!',
      fileId: doc._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Something went wrong uploading file!',
    });
  }
};

const retrieveFile = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    doc = await File.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  res.set({
    'Content-Type': doc.mimetype,

    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"`, /* `attachment; filename="${doc.name}"` */
  });

  return res.send(doc.data);
};

const getFiles = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }
  try {
    const query = { owner: req.session.account._id };
    const docs = await File.find(query).select('name year desc').lean().exec();

    return res.json({ files: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving files!' });
  }
};

module.exports = {
  makerPage,
  makeFile,
  updateFile,
  getFiles,
};
