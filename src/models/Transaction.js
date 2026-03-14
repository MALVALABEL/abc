import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['recharge', 'debit', 'refund_request', 'refund_approved', 'refund_rejected'],
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, default: '' },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      default: null,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
    },
    receiptUrl: { type: String, default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Transaction ||
  mongoose.model('Transaction', transactionSchema);
