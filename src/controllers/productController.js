const Product = require("../models/Product");

// Get all 
exports.getProducts = async (req, res) => {
    try {
        const getProducts = await Product.find().populate('categoryId', 'name').populate('createdBy', 'name').sort({ updatedAt: -1 });;
        res.json(getProducts);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const getProduct = await Product.findById(id).populate('categoryId', 'name');
        if (!getProduct) return res.status(404).json({ message: "Category not found" });
        res.json(getProduct);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: err.message });
    }
}
exports.createProduct = async (req, res) => {
    const { name, sku, price, pax, categoryId, description, note } = req.body;
    console.log(req.body);

    try {
        if (!name) {
            return res.status(400).json({ message: "name field is required" });
        }

        const createProduct = new Product({
            name,
            sku,
            price,
            pax,
            categoryId,
            description,
            note,
            createdBy: req.user.id
        });

        await createProduct.save();

        const populatedProduct = await Product.findById(createProduct._id)
            .populate('categoryId', 'name');

        res.status(201).json({ message: 'success', data: populatedProduct });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, sku, price, pax, categoryId, description, note } = req.body;
    try {
        let getCategory = await Product.findById(id);
        if (!getCategory) return res.status(404).json({ message: "Category not found" });

        if (!name) return res.status(400).json({ message: "name field is required" });

        let updateProduct = await Product.findByIdAndUpdate(
            id,
            { name, sku, price, pax, categoryId, description, note, updatedBy: req.user.id },
            { new: true }
        ).populate('categoryId', 'name').populate('createdAt', 'name').populate('updatedBy', 'name');

        res.status(200).json({ message: "success", data: updateProduct });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getProductCount = async (req, res) => {
    try {
        const productCount = await Product.countDocuments();
        res.status(200).json({ data: productCount });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching product count', error: err.message });
    }
};
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Deleted successfully!" });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}