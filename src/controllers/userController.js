const path = require('path');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const fs = require('fs');
// Get all users
exports.getUsers = async (req, res) => {
    try {

        const getUsers = await User.find()
            .populate('createdBy', 'name')
            .populate('image_url', 'path')
            .select('-password').sort({ updatedAt: -1 });
        res.json(getUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get  user
exports.getUser = async (req, res) => {
    try {

        const getUsers = await User.findById(req.params.id)
            .populate('image_url', 'path').select('-password');
        console.log(this.getUsers);

        res.json(getUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, phone, role, password, address, country, city } = req.body;
        let imageUrl = null;

        if (req.file) {
            const { filename, size, mimetype, originalname } = req.file;
            const folder = 'employees';

            const file = new File({
                name: originalname,
                filename,
                size: (size / (1024 * 1024)).toFixed(2) + 'MB',
                type: mimetype,
                path: `uploads/${folder}/${filename}`,
                createdBy: req.user?._id,
            });

            await file.save();
            imageUrl = file._id;
        }

        const newUser = new User({
            name,
            email,
            phone,
            role,
            password,
            address,
            country,
            city,
            image_url: imageUrl,
            createdBy: req.user?._id,
        });


        const getUser = await newUser.save();
        const getUsers = await User.findById(getUser._id).populate('image_url', 'path').select('-password');
        const userObj = newUser.toObject();
        delete userObj.password;

        res.status(201).json({ message: 'User created', data: getUsers });
    } catch (err) {
        console.error('Create Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// Update User by ID (Handles Image Replacement)

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role, password, address, country, city, isActive } = req.body;

    try {
        let user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        let imageUrl = user.image_url; // keep old image by default

        // ✅ If new file is uploaded
        if (req.file) {
            const { filename, size, mimetype, originalname } = req.file;
            const folder = 'employees';

            // 1. Save new file
            const file = new File({
                name: originalname,
                filename,
                size: (size / (1024 * 1024)).toFixed(2) + 'MB',
                type: mimetype,
                path: `uploads/${folder}/${filename}`,
                createdBy: req.user?._id,
            });
            await file.save();
            imageUrl = file._id;

            // 2. Delete old file record and optional file on disk
            if (user.image_url) {
                const oldFile = await File.findById(user.image_url);
                if (oldFile) {
                    // Optional: delete from disk
                    const filePath = path.join(__dirname, '..', oldFile.path);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }

                    // Remove old file record
                    await oldFile.deleteOne();
                }
            }
        }

        // Hash new password if provided
        let updatedPassword = user.password;
        if (password) {
            updatedPassword = await bcrypt.hash(password, 10);
        }

        // ✅ Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                name,
                email,
                phone,
                role,
                password: updatedPassword,
                address,
                country,
                city,
                isActive,
                image_url: imageUrl,
                updatedBy: req.user?._id,
            },
            { new: true }
        );
        const getUsers = await User.findById(req.params.id)
            .populate('image_url', 'path').select('-password');

        res.status(200).json({ message: 'User updated successfully', data: getUsers });
    } catch (err) {
        console.error('Update Error:', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'user not found' });
        res.json({ message: 'user deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const File = require('../models/upload');

exports.uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { filename, size, mimetype, path: filePath, originalname } = req.file;
        const folder = 'users';

        const file = new File({
            name: originalname,
            filename,
            size: (size / (1024 * 1024)).toFixed(2) + 'MB',
            type: mimetype,
            path: `uploads/${folder}/${filename}`, // ← more accurate
            createdBy: req.user?._id // avoid crash if user is undefined
        });

        await file.save();

        res.status(201).json({ message: 'File uploaded', file });
    } catch (err) {
        console.error('Upload Error:', err); // <== ADD THIS
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};


exports.uploadMultipleFiles = async (req, res) => {
    try {
        const files = await Promise.all(req.files.map(file => {
            return File.create({
                filename: file.filename,
                size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
                type: file.mimetype,
                path: file.path,
                createdBy: req.user._id
            });
        }));

        res.status(201).json({ message: 'Files uploaded', files });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
