import JoinRequest from '../models/Request.js';
import Team from '../models/Team.js';
import Notification from '../models/Notification.js';

// POST /teams/:teamId/requests
export async function applyToTeam(req, res) {
  const { teamId } = req.params;
  const { message } = req.body;

  const team = await Team.findById(teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  if (String(team.ownerId) === String(req.user._id)) {
    return res.status(400).json({ message: 'You cannot apply to your own team' });
  }
  if (team.members.some((memberId) => String(memberId) === String(req.user._id))) {
    return res.status(409).json({ message: 'You are already a member of this team' });
  }
  if (team.isRecruiting === false) {
    return res.status(400).json({ message: 'This team is not currently accepting applications' });
  }
  if (team.members.length >= team.maxMembers) {
    return res.status(400).json({ message: 'This team has no vacancies' });
  }

  const existing = await JoinRequest.findOne({
    teamId,
    applicantId: req.user._id,
    status: 'PENDING',
  });
  if (existing) {
    return res.status(409).json({ message: 'You already have a pending application for this team' });
  }

  const request = await JoinRequest.create({
    teamId,
    applicantId: req.user._id,
    message,
  });

  // Notify the team owner (US-16)
  await Notification.create({
    userId: team.ownerId,
    message: `${req.user.name} applied to join "${team.name}"`,
    teamId: team._id,
  });

  res.status(201).json(request.toJSON());
}

// GET /teams/:teamId/requests
export async function getRequestsForTeam(req, res) {
  const team = await Team.findById(req.params.teamId);
  if (!team) return res.status(404).json({ message: 'Team not found' });

  if (String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can view requests' });
  }

  const requests = await JoinRequest.find({ teamId: team._id })
    .populate('applicantId', 'name email')
    .sort({ createdAt: -1 });

  const shaped = requests.map((r) => ({
    ...r.toJSON(),
    applicantName: r.applicantId?.name,
    applicantId: r.applicantId?._id,
  }));

  res.json(shaped);
}

// PUT /requests/:requestId
export async function respondToRequest(req, res) {
  const { status } = req.body; // 'ACCEPTED' | 'REJECTED'
  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Status must be ACCEPTED or REJECTED' });
  }

  const request = await JoinRequest.findById(req.params.requestId);
  if (!request) return res.status(404).json({ message: 'Request not found' });

  const team = await Team.findById(request.teamId);
  if (!team || String(team.ownerId) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Only the team owner can respond to this request' });
  }
  if (request.status !== 'PENDING') {
    return res.status(409).json({ message: 'This request has already been reviewed' });
  }

  if (status === 'ACCEPTED' && !team.members.some((m) => String(m) === String(request.applicantId))) {
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: 'This team has no vacancies' });
    }
  }

  request.status = status;
  await request.save();

  if (status === 'ACCEPTED') {
    if (!team.members.some((m) => String(m) === String(request.applicantId))) {
      team.members.push(request.applicantId);
      await team.save();
    }
  }

  // Notify the applicant (US-16, US-17)
  await Notification.create({
    userId: request.applicantId,
    message:
      status === 'ACCEPTED'
        ? `Your application to join "${team.name}" was accepted`
        : `Your application to join "${team.name}" was rejected`,
    teamId: team._id,
  });

  res.json(request.toJSON());
}

// GET /requests/mine
export async function getMyApplications(req, res) {
  const requests = await JoinRequest.find({ applicantId: req.user._id })
    .populate('teamId', 'name')
    .sort({ createdAt: -1 });

  const shaped = requests.map((r) => ({
    ...r.toJSON(),
    teamName: r.teamId?.name,
    teamId: r.teamId?._id,
  }));

  res.json(shaped);
}
