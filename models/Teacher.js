const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    audioRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AudioRecord' }]
}, { timestamps: true });

module.exports = mongoose.model('Teacher', TeacherSchema);
    