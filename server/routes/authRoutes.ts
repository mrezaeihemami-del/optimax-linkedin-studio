import { Router } from 'express';
import { SettingsRepository } from '../db/settingsRepository.ts';
import { getDatabase } from '../db/database.ts';

export const authRouter = Router();

authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  const settings = SettingsRepository.getSettings();
  const expectedUser = settings.admin_username || 'admin';
  const expectedPass = settings.admin_password || 'admin1234';

  if (username === expectedUser && password === expectedPass) {
    return res.json({
      success: true,
      token: `optimax-token-${Date.now()}`,
      user: { username: expectedUser, role: 'admin' },
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid username or password' });
});

authRouter.post('/change-password', (req, res) => {
  const { current_password, new_password } = req.body;
  const settings = SettingsRepository.getSettings();
  const expectedPass = settings.admin_password || 'admin1234';

  if (current_password !== expectedPass) {
    return res.status(400).json({ success: false, error: 'Current password does not match' });
  }

  if (!new_password || new_password.trim().length < 4) {
    return res.status(400).json({ success: false, error: 'New password must be at least 4 characters' });
  }

  SettingsRepository.updateSettings({ admin_password: new_password.trim() });
  
  // Also update users table
  const db = getDatabase();
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run(new_password.trim(), settings.admin_username || 'admin');

  res.json({ success: true, message: 'Password changed successfully' });
});

