
const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');


router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// إضافة معلم جديد
router.post('/', async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// الحصول على معلم عبر ID
router.get('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// تحديث معلم عبر ID
router.put('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json(teacher);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// حذف معلم عبر ID
router.delete('/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });
        res.json({ message: "Teacher deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;