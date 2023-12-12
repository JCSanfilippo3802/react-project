const models = require('../models');

const { Account } = models;
const { File } = models;
const { Image } = models;

const makerPage = (req, res) => res.render('app');

const becomeSubscriber = async (req, res) => {
  try {
    await Account.findOneAndUpdate(
      { username: req.session.account.username },
      { subscriber: true },
    );
    return res.status(204).json({ redirect: '/maker' });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured!' });
  }
};

const uploadImage = async (req, res) => {
  if (!req.files || !req.files.imageData) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { imageData } = req.files;

  try {
    const newImage = new Image(imageData);

    const doc = await newImage.save();
    return res.status(201).json({
      message: 'Image stored successfully!',
      fileId: doc._id,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Something went wrong uploading image!',
    });
  }
};

const makeFile = async (req, res) => {
  if (!req.body.name || !req.body.dataId || !req.body.year || !req.body.author) {
    return res.status(400).json({ error: 'Data missing!' });
  }
  if (!req.session.account.subscriber) {
    if (await File.find({ username: req.session.account.username }).count >= 3) {
      return res.status(402).json({ error: 'Maximum number of files reached.' });
    }
  }
  const fileData = {
    name: req.body.name,
    dataId: req.body.dataId,
    year: req.body.year,
    author: req.body.author,
    owner: req.session.account._id,
  };

  try {
    const newFile = new File(fileData);
    await newFile.save();
    return res.status(201).json({
      name: newFile.name, dataId: newFile.dataId, year: newFile.year, author: newFile.author,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'File already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making file!' });
  }
};

const updateFile = async (req, res) => {
  if (!req.body.name || !req.body.year || !req.body.author) {
    return res.status(400).json({ error: 'All information is required!' });
  }

  const fileData = {
    name: req.body.name,
    year: req.body.year,
    author: req.body.author,
    owner: req.session.account._id,
  };

  try {
    await File.findOneAndUpdate(
      { name: fileData.name, owner: fileData.owner },
      { year: fileData.year, author: fileData.author },
    );
    return res.status(202).json({
      name: fileData.name, year: fileData.year, author: fileData.author,
    });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured updating file!' });
  }
};

const retrieveImage = async (req, res) => {
  if (!req.query.dataId) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    doc = await Image.findOne({ _id: req.query.dataId }).exec();
  } catch (err) {
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `attachment; filename="${doc.name}"`,
  });

  return res.send(doc.data);
};

const getFiles = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await File.find(query).select('name dataId year author').lean().exec();

    return res.json({ files: docs });
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving files!' });
  }
};

module.exports = {
  makerPage,
  becomeSubscriber,
  makeFile,
  uploadImage,
  updateFile,
  getFiles,
  retrieveImage,
};
