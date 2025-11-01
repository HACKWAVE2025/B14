const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    currentLevel: {
      type: Number,
      default: 1,
    },
    shieldCoins: {
      type: Number,
      default: 0,
    },
    registered: {
      type: Date,
      default: Date.now,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🧠 Update streak and shield points on login
userSchema.methods.updateLoginActivity = async function () {
  const today = new Date();
  const lastLoginDate = this.lastLogin ? new Date(this.lastLogin) : null;

  if (!lastLoginDate) {
    this.currentStreak = 1;
    this.shieldCoins += 20;
  } else {
    const diffDays =
      (today.setHours(0, 0, 0, 0) - lastLoginDate.setHours(0, 0, 0, 0)) /
      (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      this.currentStreak += 1;
      this.shieldCoins += 20 + 2 * this.currentStreak;
    } else if (diffDays > 1) {
      this.currentStreak = 1;
      this.shieldCoins += 20;
    }
  }

  this.lastLogin = new Date();
  await this.save();
};

module.exports =  mongoose.model("User", userSchema);
