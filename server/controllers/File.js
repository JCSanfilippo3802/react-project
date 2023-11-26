const models = require('../models');

const { File } = models;

const makerPage = (req, res) => res.render('app');

const makeFile = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, and level are required!' });
  }

  const fileData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newFile = new File(fileData);
    await newFile.save();
    return res.status(201).json({
      name: newFile.name, age: newFile.age, level: newFile.level,
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
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, age, and level are required!' });
  }

  const fileData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    await File.findOneAndUpdate(
      { name: fileData.name, owner: fileData.owner }, 
      { age: fileData.age, level: fileData.level });
    return res.status(202).json({
      name: fileData.name, age: fileData.age, level: fileData.level,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured updating file!' });
  }
};

const getFiles = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await File.find(query).select('name age level').lean().exec();

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
