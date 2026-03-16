import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

adminSchema.index({ username: 1 });

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
