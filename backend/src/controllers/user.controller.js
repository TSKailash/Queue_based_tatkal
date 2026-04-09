import User from "../models/User.js";

// Get Master List
export async function getMasterList(req, res) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("masterList");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ masterList: user.masterList || [] });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch master list" });
  }
}

// Add passenger to Master List
export async function addPassenger(req, res) {
  try {
    const userId = req.user.id;
    const { name, age } = req.body;

    if (!name || !age) {
      return res.status(400).json({ message: "Name and age are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.masterList.push({ name, age });
    await user.save();

    return res.json({ masterList: user.masterList });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add passenger" });
  }
}

// Remove passenger from Master List
export async function removePassenger(req, res) {
  try {
    const userId = req.user.id;
    const { id: passengerId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.masterList = user.masterList.filter(p => p._id.toString() !== passengerId);
    await user.save();

    return res.json({ masterList: user.masterList });
  } catch (err) {
    return res.status(500).json({ message: "Failed to remove passenger" });
  }
}
