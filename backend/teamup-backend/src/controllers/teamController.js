import Team from '../models/Team.js';

// POST /teams
export async function createTeam(req, res) {
  const { name, description, maxMembers, skillsNeeded } = req.body;

  if (!name || !description || !maxMembers) {
    return res.status(400).json({ message: 'Name, description and maxMembers are required' });
  }

  const team = await Team.create({
    name,
    description,
    maxMembers,
    skillsNeeded: skillsNeeded || [],
    ownerId: req.user._id,
    members: [req.user._id],
  });

  res.status(201).json(team.toJSON());
}

// PUT /teams/:teamId
export async function updateTeam(req, res) {
  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  if (String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can edit this team' });
  }

  const { name, description, maxMembers, skillsNeeded } = req.body;
  if (name !== undefined) team.name = name;
  if (description !== undefined) team.description = description;
  if (maxMembers !== undefined) team.maxMembers = maxMembers;
  if (skillsNeeded !== undefined) team.skillsNeeded = skillsNeeded;

  await team.save();
  res.json(team.toJSON());
}

// DELETE /teams/:teamId
export async function deleteTeam(req, res) {
  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  if (String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can delete this team' });
  }

  await team.deleteOne();
  res.json({ message: 'Team deleted' });
}

// GET /teams/:teamId
export async function getTeamById(req, res) {
  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });
  res.json(team.toJSON());
}

// GET /teams/mine
export async function getMyTeams(req, res) {
  const teams = await Team.find({
    $or: [{ ownerId: req.user._id }, { members: req.user._id }],
  }).sort({ createdAt: -1 });

  res.json(teams.map((t) => t.toJSON()));
}

// GET /teams/search?keyword=&skill=
export async function searchTeams(req, res) {
  const { keyword, skill } = req.query;
  const filter = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: 'i' };
  }
  if (skill) {
    filter.skillsNeeded = { $regex: skill, $options: 'i' };
  }

  const teams = await Team.find(filter).sort({ createdAt: -1 });
  res.json(teams.map((t) => t.toJSON()));
}
