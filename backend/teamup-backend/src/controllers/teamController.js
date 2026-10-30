import Team from '../models/Team.js';
import JoinRequest from '../models/Request.js';

// POST /teams
export async function createTeam(req, res) {
  const { name, description, maxMembers, skillsNeeded, isRecruiting } = req.body;

  if (typeof name !== 'string' || !name.trim() || typeof description !== 'string' || !description.trim() || maxMembers === undefined) {
    return res.status(400).json({ message: 'Name, description and maxMembers are required' });
  }
  const capacity = Number(maxMembers);
  if (!Number.isInteger(capacity) || capacity < 1) {
    return res.status(400).json({ message: 'Maximum members must be a whole number of at least 1' });
  }
  if (skillsNeeded !== undefined && !Array.isArray(skillsNeeded)) {
    return res.status(400).json({ message: 'Skills needed must be a list' });
  }
  if (isRecruiting !== undefined && typeof isRecruiting !== 'boolean') {
    return res.status(400).json({ message: 'Recruiting status must be true or false' });
  }

  const team = await Team.create({
    name: name.trim(),
    description: description.trim(),
    maxMembers: capacity,
    skillsNeeded: skillsNeeded || [],
    isRecruiting: isRecruiting !== false,
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
  const team = await Team.findById(req.params.teamId)
    .populate('members', 'name email skills bio githubUrl portfolioUrl')
    .populate('ownerId', 'name');
  if (!team) return res.status(404).json({ message: 'Team not found' });
  const data = team.toJSON();
  data.ownerName = team.ownerId?.name || '';
  data.ownerId = team.ownerId?._id || data.ownerId;
  data.isMember = team.members.some((member) => String(member._id) === String(req.user._id));
  if (data.isMember) data.currentUserRole = String(data.ownerId) === String(req.user._id) ? 'Owner' : 'Member';
  const application = await JoinRequest.findOne({ teamId: team._id, applicantId: req.user._id }).sort({ createdAt: -1 });
  data.myApplicationStatus = application?.status || null;
  res.json(data);
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
  }).populate('ownerId', 'name').sort({ createdAt: -1 });

  res.json(teams.map((team) => {
    const data = team.toJSON();
    data.ownerName = team.ownerId?.name || '';
    data.ownerId = team.ownerId?._id || data.ownerId;
    data.isMember = true;
    data.currentUserRole = String(data.ownerId) === String(req.user._id) ? 'Owner' : 'Member';
    return data;
  }));
}

// GET /teams/search?keyword=&skill=
export async function searchTeams(req, res) {
  const { keyword, skill, recruiting, hasCapacity, minMembers, maxMembers, sort = 'newest' } = req.query;
  const filter = {};

  if (keyword) {
    const escaped = String(keyword).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = { $regex: escaped, $options: 'i' };
  }
  if (skill) {
    const escaped = String(skill).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.skillsNeeded = { $regex: escaped, $options: 'i' };
  }
  if (recruiting === 'true') filter.isRecruiting = true;
  if (recruiting === 'false') filter.isRecruiting = false;
  const ordering = sort === 'name' ? { name: 1 } : sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
  let teams = await Team.find(filter).populate('ownerId', 'name').sort(ordering);
  if (hasCapacity === 'true') teams = teams.filter((team) => team.members.length < team.maxMembers);
  if (Number.isFinite(Number(minMembers)) && minMembers !== '') teams = teams.filter((team) => team.members.length >= Number(minMembers));
  if (Number.isFinite(Number(maxMembers)) && maxMembers !== '') teams = teams.filter((team) => team.members.length <= Number(maxMembers));
  const teamIds = teams.map((team) => team._id);
  const applications = await JoinRequest.find({ teamId: { $in: teamIds }, applicantId: req.user._id }).sort({ createdAt: -1 });
  const statusByTeam = new Map();
  for (const application of applications) {
    const key = String(application.teamId);
    if (!statusByTeam.has(key)) statusByTeam.set(key, application.status);
  }
  res.json(teams.map((team) => {
    const data = team.toJSON();
    data.ownerName = team.ownerId?.name || '';
    data.ownerId = team.ownerId?._id || data.ownerId;
    data.isMember = team.members.some((memberId) => String(memberId) === String(req.user._id));
    if (data.isMember) data.currentUserRole = String(data.ownerId) === String(req.user._id) ? 'Owner' : 'Member';
    data.myApplicationStatus = statusByTeam.get(String(team._id)) || null;
    return data;
  }));
}
