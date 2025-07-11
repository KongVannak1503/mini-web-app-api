const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    pax: { type: String },
    description: { type: String },
    note: { type: String },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false,
        default: null,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', categorySchema);
