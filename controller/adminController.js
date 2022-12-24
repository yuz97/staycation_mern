//menambahkan fs untuk upload atau add image/gambar
const path = require('path');
const fs = require('fs-extra');


//import model
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Item = require('../models/Item');
const Image = require('../models/Image');
const Feature = require('../models/Feature');
const Activity = require('../models/Activity');
const Booking = require('../models/Booking');
const Member = require('../models/Member');
const Users = require('../models/Users');

//bcrypt password
const bcrypt = require('bcryptjs');


module.exports = {
    //login 
    viewSignin: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };
            if (req.session.user == null || req.session.user == undefined) {
                res.render('index', {
                    title: 'Staycation | login',
                    alert,
                })
            } else {
                res.redirect('/admin/dashboard');
            }

        } catch (error) {

            res.redirect('/admin/signin');
        }
    },
    actionSignin: async (req, res) => {
        try {
            const {
                username,
                password
            } = req.body;

            const user = await Users.findOne({
                username: username
            });

            if (!user) {
                req.flash('alertMessage', `username tidak ditemukan`);
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) {
                req.flash('alertMessage', `password tidak sesuai`);
                req.flash('alertStatus', 'danger');
                res.redirect('/admin/signin');
            }

            req.session.user = {
                id: user.id,
                username: user.username
            }

            res.redirect('/admin/dashboard')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/signin');
        }
    },
    actionLogout: (req, res) => {
        // session destroy 
        req.session.destroy(function (err) {
            if (err) {
                console.log(err)
            } else {
                req.session = null;
                res.redirect('/admin/signin');
            }
        })

    },
    //dashboard
    viewDashboard: async (req, res) => {
        try {
            const member = await Member.find();
            const booking = await Booking.find();
            const item = await Item.find();
            res.render('admin/dashboard/view_dashboard', {
                title: 'Dashboard',
                user: req.session.user,
                member,
                booking,
                item

            });
        } catch (error) {
            res.redirect('/admin/dashboard');
        }
    },

    //category
    viewCategory: async (req, res) => {
        try {
            const categories = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            }
            res.render('admin/category/view_category', {
                title: 'Category',
                categories,
                alert,
                user: req.session.user
            });


        } catch (error) {
            console.log(error);
        }
    },

    addCategory: async (req, res) => {

        try {
            const {
                name
            } = req.body;
            await Category.create({
                name
            });

            req.flash('alertMessage', 'category berhasil ditambahkan');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }

    },

    editCategory: async (req, res) => {
        try {
            const {
                id,
                name
            } = req.body;

            const category = await Category.findOne({
                _id: id
            });
            category.name = name;
            await category.save();

            req.flash('alertMessage', 'category berhasil diupdate');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const category = await Category.findOne({
                _id: id
            });
            await category.remove();
            req.flash('alertMessage', 'category berhasil dihapus');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');

        }
    },

    //bank
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            }

            res.render('admin/bank/view_bank', {
                title: 'Bank',
                bank,
                alert,
                user: req.session.user
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }

    },

    addBank: async (req, res) => {
        try {
            const {
                nameBank,
                nomorRekening,
                name
            } = req.body;
            //save bank
            await Bank.create({
                nameBank,
                nomorRekening,
                name,
                imageUrl: `images/${req.file.filename}`
            });

            req.flash('alertMessage', 'Success add bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    editBank: async (req, res) => {
        try {
            const {
                id,
                nameBank,
                nomorRekening,
                name
            } = req.body;

            const bank = await Bank.findOne({
                _id: id
            });

            //jika kita tidak mengganti gambar
            if (req.file == undefined) {
                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.name = name
                await bank.save();
                req.flash('alertMessage', 'Success update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');

            } else {
                //jika ingin mengganti gambar
                await fs.unlink(path.join(`public/${bank.imageUrl}`));

                bank.nameBank = nameBank;
                bank.nomorRekening = nomorRekening;
                bank.name = name
                bank.imageUrl = `images/${req.file.filename}`
                await bank.save();

                req.flash('alertMessage', 'Success update bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }

    },
    deleteBank: async (req, res) => {
        try {
            const {
                id
            } = req.params;
            const bank = await Bank.findOne({
                _id: id
            });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'bank berhasil dihapus');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');

        }
    },

    //item
    viewItem: async (req, res) => {
        try {
            const categories = await Category.find();
            const item = await Item.find()
                .populate({
                    path: 'imageId',
                    select: 'id imageUrl'
                })
                .populate({
                    path: 'categoryId',
                    select: 'id name'
                });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };
            res.render('admin/item/view_item', {
                title: 'Item',
                categories,
                item,
                alert,
                action: 'view',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    addItem: async (req, res) => {
        try {
            const {
                title,
                price,
                city,
                about,
                description,
                categoryId
            } = req.body;

            if (req.files.length > 0) {
                const category = await Category.findOne({
                    _id: categoryId
                });
                const item = await Item.create({
                    title,
                    price,
                    city,
                    about,
                    description,
                    categoryId: category._id,
                });

                category.itemId.push({
                    _id: item._id
                });

                await category.save();

                for (let i = 0; i < req.files.length; i++) {
                    const image = await Image.create({
                        imageUrl: `images/${req.files[i].filename}`
                    });

                    item.imageId.push({
                        _id: image._id
                    });

                    await item.save();
                }
                req.flash('alertMessage', 'success add item');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showImageItem: async (req, res) => {
        try {
            const {
                id
            } = req.params;

            const item = await Item.findOne({
                    _id: id
                })
                .populate({
                    path: 'imageId',
                    select: 'id imageUrl'
                });

            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };
            res.render('admin/item/view_item', {
                title: 'Show image',
                item,
                alert,
                action: 'show image',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    showEditItem: async (req, res) => {
        try {
            const {
                id
            } = req.params;

            const item = await Item.findOne({
                _id: id
            }).populate({
                path: 'imageId',
                select: 'id imageUrl'
            }).populate({
                path: 'categoryId',
                select: 'id name'
            });
            const category = await Category.find();
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };
            res.render('admin/item/view_item', {
                title: 'Edit item',
                item,
                alert,
                category,
                action: 'edit',
                user: req.session.user
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    editItem: async (req, res) => {
        try {
            const {
                id
            } = req.params;

            const {
                title,
                about,
                price,
                city,
                description,
                categoryId
            } = req.body;

            const item = await Item.findOne({
                    _id: id
                })
                .populate({
                    path: 'imageId',
                    select: 'id imageUrl'
                }).populate({
                    path: 'categoryId',
                    select: 'id name'
                });

            if (req.files.length > 0) {
                //update dan looping gambar baru
                for (let i = 0; i < item.imageId.length; i++) {

                    const image = await Image.findOne({
                        _id: item.imageId[i]._id
                    });
                    //hapus gambar lama
                    await fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.imageUrl = `images/${req.files[i].filename}`;
                    await image.save();
                }

                item.title = title;
                item.about = about;
                item.price = price;
                item.city = city;
                item.description = description;
                item.categoryId = categoryId;

                await item.save();

                req.flash('alertMessage', 'item berhasil diupdate');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');

            } else {
                item.title = title;
                item.about = about;
                item.price = price;
                item.city = city;
                item.description = description;
                item.categoryId = categoryId;

                await item.save();

                req.flash('alertMessage', 'item berhasil diupdate');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/item');
            }


        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },

    deleteItem: async (req, res) => {
        try {
            const {
                id
            } = req.params;

            const {
                title,
                price,
                city,
                description,
                categoryId
            } = req.body;

            const item = await Item.findOne({
                _id: id
            }).populate('imageId');
            for (let i = 0; i < item.imageId.length; i++) {
                Image.findOne({
                    _id: item.imageId[i]._id
                }).then((image) => {
                    fs.unlink(path.join(`public/${image.imageUrl}`));
                    image.remove();
                }).catch(e => {
                    req.flash('alertMessage', `${e.message}`);
                    req.flash('alertStatus', 'danger');
                    res.redirect('/admin/item');
                });

            }

            await item.remove();
            req.flash('alertMessage', 'item berhasil dihapus');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/item');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/item');
        }
    },
    viewDetailItem: async (req, res) => {
        const {
            itemId
        } = req.params;

        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const feature = await Feature.find({
                itemId: itemId
            });
            const activity = await Activity.find({
                itemId: itemId
            });

            const alert = {
                message: alertMessage,
                status: alertStatus
            }
            res.render('admin/item/detail_item/view_detail_item', {
                title: 'detail-item',
                alert,
                itemId,
                feature,
                activity,
                user: req.session.user
            });

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/detail_item/view_detail_item/${itemId}`);
        }
    },

    addFeature: async (req, res) => {
        const {
            name,
            qty,
            itemId
        } = req.body;
        try {
            if (!req.file) {
                req.flash('alertMessage', `image not found!`);
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const feature = await Feature.create({
                name,
                qty,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({
                _id: itemId
            });
            item.featureId.push({
                _id: feature._id
            });
            await item.save();

            req.flash('alertMessage', `feature berhasil ditambahkan`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }

    },
    editFeature: async (req, res) => {
        const {
            id,
            name,
            qty,
            itemId
        } = req.body;

        try {
            const feature = await Feature.findOne({
                _id: id
            });

            //cek bila tidak update gambar
            if (req.file == undefined) {

                feature.name = name;
                feature.qty = qty;

                await feature.save();
                req.flash('alertMessage', `feature berhasil diupdate`);
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            } else {
                //cek jika update gambar
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                feature.name = name;
                feature.qty = qty;
                feature.imageUrl = `images/${req.file.filename}`;
                await feature.save();

                req.flash('alertMessage', `feature berhasil diupdate`);
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);

            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteFeature: async (req, res) => {
        const {
            id,
            itemId
        } = req.params;
        try {

            const feature = await Feature.findOne({
                _id: id
            });

            const item = await Item.findOne({
                _id: itemId
            }).populate('featureId');

            for (let i = 0; i < item.featureId.length; i++) {
                if (item.featureId[i]._id.toString() == feature._id.toString()) {
                    item.featureId.pull({
                        _id: feature._id
                    });
                    await item.save();

                }
                //hapus gambar
                await fs.unlink(path.join(`public/${feature.imageUrl}`));
                await feature.remove();
            }

            req.flash('alertMessage', `feature berhasil dihapus`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    addActivity: async (req, res) => {
        const {
            name,
            type,
            itemId
        } = req.body;

        try {
            if (!req.file) {
                req.flash('alertMessage', `image not found!`);
                req.flash('alertStatus', 'danger');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);
            }
            const activity = await Activity.create({
                name,
                type,
                itemId,
                imageUrl: `images/${req.file.filename}`
            });

            const item = await Item.findOne({
                _id: itemId
            });
            item.activityId.push({
                _id: activity._id
            });
            await item.save();

            req.flash('alertMessage', `activity berhasil ditambahkan`);
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }


    },

    editActivity: async (req, res) => {
        const {
            id,
            name,
            type,
            itemId
        } = req.body;

        try {
            const activity = await Activity.findOne({
                _id: id
            });
            if (req.file == undefined) {
                activity.name = name;
                activity.type = type;

                await activity.save();

                req.flash('alertMessage', 'activity berhasil diupdate');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);

            } else {
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                activity.name = name;
                activity.type = type;
                activity.imageUrl = `images/${req.file.filename}`;
                activity.save();

                req.flash('alertMessage', 'activity berhasil diupdate');
                req.flash('alertStatus', 'success');
                res.redirect(`/admin/item/show-detail-item/${itemId}`);

            }


        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }
    },
    deleteActivity: async (req, res) => {
        const {
            id,
            itemId
        } = req.params;
        try {
            const activity = await Activity.findOne({
                _id: id
            });

            const item = await Item.findOne({
                _id: itemId
            }).populate('activityId');

            for (let i = 0; i < item.activityId.length; i++) {
                if (item.activityId[i]._id.toString() === activity._id.toString()) {
                    item.activityId.pull({
                        _id: activity._id
                    });
                    await item.save();
                }
                await fs.unlink(path.join(`public/${activity.imageUrl}`));
                await activity.remove();

            }

            req.flash('alertMessage', 'activity berhasil dihapus');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);

        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/item/show-detail-item/${itemId}`);
        }

    },
    viewBooking: async (req, res) => {
        try {
            const booking = await Booking.find().populate('memberId').populate('bankId');
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = {
                message: alertMessage,
                status: alertStatus
            };

            res.render('admin/booking/view_booking', {
                title: 'Booking',
                user: req.session.user,
                booking,
                alert
            });
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/booking`);
        }
    },
    showDetailBooking: async (req, res) => {
        const {
            id
        } = req.params;

        try {
            const booking = await Booking.findOne({
                _id: id
            }).populate('memberId').populate('bankId');

            res.render('admin/booking/show_detail_booking', {
                title: 'Detail Booking',
                user: req.session.user,
                booking
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/booking`);
        }
    },
    actionConfirmation: async (req, res) => {
        const {
            id
        } = req.params;

        try {
            const booking = await Booking.findOne({
                _id: id
            });
            booking.payments.status = 'Accept';
            await booking.save();

            req.flash('alertMessage', 'Success konfirmasi pembayaran');
            req.flash('alertStatus', 'success');
            res.redirect(`/admin/booking`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/booking`);
        }
    },
    actionReject: async (req, res) => {
        const {
            id
        } = req.params;

        try {
            const booking = await Booking.findOne({
                _id: id
            });
            booking.payments.status = 'Reject';
            await booking.save();

            req.flash('alertMessage', 'Success reject pembayaran');
            req.flash('alertStatus', 'warning');
            res.redirect(`/admin/booking`);
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect(`/admin/booking`);
        }
    }
}