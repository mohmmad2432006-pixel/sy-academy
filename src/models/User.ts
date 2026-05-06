import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  photoURL: String,
  role: {
    type: String,
    enum: ['student', 'teacher', 'sales', 'support', 'editor', 'admin'],
    default: 'student',
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended'],
    default: 'active',
  },
  firebaseUid: { type: String, required: true, unique: true },
  parentEmail: String,
  deviceFingerprints: [{ type: String }],
  currentDeviceId: String,
}, { timestamps: true })

export default mongoose.models.User || mongoose.model('User', UserSchema)
