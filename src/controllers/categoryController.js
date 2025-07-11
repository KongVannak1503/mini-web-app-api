const Category = require("../models/Category");

// Get all 
exports.getCategories = async (req, res) => {
    try {
        const getCategories = await Category.find().populate('createdBy', 'name').sort({ updatedAt: -1 });;
        res.json(getCategories);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: err.message });
    }
};

exports.getCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const getCategory = await Category.findById(id);
        if (!getCategory) return res.status(404).json({ message: "Category not found" });
        res.json(getCategory);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: err.message });
    }
}

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    console.log(req.body);

    try {
        if (!name) {
            return res.status(400).json({ message: "name field is required" });
        }

        const createCategory = new Category({ name, description, createdBy: req.user.id });
        await createCategory.save();
        await createCategory.populate('createdBy', 'name');
        res.status(201).json({ message: 'success', data: createCategory });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        let getCategory = await Category.findById(id);
        if (!getCategory) return res.status(404).json({ message: "Category not found" });

        if (!name) return res.status(400).json({ message: "name field is required" });

        let updateCategory = await Category.findByIdAndUpdate(
            id,
            { name, description, updatedBy: req.user.id },
            { new: true }
        ).populate('createdAt', 'name').populate('updatedBy', 'name');

        res.status(200).json({ message: "success", data: updateCategory });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getCategoryCount = async (req, res) => {
    try {
        const categoryCount = await Category.countDocuments();

        res.status(200).json({
            data: categoryCount,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching counts', error: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        if (!deleteCategory) return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Deleted successfully!" });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
}