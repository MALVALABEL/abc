import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    playerName: { type: String, required: true },
    playerPhone: { type: String, required: true },
    status: {
      type: String,
      enum: [
        'pending_payment',
        'payment_uploaded',
        'confirmed',
        'rejected',
        'expired',
        'cancelled',
      ],
      default: 'pending_payment',
    },
    receiptUrl: { type: String, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

reservationSchema.index({ matchId: 1, status: 1 });
reservationSchema.index({ expiresAt: 1 });

export default mongoose.models.Reservation ||
  mongoose.model('Reservation', reservationSchema);
