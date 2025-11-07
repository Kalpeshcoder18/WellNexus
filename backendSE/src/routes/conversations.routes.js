const express = require('express');
const router = express.Router();
const convos = require('../controllers/conversations.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/get-or-create', requireAuth, convos.getOrCreateConversation);
router.get('/', requireAuth, convos.listConversations);
router.get('/:id/messages', requireAuth, convos.getMessages);
router.post('/messages', requireAuth, convos.postMessage);

module.exports = router;
