import User from '../models/User.js';

// GET /profile/me
export async function getMyProfile(req, res) {
  res.json(req.user.toJSON());
}

// PUT /profile/me
export async function updateProfile(req, res) {
  const { name, bio } = req.body;

  if (name !== undefined) req.user.name = name;
  if (bio !== undefined) req.user.bio = bio;

  await req.user.save();
  res.json(req.user.toJSON());
}

// POST /profile/link-github
export async function linkGithub(req, res) {
  const { githubUrl } = req.body;
  req.user.githubUrl = githubUrl;
  await req.user.save();
  res.json(req.user.toJSON());
}

// PUT /profile/skills
export async function updateSkills(req, res) {
  const { skills } = req.body;
  req.user.skills = Array.isArray(skills) ? skills : [];
  await req.user.save();
  res.json(req.user.toJSON());
}
