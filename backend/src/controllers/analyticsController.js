import Analytics from "../models/Analytics.js";

// Record a new view
export const recordView = async (req, res) => {
  try {
    const { path } = req.body;
    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Find analytics entry for this path and date, or create if not exists
    await Analytics.findOneAndUpdate(
      { path, date },
      { $inc: { views: 1 } }, // Increment view count
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "View recorded" });
  } catch (error) {
    console.error("Error recording view:", error);
    res.status(500).json({ message: "Failed to record view" });
  }
};

// Get analytics stats
export const getAnalyticsStats = async (req, res) => {
  try {
    // Total views across all time
    const totalViewsResult = await Analytics.aggregate([
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]);
    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].total : 0;

    // Get views for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const recentStats = await Analytics.find({
      date: { $gte: thirtyDaysAgoStr },
    }).sort({ date: 1 });

    res.status(200).json({
      totalViews,
      recentStats,
    });
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    res.status(500).json({ message: "Failed to fetch analytics stats" });
  }
};
