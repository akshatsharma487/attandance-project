import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      time: {
        type: Date,
      },
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
    checkOut: {
      time: {
        type: Date,
      },
      location: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-day', 'on-leave'],
      default: 'present',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
