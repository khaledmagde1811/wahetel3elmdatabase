const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    description: { type: String },
    pdfUrl: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
