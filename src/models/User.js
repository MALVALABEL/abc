import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    preferredDays: [{ type: String }],
    preferredTime: { type: String, default: '' },
    isGoalkeeper: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ phone: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
