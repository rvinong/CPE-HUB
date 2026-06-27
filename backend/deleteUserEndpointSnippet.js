// Add this to backend/server.js

// Delete user account
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    const userIdToDelete = req.params.id;
    const requestingUserId = req.user.id;
    const requestingUserIsAdmin = req.user.isAdmin;

    // Allow deletion if the user is deleting their own account or if admin
    if (requestingUserId !== userIdToDelete && !requestingUserIsAdmin) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own account' });
    }

    const user = await User.findByIdAndDelete(userIdToDelete);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
