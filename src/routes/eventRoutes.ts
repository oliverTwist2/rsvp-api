import express from 'express';
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '../controllers/eventController';
import { protectRoute } from '../middlewares/authMiddleware';
import { validateEventBody, verifyEventOwner } from '../middlewares/eventMiddleware';



const router = express.Router();

router.get('/', getAllEvents);
router.post('/', protectRoute, validateEventBody, createEvent);
router.put('/:id', protectRoute, verifyEventOwner, updateEvent);
router.delete('/:id', protectRoute, verifyEventOwner, deleteEvent);

export default router;