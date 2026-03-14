import mongoose from 'mongoose';

const queueEntrySchema = new mongoose.Schema(
  {
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    playerName: { type: String, required: true },
    playerPhone: { type: String, required: true },
    isGoalkeeper: { type: Boolean, default: false },
    position: { type: Number, required: true },
    status: {
      type: String,
      enum: ['waiting', 'notified', 'reserved', 'expired', 'cancelled'],
      default: 'waiting',
    },
    notifiedAt: { type: Date, default: null },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

queueEntrySchema.index({ matchId: 1, status: 1, position: 1 });

export default mongoose.models.QueueEntry ||
  mongoose.model('QueueEntry', queueEntrySchema);
