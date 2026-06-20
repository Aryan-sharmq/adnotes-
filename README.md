import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    verifyToken: String,
    verifyTokenExp: Date,
    resetToken: String,
    resetTokenExp: Date,

    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
      defaultView: { type: String, enum: ['grid', 'list'], default: 'grid' },
      defaultColor: { type: String, default: 'default' },
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.checkPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Safe object to send to the client (never leaks hash/tokens).
userSchema.methods.toPublic = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    isVerified: this.isVerified,
    settings: this.settings,
    createdAt: this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
