import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, default: '' },
    maxSlots: { type: Number, required: true, min: 2 },
    reservedSlots: { type: Number, default: 0 },
    pricePerSlot: { type: Number, default: 0 },
    paymentInfo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['open', 'closed', 'completed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

matchSchema.virtual('availableSlots').get(function () {
  return this.maxSlots - this.reservedSlots;
});

matchSchema.set('toJSON', { virtuals: true });
matchSchema.set('toObject', { virtuals: true });

matchSchema.index({ date: 1 });
matchSchema.index({ status: 1 });

export default mongoose.models.Match || mongoose.model('Match', matchSchema);
