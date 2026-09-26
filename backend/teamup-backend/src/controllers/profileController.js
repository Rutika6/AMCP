import User from '../models/User.js';

// GET /profile/me
export async function getMyProfile(req, res) {
  res.json(req.user.toJSON());
}

// PUT /profile/me
export async function updateProfile(req, res) {
  const { name, bio, githubUrl, portfolioUrl, collegeName, course, graduationYear, skills } = req.body;

  if (name !== undefined) {
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    if (!trimmedName) {
      return res.status(400).json({ message: 'Name is required' });
    }
    req.user.name = trimmedName;
  }
  if (bio !== undefined) req.user.bio = bio;
  if (githubUrl !== undefined) req.user.githubUrl = githubUrl;
  if (portfolioUrl !== undefined) req.user.portfolioUrl = portfolioUrl;
  if (collegeName !== undefined) req.user.collegeName = collegeName;
  if (course !== undefined) req.user.course = course;
  if (graduationYear !== undefined) req.user.graduationYear = graduationYear;
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be a list' });
    }
    req.user.skills = skills
      .filter((skill) => typeof skill === 'string')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

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
