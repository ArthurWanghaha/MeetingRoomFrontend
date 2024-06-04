import React, { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TeamBox from "./TeamBox";
import api from "../../api/axiosConfig";
import { jwtDecode } from "jwt-decode";
import "./Teams.css";

const teamAvatar =
  "https://www.iconpacks.net/icons/1/free-network-team-icon-308-thumb.png";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [newMember, setNewMember] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [openMemberDialog, setOpenMemberDialog] = useState(false);
  const [openDeleteTeamDialog, setOpenDeleteTeamDialog] = useState(false);
  const [openDeleteMemberDialog, setOpenDeleteMemberDialog] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state variable to control visibility of management options

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    if (isLoggedIn) {
      const getUserIdFromToken = (token) => {
        if (typeof token === "string") {
          const decodedToken = jwtDecode(token);
          return decodedToken.userId;
        } else {
          console.error("Token is not a string:", token);
          return null;
        }
      };

      const userId = getUserIdFromToken(token);

      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/api/${userId}/user-details`);
          const userDetails = response.data;
          setCurrentUser(userDetails.username);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (currentUser) {
      fetchTeams(currentUser);
    }
  }, [currentUser]);

  const fetchTeams = async (username) => {
    try {
      const response = await api.get(`/teams/member/${username}`);
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName) return;

    try {
      const response = await api.post("/teams/create", null, {
        params: { name: teamName },
      });
      const newTeam = response.data;

      // Automatically add the current user as a member
      const updatedTeam = await api.put(
        `/teams/addMember/${newTeam.id}`,
        null,
        {
          params: { member: currentUser },
        }
      );

      setTeams([...teams, updatedTeam.data]);
      setTeamName("");
      setOpenTeamDialog(false);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      await api.delete(`/teams/delete/${teamToDelete.id}`);
      setTeams(teams.filter((team) => team.id !== teamToDelete.id));
      setSelectedTeam(null); // Deselect team if deleted
      setOpenDeleteTeamDialog(false);
    } catch (error) {
      console.error("Error deleting team:", error);
    }
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !newMember) return;

    try {
      const response = await api.put(
        `/teams/addMember/${selectedTeam.id}`,
        null,
        {
          params: { member: newMember },
        }
      );
      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id ? response.data : team
        )
      );
      setNewMember("");
      setOpenMemberDialog(false);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedTeam || !memberToDelete) return;

    try {
      const response = await api.put(
        `/teams/removeMember/${selectedTeam.id}`,
        null,
        {
          params: { member: memberToDelete },
        }
      );
      setTeams(
        teams.map((team) =>
          team.id === selectedTeam.id ? response.data : team
        )
      );
      setOpenDeleteMemberDialog(false);
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const openAddMemberDialog = (team) => {
    setSelectedTeam(team);
    setOpenMemberDialog(true);
  };

  const openDeleteTeamConfirmation = (team) => {
    setTeamToDelete(team);
    setOpenDeleteTeamDialog(true);
  };

  const openDeleteMemberConfirmation = (team, member) => {
    setSelectedTeam(team);
    setMemberToDelete(member);
    setOpenDeleteMemberDialog(true);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="teams">
      <Paper elevation={3}>
        <div
          className="header"
          style={{
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="title">Teams</div>
          <Button
            variant="contained"
            onClick={toggleEditing}
            style={{
              backgroundColor: isEditing ? "#f50057" : "#3f51b5", // Different colors for Manage Team and Finish Editing
              color: "white",
            }}
          >
            {isEditing ? "Finish Editing" : "Manage Team"}
          </Button>
        </div>
        <div className="teams-cont" style={{ paddingBottom: "20px" }}>
          {teams.map((team) => (
            <div key={team.id} className="team">
              <TeamBox title={team.name} image={teamAvatar} name={team.name}>
                {isEditing && (
                  <IconButton
                    aria-label="delete"
                    style={{ color: "darkgrey" }}
                    onClick={() => openDeleteTeamConfirmation(team)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TeamBox>
              <div className="members">
                {team.members.map((member, index) => (
                  <MemberBox
                    key={index}
                    member={member}
                    onDelete={() => openDeleteMemberConfirmation(team, member)}
                    isEditing={isEditing}
                  />
                ))}
              </div>
              {isEditing && (
                <IconButton
                  aria-label="add"
                  color="primary"
                  onClick={() => openAddMemberDialog(team)}
                >
                  <AddIcon />
                </IconButton>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: "10px", marginLeft: "10px" }} // Add margin to the button
            onClick={() => setOpenTeamDialog(true)}
          >
            Create Team
          </Button>
        )}
      </Paper>

      {/* Create Team Dialog */}
      <Dialog open={openTeamDialog} onClose={() => setOpenTeamDialog(false)}>
        <DialogTitle>Create Team</DialogTitle>
        <DialogContent>
          <TextField
            label="Team Name"
            variant="outlined"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTeamDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateTeam} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog
        open={openMemberDialog}
        onClose={() => setOpenMemberDialog(false)}
      >
        <DialogTitle>Add Member</DialogTitle>
        <DialogContent>
          <TextField
            label="New Member"
            variant="outlined"
            fullWidth
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMemberDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddMember} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog
        open={openDeleteTeamDialog}
        onClose={() => setOpenDeleteTeamDialog(false)}
      >
        <DialogTitle>Delete Team</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this team?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteTeamDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteTeam} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Member Confirmation Dialog */}
      <Dialog
        open={openDeleteMemberDialog}
        onClose={() => setOpenDeleteMemberDialog(false)}
      >
        <DialogTitle>Delete Member</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this member?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteMemberDialog(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteMember} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const MemberBox = ({ member, onDelete, isEditing }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await api.get(`/api/user-details/${member}`);
        setUserDetails(response.data);

        const pictureResponse = await api.get(
          `/api/username/${member}/get-profile-picture`,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([pictureResponse.data], { type: "image/jpeg" });
        const imageUrl = URL.createObjectURL(blob);
        setProfilePictureUrl(imageUrl);
      } catch (error) {
        console.error(
          "Error fetching member details or profile picture:",
          error
        );
      }
    };

    fetchMemberDetails();
  }, [member]);

  if (!userDetails) return null;

  return (
    <TeamBox
      title={userDetails.jobTitle}
      image={profilePictureUrl}
      name={userDetails.username}
    >
      {isEditing && (
        <IconButton
          aria-label="delete"
          style={{ color: "darkgrey" }}
          onClick={onDelete}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </TeamBox>
  );
};
