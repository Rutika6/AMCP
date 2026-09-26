import Team from '../models/Team.js';
import JoinRequest from '../models/Request.js';

// POST /teams
export async function createTeam(req, res) {
  const { name, description, maxMembers, skillsNeeded } = req.body;

  if (!name || !description || maxMembers === undefined) {
    return res.status(400).json({ message: 'Name, description and maxMembers are required' });
  }
  const capacity = Number(maxMembers);
  if (!Number.isInteger(capacity) || capacity < 1) {
    return res.status(400).json({ message: 'Maximum members must be a whole number of at least 1' });
  }

  const team = await Team.create({
    name,
    description,
    maxMembers: capacity,
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

  const { name, description, maxMembers, skillsNeeded, isRecruiting } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Team name is required' });
    }
    team.name = name.trim();
  }
  if (description !== undefined) {
    if (typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ message: 'Team description is required' });
    }
    team.description = description.trim();
  }
  if (maxMembers !== undefined) {
    const capacity = Number(maxMembers);
    if (!Number.isInteger(capacity) || capacity < team.members.length) {
      return res.status(400).json({
        message: `Maximum members must be a whole number of at least ${team.members.length}`,
      });
    }
    team.maxMembers = capacity;
  }
  if (skillsNeeded !== undefined) {
    if (!Array.isArray(skillsNeeded)) {
      return res.status(400).json({ message: 'Skills needed must be a list' });
    }
    team.skillsNeeded = skillsNeeded
      .filter((skill) => typeof skill === 'string')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }
  if (isRecruiting !== undefined) {
    if (typeof isRecruiting !== 'boolean') {
      return res.status(400).json({ message: 'Recruiting status must be true or false' });
    }
    team.isRecruiting = isRecruiting;
  }

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

// GET /teams/:teamId/members
export async function getTeamMembers(req, res) {
  const team = await Team.findById(req.params.teamId).populate('members', 'name email skills');
  if (!team) return res.status(404).json({ message: 'Team not found' });
  if (String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can manage members' });
  }

  res.json(team.members.map((member) => ({
    id: String(member._id),
    name: member.name,
    email: member.email,
    skills: member.skills || [],
    isOwner: String(member._id) === String(team.ownerId),
  })));
}

// DELETE /teams/:teamId/members/:memberId
export async function removeTeamMember(req, res) {
  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });
  if (String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can manage members' });
  }
  if (String(team.ownerId) === String(req.params.memberId)) {
    return res.status(400).json({ message: 'The team owner cannot be removed' });
  }
  if (!team.members.some((memberId) => String(memberId) === String(req.params.memberId))) {
    return res.status(404).json({ message: 'Member not found in this team' });
  }

  team.members = team.members.filter((memberId) => String(memberId) !== String(req.params.memberId));
  await team.save();
  await JoinRequest.deleteMany({
    teamId: team._id,
    applicantId: req.params.memberId,
    status: 'ACCEPTED',
  });
  res.json({ message: 'Member removed' });
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
