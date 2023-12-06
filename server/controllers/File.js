const models = require('../models');

const { File } = models;
const { Image } = models;

const makerPage = (req, res) => res.render('app');

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
    console.log(err);
    return res.status(400).json({
      error: 'Something went wrong uploading image!',
    });
  }
};

const makeFile = async (req, res) => {
  if (!req.body.name || !req.body.dataId || !req.body.year || !req.body.author) {
    console.log(`${req.body.name}, ${req.body.dataId}, ${req.body.year}, ${req.body.author}`);
    return res.status(400).json({ error: 'Data missing!' });
  }

  const fileData = {
    name: req.body.name,
    data: req.body.dataId,
    year: req.body.year,
    author: req.body.author,
    owner: req.session.account._id,
  };

  try {
    const newFile = new File(fileData);
    await newFile.save();
    return res.status(201).json({
      name: newFile.name, data: newFile.data, year: newFile.year, author: newFile.author,
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
    console.log(err);
    return res.status(500).json({ error: 'An error occured updating file!' });
  }
};

const retrieveImage = async (req, res) => {
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
    'Content-Disposition': `attachment; filename="${doc.name}"`,
  });

  return res.send(doc.data);
};

const getFiles = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await File.find(query).select('name data year author').lean().exec();

    return res.json({ files: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving files!' });
  }
};

module.exports = {
  makerPage,
  makeFile,
  uploadImage,
  updateFile,
  getFiles,
  retrieveImage,
};
