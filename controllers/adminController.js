const User = require('../routes/User');  // تأكد من المسار الصحيح للـ User model
const bcrypt = require('bcrypt');

// دالة لإنشاء الأدمن
const createAdmin = async () => {
  try {
    // البحث عن الأدمن الحالي
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (!existingAdmin) {
      // تشفير كلمة المرور
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      
      // إنشاء مستخدم الأدمن
      const admin = new User({
        name: 'Admin',  // أو username إذا كان ذلك هو الحقل المستخدم في موديلك
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log('Admin user created!');
    } else {
      console.log('Admin already exists!');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }
};

module.exports = { createAdmin };
