const express = require('express');
const multer = require('multer');
const moment = require('moment');
const paperModel = require('../models/paper.model');
const categoryModel = require('../models/category.model');
const tagModel = require('../models/tag.model');
const { authUser, authRole } = require('../middlewares/auth.mdw');
const { sortHelper } = require('../helpers/sort');
// const fs = require("fs");

const router = express.Router();

//role editor
router.get(
  '/management',
  authUser,
  authRole('editor'),
  async function (req, res) {
    const editorId = req.session.authUser.UserID;
    const catId = await categoryModel.findCatByEditorId(editorId);
    const papers = await paperModel
      .editorFindByCat(catId[0].CatID)
      .then(sortHelper(req));
    for (i = 0; i < papers.length; i++) {
      papers[i].CreatedAt = moment(papers[i].CreatedAt).format('Do MMMM YYYY');
    }
    res.render('vwEditor/management', {
      papers: papers,
      active: { editorManagement: true },
    });
  },
);

router.get(
  '/management/paper/:id',
  authUser,
  authRole('editor'),
  async function (req, res) {
    const editorId = +req.session.authUser.UserID;
    const role = req.session.authUser.Role;
    const paperId = +req.params.id || 0;
    const paper = await paperModel.findById(paperId);
    const catIdOfEditor = await categoryModel.findCatByEditorId(editorId);

    if (
      role === 'editor' &&
      (paper === null || paper.CatID !== catIdOfEditor[0].CatID)
    ) {
      return res.redirect('/editor/management');
    }
    if (paper.Status === 'Published') return res.redirect('/editor/management');

    if (paper.PublishDate) {
      paper.rawPublishDate = moment(paper.PublishDate).format('DD/MM/YYYY');
      paper.PublishDate = moment(paper.PublishDate).format('Do MMMM YYYY');
    }
    const sub_categories = await categoryModel.getSubCategories();

    for (i = 0; i < sub_categories.length; ++i) {
      if (sub_categories[i].SubCatName == paper.SubCatName) {
        sub_categories.splice(i, 1);
      }
    }

    if (paper === null) {
      return res.redirect('/');
    }
    res.render('vwEditor/managementPaperId', {
      paper,
      sub_categories,
    });
  },
);

router.post(
  '/management/paper/:id',
  authUser,
  authRole('editor'),
  async function (req, res) {
    const editorId = +req.session.authUser.UserID;
    const role = req.session.authUser.Role;
    const paperId = +req.params.id || 0;
    const paper = await paperModel.findById(paperId);
    const catIdOfEditor = await categoryModel.findCatByEditorId(editorId);

    if (
      role === 'editor' &&
      (paper === null || paper.CatID !== catIdOfEditor[0].CatID)
    ) {
      return res.redirect('/editor/management');
    }
    if (paper.Status === 'Published' && req.session.authUser.Role !== 'admin')
      return res.redirect('/editor/management');
    const { accept, reject, editorComment } = req.body;
    if (accept) {
      let { raw_dob, sub_categories, tags } = req.body;
      let dateRelease;
      if (raw_dob) {
        dateRelease = moment(raw_dob, 'DD/MM/YYYY').format('YYYY-MM-DD');
      }

      await paperModel.editorAcceptPaper(
        paperId,
        dateRelease,
        sub_categories,
        tags,
        editorComment,
      );
    } else if (reject) {
      await paperModel.editorRejectPaper(paperId, editorComment);
    }
    if (req.session.authUser.Role === 'admin')
      return res.redirect('/admin/papers');
    res.redirect('/editor/management');
  },
);

module.exports = router;
