import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage }); // TODO: Add authentication middleware if needed, e.g. router.use(authMiddleware);

router.post('/cv', upload.single('cv'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Save file info to DB if needed
    // Example: const uploadRecord = await Upload.create({ filename: file.filename, path: file.path, ... });
    res.status(201).json({ filename: file.filename, path: file.path });
  } catch (e) {
    console.error('Error uploading file:', e);
    res.status(400).json({ error: e.message });
  }
});

router.post('/logo', upload.single('logo'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Save file info to DB if needed
    // Example: const uploadRecord = await Upload.create({ filename: file.filename, path: file.path, ... });
    res.status(201).json({ filename: file.filename, path: file.path });
  } catch (e) {
    console.error('Error uploading file:', e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
