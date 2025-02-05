const User = require('../models/userModel');
const Token = require('../models/tokenModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.signup = async (req, res) => {
  const { nationalCode, email, password } = req.body;

  if (!nationalCode || !email || !password) {
    console.log('فیلدهای ناقص در درخواست ثبت‌نام');
    return res.status(400).json({ message: 'تمامی فیلدها الزامی هستند' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'کاربر قبلاً ثبت‌نام کرده است' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('گذرواژه با موفقیت هش شد');

    const newUser = new User({
      nationalCode,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('کاربر جدید با موفقیت ثبت‌نام شد:', newUser);

    res.status(201).json({ message: 'کاربر با موفقیت ثبت‌نام شد', user: newUser });
  } catch (error) {
    console.error('خطا در هنگام ثبت‌نام:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.login = async (req, res) => {
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('فیلد ایمیل یا گذرواژه در درخواست ورود ناقص است');
    return res.status(400).json({ message: 'ایمیل و گذرواژه الزامی هستند' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('کاربر یافت نشد:', email);
      return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('گذرواژه نامعتبر برای کاربر:', email);
      return res.status(401).json({ message: 'اطلاعات ورود نامعتبر است' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET, 
      { expiresIn: '10h' }
    );

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const tokenDocument = new Token({
      userId: user._id,
      token: token,
      expiresAt: expiresAt,
    });

    await tokenDocument.save();

    res.status(200).json({
      message: 'ورود با موفقیت انجام شد',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        completedProfile: user.completedProfile,
      },
    });
  } catch (error) {
    console.error('خطا در هنگام ورود:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};


exports.updateProfile = async (req, res) => {
  
  const { userId, firstName, lastName, birthDate, mobile } = req.body;

  if (!userId || !firstName || !lastName || !birthDate || !mobile) {
    console.log('فیلدهای ناقص در درخواست به‌روزرسانی پروفایل:', { userId, firstName, lastName, birthDate, mobile });
    return res.status(400).json({ message: 'پر کردن همه فیلدها برای به‌روزرسانی پروفایل الزامی است' });
  }

  const cleanedUserId = String(userId).trim();
  console.log('نوع userId:', typeof cleanedUserId);
  console.log('آیا userId هگزادسیمال معتبر است:', /^[0-9a-fA-F]{24}$/.test(cleanedUserId));

  if (!mongoose.Types.ObjectId.isValid(cleanedUserId)) {
    console.log('فرمت نامعتبر userId پس از حذف فاصله‌ها:', cleanedUserId);
    return res.status(400).json({ message: 'فرمت userId نامعتبر است' });
  }

  const objectId = new mongoose.Types.ObjectId(cleanedUserId); 

  if (isNaN(Date.parse(birthDate))) {
    console.log('فرمت نامعتبر تاریخ تولد:', birthDate);
    return res.status(400).json({ message: 'فرمت تاریخ تولد نامعتبر است. از فرمت YYYY-MM-DD استفاده کنید' });
  }
  if (!/^\d{11}$/.test(mobile)) {
    console.log('شماره موبایل نامعتبر:', mobile);
    return res.status(400).json({ message: 'شماره موبایل باید ۱۱ رقم باشد' });
  }

  try {
    const user = await User.findById(objectId);
    if (!user) {
     return res.status(404).json({ message: 'کاربر یافت نشد' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.birthDate = new Date(birthDate);
    user.mobile = mobile.toString();
    user.completedProfile = true;

    await user.save();

    console.log('پروفایل کاربر با موفقیت به‌روزرسانی شد:', user);
    res.status(200).json({ message: 'پروفایل با موفقیت به‌روزرسانی شد', user });
  } catch (error) {
    console.error('خطا در هنگام به‌روزرسانی پروفایل:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};

exports.logout = (req, res) => {
  console.log('درخواست خروج دریافت شد');
  res.status(200).json({ message: 'خروج با موفقیت انجام شد. لطفاً توکن را از سمت کلاینت حذف کنید.' });
};
