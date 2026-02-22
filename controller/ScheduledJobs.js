const cron = require("node-cron");
const User = require("./models/User");

cron.schedule("0 0 * * *", async () => {

  const now = new Date();

  const usersToDelete = await User.find({
    deleteRequested: true,
    deleteScheduledAt: { $lte: now },
  });

  for (const user of usersToDelete) {

    await User.findByIdAndDelete(user._id);

    console.log("Deleted user:", user.email);
  }

});
