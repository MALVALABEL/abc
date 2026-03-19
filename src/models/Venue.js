import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    imageUrl: { type: String, required: true },
    schedule: { type: String, default: '' },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

venueSchema.index({ active: 1, order: 1 });

export default mongoose.models.Venue || mongoose.model('Venue', venueSchema);
