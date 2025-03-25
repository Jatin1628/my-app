import type { NextPage } from "next";
import ChatHistory from "../../components/ChatHistory";

// Assume you get the current user from your session or context
const ProfilePage: NextPage = () => {
  // For example, currentUser.id could be coming from context or props
  const currentUser = { id: "604c8b6f1c4ae81234567890", name: "John Doe" };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome, {currentUser.name}</h1>
      <ChatHistory userId={currentUser.id} />
      {/* Other profile details */}
    </div>
  );
};

export default ProfilePage;
