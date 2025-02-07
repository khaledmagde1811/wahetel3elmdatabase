
const mongoose = require('mongoose');

const AudioRecordSchema = new mongoose.Schema({
    title: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    audioUrl: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AudioRecord', AudioRecordSchema);

